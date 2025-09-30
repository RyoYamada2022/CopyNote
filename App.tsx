
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NoteCreator from './components/NoteCreator';
import NoteGrid from './components/NoteGrid';
import Toast from './components/Toast';
import NoteEditorModal from './components/NoteEditorModal';
import ImageCopyModal from './components/ImageCopyModal';
import SearchModal from './components/SearchModal';
import SelectionToolbar from './components/SelectionToolbar';
import MoveNoteModal from './components/MoveNoteModal';
import ConfirmationModal from './components/ConfirmationModal';
import WelcomeModal from './components/WelcomeModal';
import EditTagsModal from './components/EditTagsModal';
import SituationalAnimation from './components/SituationalAnimation';
import ShortcutsModal from './components/ShortcutsModal';
import { ALL_NOTES, ALL_FOLDERS, NOTE_COLORS, DEFAULT_TAGS, MOTIVATIONAL_QUOTES } from './constants';
import { themes } from './themes';
// FIX: Import ImageAttachment type to correctly type the image copy modal state.
import type { Note, Folder, NoteVersion, NoteDraft, Category, SortOption, Tag, ImageAttachment } from './types';

interface ToastState {
  message: string;
  onUndo?: () => void;
}

interface ActiveSelection {
  type: 'folder' | 'category' | 'special' | 'tag';
  id: number | string;
}

interface ConfirmationModalState {
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    onConfirm: () => void;
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const App: React.FC = () => {
  const [themeId, setThemeId] = useState<string>(() => {
    return localStorage.getItem('copyNoteThemeId') || 'theme-graphite';
  });
  
  const [glowColor, setGlowColor] = useState<string | null>(() => {
    return localStorage.getItem('copyNoteGlowColor');
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    const savedFoldersJSON = localStorage.getItem('folders');
    if (savedFoldersJSON) {
      try {
        const parsedFolders = JSON.parse(savedFoldersJSON);
        if (!Array.isArray(parsedFolders)) {
          throw new Error('Saved folders data is not an array.');
        }
        // An empty array is a valid state if the user has deleted all folders.
        return parsedFolders;
      } catch (e) {
        console.error('Failed to parse folders, creating a backup.', e);
        try {
          localStorage.setItem('folders_corrupted_backup_' + Date.now(), savedFoldersJSON);
        } catch (backupError) {
          console.error('Failed to create backup of corrupted folders:', backupError);
        }
        return ALL_FOLDERS; // Reset to default if corrupt, after backing up.
      }
    }
    return ALL_FOLDERS;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotesJSON = localStorage.getItem('notes');
    if (savedNotesJSON) { // This will be true for "[]" as well, which is correct.
      try {
        const parsedNotes = JSON.parse(savedNotesJSON);
        if (Array.isArray(parsedNotes)) {
          return parsedNotes;
        }
        throw new Error('Saved notes data is not an array.');
      } catch (e) {
        console.error('Failed to parse notes, creating a backup.', e);
        try {
          localStorage.setItem('notes_corrupted_backup_' + Date.now(), savedNotesJSON);
        } catch (backupError) {
          console.error('Failed to create backup of corrupted notes:', backupError);
        }
        // If parsing fails, fall back to default notes to prevent app from crashing.
        return ALL_NOTES;
      }
    }
    // Only return default notes if 'notes' key is completely missing from localStorage.
    return ALL_NOTES;
  });

  const [tags, setTags] = useState<Tag[]>(() => {
    const savedTagsJSON = localStorage.getItem('tags');
    if (savedTagsJSON) {
        try {
            return JSON.parse(savedTagsJSON);
        } catch (e) {
            console.error('Failed to parse tags.', e);
            return DEFAULT_TAGS;
        }
    }
    return DEFAULT_TAGS;
  });

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeSelection, setActiveSelection] = useState<ActiveSelection>({ type: 'special', id: 'Notas' });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  // FIX: Update state to handle ImageAttachment objects, not just strings.
  const [imageCopyModalContent, setImageCopyModalContent] = useState<(string | ImageAttachment)[] | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedNoteIds, setSelectedNoteIds] = useState<number[]>([]);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [confirmationState, setConfirmationState] = useState<ConfirmationModalState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const [sortOption, setSortOption] = useState<SortOption>(() => {
    return (localStorage.getItem('copyNoteSortOption') as SortOption) || 'date-desc';
  });
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isEditTagsModalOpen, setIsEditTagsModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sidebarRef = useRef<{ triggerImport: () => void }>(null);
  const noteCreatorRef = useRef<{ focus: () => void }>(null);
  const quoteTimerRef = useRef<number | null>(null);
  
  useEffect(() => {
    const root = window.document.documentElement;
    themes.forEach(theme => root.classList.remove(theme.id));
    root.classList.add(themeId);
    localStorage.setItem('copyNoteThemeId', themeId);
  }, [themeId]);
  
  useEffect(() => {
    localStorage.setItem('copyNoteSortOption', sortOption);
  }, [sortOption]);
  
  useEffect(() => {
    const root = document.documentElement;
    if (glowColor) {
        const rgb = hexToRgb(glowColor);
        if (rgb) {
            root.style.setProperty('--glow-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
        }
        localStorage.setItem('copyNoteGlowColor', glowColor);
    } else {
        root.style.removeProperty('--glow-color-rgb');
        localStorage.removeItem('copyNoteGlowColor');
    }
  }, [glowColor]);

  const showToast = useCallback((message: string, onUndo?: () => void) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ message, onUndo });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 5000); // 5-second duration
  }, []);

  useEffect(() => {
    try {
      const notesForStorage = notes.map(({ history, ...note }) => note);
      localStorage.setItem('notes', JSON.stringify(notesForStorage));
    } catch (e) {
      console.error('Failed to save notes to localStorage:', e);
      if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.message.includes('quota'))) {
          showToast('Error: Límite de almacenamiento excedido. Intenta eliminar algunas notas con imágenes grandes.');
      }
    }
  }, [notes, showToast]);

  useEffect(() => {
    try {
      localStorage.setItem('folders', JSON.stringify(folders));
    } catch (e) {
      console.error('Failed to save folders to localStorage:', e);
    }
  }, [folders]);

  useEffect(() => {
    try {
        localStorage.setItem('tags', JSON.stringify(tags));
    } catch(e) {
        console.error('Failed to save tags to localStorage:', e);
    }
  }, [tags]);
  
  useEffect(() => {
    const welcomeShown = localStorage.getItem('copyNoteWelcomeShown_v1');
    if (!welcomeShown) {
        setIsWelcomeModalOpen(true);
        localStorage.setItem('copyNoteWelcomeShown_v1', 'true');
    }
  }, []);

  useEffect(() => {
    const scheduleNextQuote = () => {
        if (quoteTimerRef.current) {
            clearTimeout(quoteTimerRef.current);
        }

        // Random time between 3 and 7 minutes
        const minDelay = 3 * 60 * 1000;
        const maxDelay = 7 * 60 * 1000;
        const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;

        quoteTimerRef.current = window.setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
            const quote = MOTIVATIONAL_QUOTES[randomIndex];
            showToast(quote);
            scheduleNextQuote(); // Schedule the next one after showing one
        }, randomDelay);
    };

    scheduleNextQuote();

    // Cleanup on unmount
    return () => {
        if (quoteTimerRef.current) clearTimeout(quoteTimerRef.current);
    };
  }, [showToast]);

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const toggleViewMode = useCallback(() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid'), []);
  
  const handleToastDismiss = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast(null);
  }, []);

  const performSaveOperation = useCallback((updateFunction: () => void) => {
    setIsLoading(true);
    setTimeout(() => {
        try {
            updateFunction();
        } finally {
            setTimeout(() => setIsLoading(false), 300);
        }
    }, 20);
  }, []);

  const addNote = useCallback((newNoteData: Omit<Note, 'id' | 'pinned' | 'status' | 'createdAt'>) => {
    performSaveOperation(() => {
        const now = Date.now();
        const newNote: Note = {
          id: now,
          createdAt: now,
          pinned: false,
          status: 'active',
          ...newNoteData
        };
        setNotes(prevNotes => [newNote, ...prevNotes]);
    });
  }, [performSaveOperation]);
  
  const updateNote = useCallback((id: number, updatedData: Partial<Omit<Note, 'id'>>) => {
    performSaveOperation(() => {
        setNotes(prevNotes => {
          const noteToUpdate = prevNotes.find(note => note.id === id);
          if (!noteToUpdate) {
            return prevNotes;
          }

          const hasContentChanged = (
              (updatedData.title !== undefined && updatedData.title !== noteToUpdate.title) ||
              (updatedData.content !== undefined && updatedData.content !== noteToUpdate.content)
          );

          const newHistory = hasContentChanged
            ? [
                {
                  title: noteToUpdate.title,
                  content: noteToUpdate.content,
                  listItems: noteToUpdate.listItems,
                  timestamp: Date.now(),
                },
                ...(noteToUpdate.history || [])
              ].slice(0, 5)
            : noteToUpdate.history;
          
          const finalUpdatedData = { ...updatedData };
          
          if (finalUpdatedData.content !== undefined) {
            finalUpdatedData.listItems = undefined;
          }

          return prevNotes.map(note =>
            note.id === id
              ? { ...note, ...finalUpdatedData, history: newHistory }
              : note
          );
        });
    });
  }, [performSaveOperation]);

  const updateNoteStatus = useCallback((id: number, status: Note['status']) => {
    const originalNotes = [...notes];
    const noteToUpdate = originalNotes.find(note => note.id === id);
    if (!noteToUpdate) return;
    
    const originalStatus = noteToUpdate.status;

    performSaveOperation(() => {
        const newNotes = originalNotes.map(note => 
            note.id === id 
            ? { ...note, status, pinned: status !== 'active' ? false : note.pinned } 
            : note
        );
        setNotes(newNotes);
    });

    const undoAction = () => {
        performSaveOperation(() => {
            setNotes(originalNotes);
        });
    }
    
    if (status === 'trashed') {
      showToast('Nota movida a la papelera.', undoAction);
    } else if (status === 'archived') {
      showToast('Nota archivada.', undoAction);
    } else if (status === 'active') {
       if (originalStatus === 'archived') {
         showToast('Nota desarchivada.', undoAction);
       }
    }
  }, [notes, showToast, performSaveOperation]);

  const permanentlyDeleteNote = useCallback((id: number) => {
    performSaveOperation(() => {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    });
    showToast('Nota eliminada permanentemente.');
  }, [showToast, performSaveOperation]);
  
  const emptyTrash = useCallback(() => {
    const trashedNotesExist = notes.some(note => note.status === 'trashed');
    if (!trashedNotesExist) return;

    setConfirmationState({
        isOpen: true,
        title: 'Vaciar papelera',
        message: '¿Estás seguro? Todas las notas de la papelera se eliminarán permanentemente. Esta acción no se puede deshacer.',
        onConfirm: () => {
            performSaveOperation(() => {
                setNotes(prevNotes => prevNotes.filter(note => note.status !== 'trashed'));
            });
            showToast('Papelera vaciada.');
        }
    });
  }, [notes, showToast, performSaveOperation]);
  
  const handleNoteClick = useCallback((note: Note) => {
    if (note.status !== 'trashed') {
      setEditingNote(note);
    }
    setIsSearchModalOpen(false);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setEditingNote(null);
  }, []);

  const handleToggleNoteSelection = useCallback((id: number) => {
    setSelectedNoteIds(prev => {
        const newSelection = new Set(prev);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        return Array.from(newSelection);
    });
  }, []);

  const archiveSelectedNotes = useCallback(() => {
    performSaveOperation(() => {
        setNotes(prevNotes => prevNotes.map(note =>
            selectedNoteIds.includes(note.id)
                ? { ...note, status: 'archived', pinned: false }
                : note
        ));
    });
    showToast(`${selectedNoteIds.length} nota(s) archivada(s).`);
    setSelectedNoteIds([]);
  }, [selectedNoteIds, showToast, performSaveOperation]);

  const trashSelectedNotes = useCallback(() => {
    performSaveOperation(() => {
        setNotes(prevNotes => prevNotes.map(note =>
            selectedNoteIds.includes(note.id)
                ? { ...note, status: 'trashed', pinned: false }
                : note
        ));
    });
    showToast(`${selectedNoteIds.length} nota(s) movida(s) a la papelera.`);
    setSelectedNoteIds([]);
  }, [selectedNoteIds, showToast, performSaveOperation]);

  const handleMoveNotes = useCallback((folderId: number, categoryId: number) => {
    performSaveOperation(() => {
        setNotes(prevNotes =>
          prevNotes.map(note =>
            selectedNoteIds.includes(note.id)
              ? { ...note, folderId, categoryId }
              : note
          )
        );
    });
    showToast(`${selectedNoteIds.length} nota(s) movida(s).`);
    setSelectedNoteIds([]);
    setIsMoveModalOpen(false);
  }, [selectedNoteIds, showToast, performSaveOperation]);

  const handleMoveSingleNote = useCallback((noteId: number) => {
    setSelectedNoteIds([noteId]);
    setIsMoveModalOpen(true);
  }, []);

  const handleCreateFolder = useCallback((folderName: string) => {
    performSaveOperation(() => {
        const newFolder: Folder = {
          id: Date.now() + Math.random(),
          name: folderName,
          color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
          categories: [
            { id: Date.now() + Math.random() + 1, name: 'General', color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)] }
          ],
        };
        setFolders(prev => [...prev, newFolder]);
    });
    showToast(`Carpeta "${folderName}" creada.`);
  }, [showToast, performSaveOperation]);

  const handleCreateCategory = useCallback((folderId: number, categoryName: string) => {
    performSaveOperation(() => {
        const newCategory: Category = {
          id: Date.now() + Math.random(),
          name: categoryName,
          color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
        };

        setFolders(currentFolders => {
          let folderName = '';
          const newFolders = currentFolders.map(f => {
            if (f.id === folderId) {
              folderName = f.name;
              return { ...f, categories: [...f.categories, newCategory] };
            }
            return f;
          });

          if (folderName) {
            showToast(`Categoría "${categoryName}" creada en "${folderName}".`);
          } else {
            console.error("Could not find folder to create category in.", { folderId, currentFolders });
          }
          return newFolders;
        });
    });
  }, [showToast, performSaveOperation]);

  const handleUpdateFolder = useCallback((folderId: number, updatedData: Partial<Omit<Folder, 'id' | 'categories'>>) => {
    performSaveOperation(() => {
        setFolders(prevFolders =>
          prevFolders.map(folder =>
            folder.id === folderId ? { ...folder, ...updatedData } : folder
          )
        );
    });
  }, [performSaveOperation]);

  const handleUpdateCategory = useCallback((folderId: number, categoryId: number, updatedData: Partial<Omit<Category, 'id'>>) => {
    performSaveOperation(() => {
        setFolders(prevFolders =>
          prevFolders.map(folder => {
            if (folder.id === folderId) {
              return {
                ...folder,
                categories: folder.categories.map(category =>
                  category.id === categoryId ? { ...category, ...updatedData } : category
                ),
              };
            }
            return folder;
          })
        );
    });
  }, [performSaveOperation]);

  const handleDeleteFolder = useCallback((folderId: number) => {
    if (folders.length <= 1) {
        showToast('No se puede eliminar la última carpeta.');
        return;
    }
    const folderToDelete = folders.find(f => f.id === folderId);
    if (!folderToDelete) return;

    setConfirmationState({
        isOpen: true,
        title: `Eliminar carpeta "${folderToDelete.name}"`,
        message: `¿Estás seguro? Las notas que contiene se moverán a otra carpeta. Esta acción no se puede deshacer.`,
        onConfirm: () => {
            performSaveOperation(() => {
                const categoryIdsToDelete = folderToDelete.categories.map(c => c.id);
                const fallbackFolder = folders.find(f => f.id !== folderId)!;
                const fallbackCategoryId = fallbackFolder.categories[0].id;

                setNotes(prevNotes => prevNotes.map(note => {
                    if (categoryIdsToDelete.includes(note.categoryId)) {
                        return { ...note, folderId: fallbackFolder.id, categoryId: fallbackCategoryId };
                    }
                    return note;
                }));

                setFolders(prevFolders => prevFolders.filter(f => f.id !== folderId));
                
                if (activeSelection.type === 'folder' && activeSelection.id === folderId) {
                    setActiveSelection({ type: 'special', id: 'Notas' });
                }
            });
            showToast(`Carpeta "${folderToDelete.name}" eliminada.`);
        }
    });
  }, [folders, showToast, activeSelection, performSaveOperation]);

  const handleDeleteCategory = useCallback((folderId: number, categoryId: number) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;

    if (folder.categories.length <= 1) {
        showToast('No se puede eliminar la última categoría de una carpeta.');
        return;
    }
    
    const categoryToDelete = folder.categories.find(c => c.id === categoryId);
    if (!categoryToDelete) return;

    setConfirmationState({
        isOpen: true,
        title: `Eliminar categoría "${categoryToDelete.name}"`,
        message: (
            <>
                ¿Estás seguro? Las notas que contiene se moverán a otra categoría dentro de "{folder.name}". Esta acción no se puede deshacer.
            </>
        ),
        onConfirm: () => {
            performSaveOperation(() => {
                const fallbackCategory = folder.categories.find(c => c.id !== categoryId)!;

                setNotes(prevNotes => prevNotes.map(note => {
                    if (note.categoryId === categoryId) {
                        return { ...note, categoryId: fallbackCategory.id };
                    }
                    return note;
                }));

                setFolders(prevFolders => prevFolders.map(f => {
                    if (f.id === folderId) {
                        return { ...f, categories: f.categories.filter(c => c.id !== categoryId) };
                    }
                    return f;
                }));
                
                if (activeSelection.type === 'category' && activeSelection.id === categoryId) {
                    setActiveSelection({ type: 'folder', id: folderId });
                }
            });
            showToast(`Categoría "${categoryToDelete.name}" eliminada.`);
        }
    });
  }, [folders, showToast, activeSelection, performSaveOperation]);

  const handleReorderFolders = useCallback((reorderedFolders: Folder[]) => {
    performSaveOperation(() => {
        setFolders(reorderedFolders);
    });
  }, [performSaveOperation]);

  const handleCreateTag = useCallback((tagName: string) => {
    if (tagName.trim() && !tags.some(t => t.name.toLowerCase() === tagName.trim().toLowerCase())) {
        performSaveOperation(() => {
            const newTag: Tag = {
                name: tagName.trim(),
                color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)]
            };
            setTags(prev => [newTag, ...prev]);
        });
        showToast(`Etiqueta "${tagName.trim()}" creada.`);
    } else {
        showToast(`La etiqueta "${tagName.trim()}" ya existe.`, undefined);
    }
  }, [tags, showToast, performSaveOperation]);

  const handleDeleteTag = useCallback((tagName: string) => {
    setConfirmationState({
        isOpen: true,
        title: `Eliminar etiqueta "${tagName}"`,
        message: '¿Estás seguro? La etiqueta se eliminará de todas las notas. Esta acción no se puede deshacer.',
        onConfirm: () => {
            performSaveOperation(() => {
                setTags(prev => prev.filter(t => t.name !== tagName));
                setNotes(prevNotes => prevNotes.map(note => ({
                    ...note,
                    tags: note.tags?.filter(t => t !== tagName)
                })));
                if (activeSelection.type === 'tag' && activeSelection.id === tagName) {
                    setActiveSelection({ type: 'special', id: 'Notas' });
                }
            });
            showToast(`Etiqueta "${tagName}" eliminada.`);
        }
    });
  }, [showToast, activeSelection, performSaveOperation]);

  const handleUpdateTag = useCallback((oldName: string, updatedData: { newName?: string; color?: string }) => {
    const newName = updatedData.newName?.trim();
    if (newName && newName !== oldName && tags.some(t => t.name.toLowerCase() === newName.toLowerCase())) {
        showToast(`La etiqueta "${newName}" ya existe.`, undefined);
        return;
    }
    
    performSaveOperation(() => {
        setTags(prev => prev.map(t => {
            if (t.name === oldName) {
                return { name: newName || t.name, color: updatedData.color || t.color };
            }
            return t;
        }));

        if (newName && newName !== oldName) {
            setNotes(prevNotes => prevNotes.map(note => ({
                ...note,
                tags: note.tags?.map(t => t === oldName ? newName : t)
            })));
            if (activeSelection.type === 'tag' && activeSelection.id === oldName) {
                setActiveSelection({ type: 'tag', id: newName });
            }
        }
    });
  }, [tags, showToast, activeSelection, performSaveOperation]);

  const handleExportData = useCallback(() => {
    try {
        const dataToExport = {
            notes,
            folders,
            tags,
            exportedAt: new Date().toISOString(),
            version: 'CopyNote_v1.0'
        };

        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        const date = new Date();
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        a.href = url;
        a.download = `CopyNote_backup_${dateString}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Datos exportados correctamente.');
    } catch (error) {
        console.error('Error exporting data:', error);
        showToast('Error al exportar los datos.');
    }
  }, [notes, folders, tags, showToast]);

  const handleImportFile = useCallback((file: File) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
        try {
            const result = event.target?.result;
            if (typeof result !== 'string') {
                throw new Error("File content is not a string.");
            }
            const data = JSON.parse(result);

            if (!data || !Array.isArray(data.notes) || !Array.isArray(data.folders) || !Array.isArray(data.tags)) {
                throw new Error('Invalid file structure.');
            }

            setConfirmationState({
                isOpen: true,
                title: 'Importar datos',
                message: (
                    <>
                        <p>Esto reemplazará <strong>todas</strong> tus notas, carpetas y etiquetas actuales por el contenido del archivo.</p>
                        <p className="mt-2 font-semibold text-red-500">Esta acción no se puede deshacer. ¿Deseas continuar?</p>
                    </>
                ),
                onConfirm: () => {
                    performSaveOperation(() => {
                        setNotes(data.notes);
                        setFolders(data.folders);
                        setTags(data.tags);
                        setActiveSelection({ type: 'special', id: 'Notas' });
                    });
                    showToast('Datos importados correctamente.');
                },
            });

        } catch (error) {
            console.error('Error importing data:', error);
            showToast('Error: El archivo de importación no es válido o está corrupto.');
        }
    };
    
    reader.onerror = () => {
        showToast('Error al leer el archivo.');
    };

    reader.readAsText(file);
  }, [showToast, performSaveOperation]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (selectedNoteIds.length > 0) {
          setSelectedNoteIds([]);
          return;
        }
      }

      const activeEl = document.activeElement;
      const isInputActive = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement).isContentEditable
      );

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        if (!isInputActive) {
            event.preventDefault();
            setIsSearchModalOpen(prev => !prev);
        }
        return;
      }

      const isModalOpen = editingNote || isSearchModalOpen || isMoveModalOpen || confirmationState.isOpen || isWelcomeModalOpen || isEditTagsModalOpen;
      if (isInputActive || isModalOpen) {
        return;
      }

      if (event.metaKey || event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case 's':
            event.preventDefault();
            handleExportData();
            break;
          case 'o':
            event.preventDefault();
            sidebarRef.current?.triggerImport();
            break;
          case 'e':
            event.preventDefault();
            toggleSidebar();
            break;
          case 'j':
            event.preventDefault();
            toggleViewMode();
            break;
          case 'b':
            event.preventDefault();
            noteCreatorRef.current?.focus();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    selectedNoteIds.length,
    isSearchModalOpen,
    editingNote,
    isMoveModalOpen,
    confirmationState.isOpen,
    isWelcomeModalOpen,
    isEditTagsModalOpen,
    handleExportData,
    toggleSidebar,
    toggleViewMode,
  ]);


  const displayedNotes = useMemo(() => {
    let sourceNotes: Note[];

    if (activeSelection.type === 'special' && activeSelection.id === 'Papelera') {
        sourceNotes = notes.filter(note => note.status === 'trashed');
        return sourceNotes;
    } else if (activeSelection.type === 'special' && activeSelection.id === 'Archivar') {
        sourceNotes = notes.filter(note => note.status === 'archived');
    } else { 
        sourceNotes = notes.filter(note => note.status === 'active');
        if (activeSelection.type === 'special' && activeSelection.id === 'Notas') {
            // No additional filtering needed
        } else if (activeSelection.type === 'category') {
            sourceNotes = sourceNotes.filter(note => note.categoryId === activeSelection.id);
        } else if (activeSelection.type === 'folder') {
            const folder = folders.find(f => f.id === activeSelection.id);
            const categoryIds = folder ? folder.categories.map(c => c.id) : [];
            sourceNotes = sourceNotes.filter(note => categoryIds.includes(note.categoryId));
        } else if (activeSelection.type === 'tag') {
            sourceNotes = sourceNotes.filter(note => note.tags?.includes(activeSelection.id as string));
        }
    }
    
    const filteredNotes = sourceNotes.filter(note => {
        if (searchTerm.trim() === '') return true;
        const searchLower = searchTerm.toLowerCase();
        
        const listContent = (note.listItems || []).map(item => item.text).join(' ');

        return (
          note.title.toLowerCase().includes(searchLower) ||
          note.content.toLowerCase().includes(searchLower) ||
          listContent.toLowerCase().includes(searchLower) ||
          (note.tags || []).some(tag => tag.toLowerCase().includes(searchLower))
        );
    });

    const sortedNotes = [...filteredNotes].sort((a, b) => {
        switch (sortOption) {
            case 'date-asc':
                return a.createdAt - b.createdAt;
            case 'title-asc':
                return a.title.localeCompare(b.title);
            case 'title-desc':
                return b.title.localeCompare(a.title);
            case 'color':
                const colorAIndex = NOTE_COLORS.indexOf(a.color || '');
                const colorBIndex = NOTE_COLORS.indexOf(b.color || '');
                return (colorAIndex === -1 ? Infinity : colorAIndex) - (colorBIndex === -1 ? Infinity : colorBIndex);
            case 'date-desc':
            default:
                return b.createdAt - a.createdAt;
        }
    });
    
    const pinned = sortedNotes.filter(n => n.pinned);
    const others = sortedNotes.filter(n => !n.pinned);
    return [...pinned, ...others];

  }, [notes, activeSelection, searchTerm, folders, sortOption]);

  const isSpecialView = activeSelection.type === 'special' || activeSelection.type === 'tag';
  const pinnedNotes = isSpecialView ? [] : displayedNotes.filter(note => note.pinned);
  const otherNotes = isSpecialView ? displayedNotes : displayedNotes.filter(note => !note.pinned);
  
  const closeConfirmationModal = () => setConfirmationState(prev => ({ ...prev, isOpen: false }));

  return (
    <>
      <div className="flex flex-col min-h-screen text-[var(--text-primary)] bg-transparent">
        <Header 
          onMenuClick={toggleSidebar} 
          onSearchClick={() => setIsSearchModalOpen(true)}
          viewMode={viewMode}
          onViewModeToggle={toggleViewMode}
          themes={themes}
          activeThemeId={themeId}
          onThemeChange={setThemeId}
          sortOption={sortOption}
          onSortChange={setSortOption}
          isLoading={isLoading}
          glowColor={glowColor}
          onGlowColorChange={setGlowColor}
        />
        <div className="flex flex-1">
          <Sidebar 
            ref={sidebarRef}
            isOpen={isSidebarOpen} 
            activeSelection={activeSelection}
            onSelectionChange={setActiveSelection}
            folders={folders}
            notes={notes}
            tags={tags}
            themeId={themeId}
            onOpenEditTags={() => setIsEditTagsModalOpen(true)}
            onCreateFolder={handleCreateFolder}
            onCreateCategory={handleCreateCategory}
            onUpdateFolder={handleUpdateFolder}
            onUpdateCategory={handleUpdateCategory}
            onDeleteFolder={handleDeleteFolder}
            onDeleteCategory={handleDeleteCategory}
            onReorderFolders={handleReorderFolders}
            onExport={handleExportData}
            onImport={handleImportFile}
            onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
          />
          <main className="flex-1 p-4 md:p-8">
            <div className="max-w-screen-xl mx-auto">
              {activeSelection.id !== 'Papelera' && activeSelection.id !== 'Archivar' && (
                <NoteCreator 
                  ref={noteCreatorRef}
                  onAddNote={addNote} 
                  activeSelection={activeSelection}
                  folders={folders}
                  themeId={themeId}
                  isLoading={isLoading}
                />
              )}
              <NoteGrid 
                pinnedNotes={pinnedNotes} 
                otherNotes={otherNotes}
                viewMode={viewMode}
                tags={tags}
                themeId={themeId}
                onUpdateNote={updateNote}
                onUpdateStatus={updateNoteStatus}
                onPermanentlyDelete={permanentlyDeleteNote}
                onEmptyTrash={emptyTrash}
                activeSelection={activeSelection}
                folders={folders}
                onNoteClick={handleNoteClick}
                showToast={showToast}
                onShowImageCopier={setImageCopyModalContent}
                selectedNoteIds={selectedNoteIds}
                onToggleNoteSelection={handleToggleNoteSelection}
                onMoveSingleNote={handleMoveSingleNote}
              />
              <SituationalAnimation themeId={themeId} />
            </div>
          </main>
        </div>
      </div>
      
      {selectedNoteIds.length > 0 && (
        <SelectionToolbar
            selectedCount={selectedNoteIds.length}
            onArchive={archiveSelectedNotes}
            onTrash={trashSelectedNotes}
            onMove={() => setIsMoveModalOpen(true)}
            onClearSelection={() => setSelectedNoteIds([])}
            isLoading={isLoading}
        />
      )}
      {toast && (
        <Toast 
            message={toast.message} 
            onUndo={toast.onUndo}
            onDismiss={handleToastDismiss}
        />
      )}
      {editingNote && (
        <NoteEditorModal
            note={editingNote}
            folders={folders}
            tags={tags}
            themeId={themeId}
            onUpdate={updateNote}
            // FIX: Correct a typo in the onUpdateStatus prop passed to NoteEditorModal. The prop was being passed the undefined value 'onUpdateStatus' instead of the function 'updateNoteStatus'.
            onUpdateStatus={updateNoteStatus}
            onClose={handleCloseEditor}
            showToast={showToast}
            onShowImageCopier={setImageCopyModalContent}
            isLoading={isLoading}
        />
      )}
      {imageCopyModalContent && (
        <ImageCopyModal
          images={imageCopyModalContent}
          onClose={() => setImageCopyModalContent(null)}
          showToast={showToast}
        />
      )}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => {
            setIsSearchModalOpen(false);
            setSearchTerm('');
        }}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        notes={notes.filter(note => note.status === 'active' || note.status === 'archived')}
        folders={folders}
        tags={tags}
        onNoteClick={handleNoteClick}
      />
      <MoveNoteModal
        isOpen={isMoveModalOpen}
        onClose={() => {
            setIsMoveModalOpen(false);
            if (selectedNoteIds.length === 1) {
                setSelectedNoteIds([]);
            }
        }}
        folders={folders}
        onMove={handleMoveNotes}
        selectedCount={selectedNoteIds.length}
      />
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={confirmationState.onConfirm}
        title={confirmationState.title}
        message={confirmationState.message}
        confirmText="Eliminar"
      />
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
      />
      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
      <EditTagsModal
        isOpen={isEditTagsModalOpen}
        onClose={() => setIsEditTagsModalOpen(false)}
        tags={tags}
        themeId={themeId}
        onCreateTag={handleCreateTag}
        onDeleteTag={handleDeleteTag}
        onUpdateTag={handleUpdateTag}
      />
    </>
  );
};

export default App;