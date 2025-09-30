import React, { useMemo, useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { PostItIcon, ArchiveIcon, TrashIcon, FolderIcon, ChevronRightIcon, ChevronDownIcon, PlusIcon, MoreVertIcon, PencilIcon, BrushIcon, CheckIcon, CloseIcon, DragHandleIcon, TagIcon, ExportIcon, ImportIcon, KeyboardIcon } from './Icons';
import type { Note, Folder, Category, Tag } from '../types';
import ColorPicker from './ColorPicker';


interface ActiveSelection {
  type: 'folder' | 'category' | 'special' | 'tag';
  id: number | string;
}

interface SidebarProps {
  isOpen: boolean;
  activeSelection: ActiveSelection;
  onSelectionChange: (selection: ActiveSelection) => void;
  folders: Folder[];
  notes: Note[];
  tags: Tag[];
  themeId: string;
  onOpenEditTags: () => void;
  onCreateFolder: (name: string) => void;
  onCreateCategory: (folderId: number, name: string) => void;
  onUpdateFolder: (folderId: number, updatedData: Partial<Omit<Folder, 'id' | 'categories'>>) => void;
  onUpdateCategory: (folderId: number, categoryId: number, updatedData: Partial<Omit<Category, 'id'>>) => void;
  onDeleteFolder: (folderId: number) => void;
  onDeleteCategory: (folderId: number, categoryId: number) => void;
  onReorderFolders: (folders: Folder[]) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onOpenShortcuts: () => void;
}

interface SidebarRef {
  triggerImport: () => void;
}

const Sidebar = forwardRef<SidebarRef, SidebarProps>(({ isOpen, activeSelection, onSelectionChange, folders, notes, tags, themeId, onOpenEditTags, onCreateFolder, onCreateCategory, onUpdateFolder, onUpdateCategory, onDeleteFolder, onDeleteCategory, onReorderFolders, onExport, onImport, onOpenShortcuts }, ref) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<number, boolean>>(() => {
    const initialState: Record<number, boolean> = {};
    if (folders.length > 0) {
      initialState[folders[0].id] = true;
    }
    return initialState;
  });
  const [isTagsExpanded, setIsTagsExpanded] = useState(true);

  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingCategoryIn, setCreatingCategoryIn] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [editing, setEditing] = useState<{ type: 'folder' | 'category', id: number, folderId?: number } | null>(null);
  const [editingName, setEditingName] = useState('');

  const [menuOpenFor, setMenuOpenFor] = useState<{ type: 'folder' | 'category', id: number, folderId?: number } | null>(null);
  const [colorPickerOpenFor, setColorPickerOpenFor] = useState<{ type: 'folder' | 'category', id: number, folderId?: number } | null>(null);
  
  const [draggingFolderId, setDraggingFolderId] = useState<number | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<number | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevFoldersRef = useRef(folders);
  const importInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    triggerImport: () => {
        importInputRef.current?.click();
    }
  }));

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        onImport(file);
    }
    // Reset input value to allow re-importing the same file
    if(e.target) e.target.value = '';
  };

  useEffect(() => {
    // Auto-expand newly created folders
    if (folders.length > prevFoldersRef.current.length) {
      const oldFolderIds = new Set(prevFoldersRef.current.map(f => f.id));
      const newFolder = folders.find(f => !oldFolderIds.has(f.id));
      if (newFolder) {
        setExpandedFolders(prev => ({ ...prev, [newFolder.id]: true }));
      }
    }
    prevFoldersRef.current = folders;
  }, [folders]);

  useEffect(() => {
      if (editing || isCreatingFolder || creatingCategoryIn) {
          inputRef.current?.focus();
          inputRef.current?.select();
      }
  }, [editing, isCreatingFolder, creatingCategoryIn]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setMenuOpenFor(null);
        }
        if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
            setColorPickerOpenFor(null);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const toggleFolder = (folderId: number) => {
    setExpandedFolders(prev => ({...prev, [folderId]: !prev[folderId]}));
  };
  
  const counts = useMemo(() => {
    const categoryCounts: { [key: number]: number } = {};
    const tagCounts: { [key: string]: number } = {};
    let activeNotesCount = 0;
    let archivedNotesCount = 0;
    let trashedNotesCount = 0;

    notes.forEach(note => {
        if (note.status === 'active') {
            activeNotesCount++;
            categoryCounts[note.categoryId] = (categoryCounts[note.categoryId] || 0) + 1;
            note.tags?.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        } else if (note.status === 'archived') {
            archivedNotesCount++;
        } else if (note.status === 'trashed') {
            trashedNotesCount++;
        }
    });
    return { 'Notas': activeNotesCount, 'Archivar': archivedNotesCount, 'Papelera': trashedNotesCount, categories: categoryCounts, tags: tagCounts };
  }, [notes]);

  const handleSaveNewFolder = () => {
    if (newFolderName.trim()) {
        onCreateFolder(newFolderName.trim());
    }
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const handleSaveNewCategory = (folderId: number) => {
    if (newCategoryName.trim()) {
        onCreateCategory(folderId, newCategoryName.trim());
    }
    setNewCategoryName('');
    setCreatingCategoryIn(null);
  };
  
  const handleStartEdit = (type: 'folder' | 'category', item: Folder | Category, folderId?: number) => {
    setEditing({ type, id: item.id, folderId });
    setEditingName(item.name);
    setMenuOpenFor(null);
  };

  const handleSaveEdit = () => {
    if (!editing || !editingName.trim()) {
        setEditing(null);
        setEditingName('');
        return;
    };
    if (editing.type === 'folder') {
        onUpdateFolder(editing.id, { name: editingName.trim() });
    } else if (editing.type === 'category' && editing.folderId) {
        onUpdateCategory(editing.folderId, editing.id, { name: editingName.trim() });
    }
    setEditing(null);
    setEditingName('');
  };
  
  const handleColorChange = (color: string) => {
    if (!colorPickerOpenFor) return;
    if (colorPickerOpenFor.type === 'folder') {
        onUpdateFolder(colorPickerOpenFor.id, { color });
    } else if (colorPickerOpenFor.type === 'category' && colorPickerOpenFor.folderId) {
        onUpdateCategory(colorPickerOpenFor.folderId, colorPickerOpenFor.id, { color });
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, folderId: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('folderId', folderId.toString());
    setDraggingFolderId(folderId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, folderId: number) => {
    e.preventDefault();
    if (draggingFolderId && draggingFolderId !== folderId) {
      setDragOverFolderId(folderId);
    }
  };

  const handleDragLeave = () => {
    setDragOverFolderId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const sourceId = Number(e.dataTransfer.getData('folderId'));
    const dropTargetId = dragOverFolderId;

    if (sourceId && dropTargetId && sourceId !== dropTargetId) {
      const sourceIndex = folders.findIndex(f => f.id === sourceId);
      const targetIndex = folders.findIndex(f => f.id === dropTargetId);

      if (sourceIndex > -1 && targetIndex > -1) {
        const reorderedFolders = Array.from(folders);
        const [movedFolder] = reorderedFolders.splice(sourceIndex, 1);
        reorderedFolders.splice(targetIndex, 0, movedFolder);
        onReorderFolders(reorderedFolders);
      }
    }
    setDraggingFolderId(null);
    setDragOverFolderId(null);
  };

  const handleDragEnd = () => {
    setDraggingFolderId(null);
    setDragOverFolderId(null);
  };

  const renderFolderItem = (folder: Folder) => {
    const isActive = activeSelection.type === 'folder' && activeSelection.id === folder.id;
    const isDragging = draggingFolderId === folder.id;
    const isDragOver = dragOverFolderId === folder.id;

    return (
      <div 
        key={folder.id}
        draggable={!editing}
        onDragStart={!editing ? (e) => handleDragStart(e, folder.id) : undefined}
        onDragOver={!editing ? (e) => handleDragOver(e, folder.id) : undefined}
        onDragLeave={!editing ? handleDragLeave : undefined}
        onDrop={!editing ? handleDrop : undefined}
        onDragEnd={!editing ? handleDragEnd : undefined}
        className={`relative transition-opacity ${isDragging ? 'opacity-40' : 'opacity-100'}`}
      >
        {isDragOver && <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--accent-color)] z-10" />}
        <div
          className={`group/folder flex items-center w-full text-sm text-left transition-colors duration-200 rounded-r-full relative ${
            isActive ? 'font-semibold text-[var(--text-accent)] bg-[var(--bg-tertiary)]' : 'font-medium hover:bg-[var(--bg-hover)]'
          }`}
        >
          <div
            onClick={!editing || editing.id !== folder.id ? () => onSelectionChange({ type: 'folder', id: folder.id }) : undefined}
            className="flex-1 flex items-center pl-4 py-2 cursor-pointer min-w-0"
          >
            <DragHandleIcon className="w-5 h-5 text-[var(--text-secondary)] cursor-grab mr-1 opacity-0 group-hover/folder:opacity-100 flex-shrink-0" />
            <button 
                onClick={(e) => { e.stopPropagation(); toggleFolder(folder.id); }} 
                className="p-1 rounded-full hover:bg-black/10 flex-shrink-0 mr-1"
                aria-label={`Expand folder ${folder.name}`}
                aria-expanded={!!expandedFolders[folder.id]}
                aria-controls={`folder-content-${folder.id}`}
            >
              {expandedFolders[folder.id] ? <ChevronDownIcon className="w-5 h-5"/> : <ChevronRightIcon className="w-5 h-5" />}
            </button>
            <FolderIcon className="w-6 h-6 mr-3 flex-shrink-0" style={{ color: folder.color || 'currentColor' }} />
            <div className="flex-1 min-w-0">
              {editing?.type === 'folder' && editing.id === folder.id ? (
                  <input
                      ref={inputRef}
                      type="text"
                      value={editingName}
                      onClick={e => e.stopPropagation()}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter') handleSaveEdit(); if (e.key === 'Escape') setEditing(null); }}
                      className="w-full bg-transparent ring-1 ring-[var(--accent-color)] rounded px-1"
                  />
              ) : (
                  <span className="truncate block">{folder.name}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center pr-1 opacity-0 group-hover/folder:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); setCreatingCategoryIn(folder.id); }} className="p-1 rounded-full hover:bg-black/10" aria-label="Crear categoría"><PlusIcon className="w-4 h-4" /></button>
              <button onClick={(e) => { e.stopPropagation(); setMenuOpenFor({ type: 'folder', id: folder.id })}} className="p-1 rounded-full hover:bg-black/10" aria-label="Más opciones"><MoreVertIcon className="w-4 h-4" /></button>
          </div>

          {menuOpenFor?.type === 'folder' && menuOpenFor.id === folder.id && (
              <div ref={menuRef} className="absolute z-20 right-4 mt-10 w-48 bg-[var(--bg-tertiary)] rounded-md shadow-lg border border-[var(--border-color)] py-1">
                  <button onClick={(e) => { e.stopPropagation(); handleStartEdit('folder', folder); }} className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--bg-hover)] flex items-center"><PencilIcon className="w-4 h-4 mr-2"/>Renombrar</button>
                  <button onClick={(e) => { e.stopPropagation(); setColorPickerOpenFor({ type: 'folder', id: folder.id }); setMenuOpenFor(null); }} className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--bg-hover)] flex items-center"><BrushIcon className="w-4 h-4 mr-2"/>Cambiar color</button>
                  <div className="my-1 h-px bg-[var(--border-color)]"></div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); setMenuOpenFor(null); }} 
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--bg-hover)] flex items-center text-red-500"
                  >
                    <TrashIcon className="w-4 h-4 mr-2"/>Eliminar carpeta
                  </button>
              </div>
          )}

          {colorPickerOpenFor?.type === 'folder' && colorPickerOpenFor.id === folder.id && (
              <div ref={colorPickerRef} className="absolute z-20 left-1/2 -translate-x-1/2 mt-1"><ColorPicker themeId={themeId} color={folder.color || '#FFFFFF'} onChange={handleColorChange} onClose={() => setColorPickerOpenFor(null)} /></div>
          )}
        </div>
        {expandedFolders[folder.id] && (
            <div id={`folder-content-${folder.id}`} className="space-y-1 py-1">
              {folder.categories.map(category => renderCategoryItem(category, folder.id))}
              {creatingCategoryIn === folder.id && (
                 <div className="flex items-center pl-8 pr-4 py-1">
                    <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: 'currentColor' }}></span>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Nueva categoría"
                        value={newCategoryName}
                        onClick={e => e.stopPropagation()}
                        onChange={e => setNewCategoryName(e.target.value)}
                        onBlur={() => handleSaveNewCategory(folder.id)}
                        onKeyDown={e => { e.stopPropagation(); if(e.key === 'Enter') handleSaveNewCategory(folder.id); if (e.key === 'Escape') setCreatingCategoryIn(null); }}
                        className="flex-1 bg-transparent ring-1 ring-[var(--accent-color)] rounded px-1 text-sm"
                    />
                </div>
              )}
            </div>
        )}
      </div>
    );
  }
  
  const renderCategoryItem = (category: Category, folderId: number) => {
    const isActive = activeSelection.type === 'category' && activeSelection.id === category.id;
    return (
      <div key={category.id}>
        <div
          className={`group/cat flex items-center w-full text-sm text-left transition-colors duration-200 rounded-r-full relative ${
            isActive ? 'font-semibold text-[var(--text-accent)] bg-[var(--bg-tertiary)]' : 'font-normal hover:bg-[var(--bg-hover)]'
          }`}
        >
          <div
            onClick={!editing || editing.id !== category.id ? () => onSelectionChange({ type: 'category', id: category.id }) : undefined}
            className="flex-1 flex items-center pl-8 py-2 cursor-pointer min-w-0"
          >
            <span className="w-2 h-2 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: category.color || 'currentColor' }}></span>
            <div className="flex-1 min-w-0 flex justify-between items-center">
              {editing?.type === 'category' && editing.id === category.id ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={editingName}
                    onClick={e => e.stopPropagation()}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter') handleSaveEdit(); if (e.key === 'Escape') setEditing(null); }}
                    className="w-full bg-transparent ring-1 ring-[var(--accent-color)] rounded px-1"
                />
              ) : (
                <>
                  <span className="truncate">{category.name}</span>
                  <span className="text-xs text-[var(--text-secondary)] font-normal ml-2 flex-shrink-0">{counts.categories[category.id] || 0}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center pr-1 opacity-0 group-hover/cat:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); setMenuOpenFor({ type: 'category', id: category.id, folderId })}} className="p-1 rounded-full hover:bg-black/10" aria-label="Más opciones"><MoreVertIcon className="w-4 h-4" /></button>
          </div>

          {menuOpenFor?.type === 'category' && menuOpenFor.id === category.id && (
            <div ref={menuRef} className="absolute z-20 right-4 mt-10 w-48 bg-[var(--bg-tertiary)] rounded-md shadow-lg border border-[var(--border-color)] py-1">
                <button onClick={(e) => { e.stopPropagation(); handleStartEdit('category', category, folderId); }} className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--bg-hover)] flex items-center"><PencilIcon className="w-4 h-4 mr-2"/>Renombrar</button>
                <button onClick={(e) => { e.stopPropagation(); setColorPickerOpenFor({ type: 'category', id: category.id, folderId }); setMenuOpenFor(null); }} className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--bg-hover)] flex items-center"><BrushIcon className="w-4 h-4 mr-2"/>Cambiar color</button>
                <div className="my-1 h-px bg-[var(--border-color)]"></div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteCategory(folderId, category.id); setMenuOpenFor(null); }} 
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--bg-hover)] flex items-center text-red-500"
                >
                  <TrashIcon className="w-4 h-4 mr-2"/>Eliminar categoría
                </button>
            </div>
          )}
          {colorPickerOpenFor?.type === 'category' && colorPickerOpenFor.id === category.id && (
            <div ref={colorPickerRef} className="absolute z-20 left-1/2 -translate-x-1/2 mt-1"><ColorPicker themeId={themeId} color={category.color || '#FFFFFF'} onChange={handleColorChange} onClose={() => setColorPickerOpenFor(null)} /></div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <aside
      aria-label="Main navigation"
      className={`flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] bg-[var(--bg-secondary-alpha)] backdrop-blur-sm overflow-y-auto transition-sidebar ${
        isOpen ? 'w-64' : 'w-0'
      }`}
    >
      <div className="flex flex-col h-full py-4 text-[var(--text-secondary)]">
        <div className="flex-1 space-y-1">
          <button
            onClick={() => onSelectionChange({ type: 'special', id: 'Notas' })}
            className={`flex items-center w-full pl-4 pr-4 py-2.5 text-sm text-left transition-colors duration-200 rounded-r-full ${
              activeSelection.id === 'Notas'
                ? 'font-semibold text-[var(--text-accent)] bg-[var(--bg-tertiary)]'
                : 'font-medium hover:bg-[var(--bg-hover)]'
            }`}
          >
            <PostItIcon className="w-6 h-6" />
            <span className="ml-3 flex-1 flex justify-between items-center">
              <span className="truncate">Todas las notas</span>
              <span className="text-xs text-[var(--text-secondary)] font-normal">{counts['Notas'] || 0}</span>
            </span>
          </button>

          <div className="pt-2" />

          {folders.map(renderFolderItem)}
          
          {isCreatingFolder ? (
            <div className="flex items-center pl-4 pr-4 py-2">
                <FolderIcon className="w-6 h-6 mr-3" />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Nueva carpeta"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onBlur={handleSaveNewFolder}
                    onKeyDown={(e) => { if(e.key === 'Enter') handleSaveNewFolder(); if(e.key === 'Escape') setIsCreatingFolder(false); }}
                    className="flex-1 bg-transparent ring-1 ring-[var(--accent-color)] rounded px-1 text-sm"
                />
            </div>
          ) : (
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="flex items-center w-full pl-4 pr-4 py-2.5 text-sm text-left font-medium hover:bg-[var(--bg-hover)]"
            >
              <PlusIcon className="w-6 h-6" />
              <span className="ml-3">Nueva carpeta</span>
            </button>
          )}

            <div className="pt-2" />
             <div className="group/tags flex items-center w-full pl-4 pr-4 py-2.5 text-sm text-left font-medium">
                <button 
                    onClick={() => setIsTagsExpanded(p => !p)} 
                    className="p-1 rounded-full hover:bg-black/10 mr-1"
                    aria-label="Expand tags section"
                    aria-expanded={isTagsExpanded}
                    aria-controls="tags-content"
                >
                    {isTagsExpanded ? <ChevronDownIcon className="w-5 h-5"/> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                <span className="uppercase text-xs font-bold tracking-wider">Etiquetas</span>
                <button onClick={onOpenEditTags} className="ml-auto p-1.5 rounded-full hover:bg-[var(--bg-hover)] opacity-0 group-hover/tags:opacity-100">
                    <PencilIcon className="w-4 h-4" />
                </button>
            </div>
            {isTagsExpanded && (
                <div id="tags-content" className="pl-4 space-y-1">
                    {tags.map(tag => (
                        <button 
                            key={tag.name}
                            onClick={() => onSelectionChange({ type: 'tag', id: tag.name })}
                            className={`flex items-center w-full pl-8 pr-4 py-2 text-sm text-left rounded-r-full ${activeSelection.type === 'tag' && activeSelection.id === tag.name ? 'font-semibold text-[var(--text-accent)] bg-[var(--bg-tertiary)]' : 'hover:bg-[var(--bg-hover)]'}`}>
                            <TagIcon className="w-5 h-5 mr-3" style={{ color: tag.color }} />
                            <span className="flex-1 flex justify-between items-center">
                                <span className="truncate">{tag.name}</span>
                                <span className="text-xs text-[var(--text-secondary)] font-normal">{counts.tags[tag.name] || 0}</span>
                            </span>
                        </button>
                    ))}
                </div>
            )}


            <div className="pt-2"/>
             <div className="pl-4 pr-4 py-2.5 text-xs font-bold uppercase tracking-wider">Ajustes</div>
                <button
                    onClick={onExport}
                    className="flex items-center w-full pl-4 pr-4 py-2.5 text-sm text-left font-medium hover:bg-[var(--bg-hover)]"
                >
                    <ExportIcon className="w-6 h-6" />
                    <span className="ml-3">Exportar datos</span>
                </button>
                <button
                    onClick={handleImportClick}
                    className="flex items-center w-full pl-4 pr-4 py-2.5 text-sm text-left font-medium hover:bg-[var(--bg-hover)]"
                >
                    <ImportIcon className="w-6 h-6" />
                    <span className="ml-3">Importar datos</span>
                </button>
                <input type="file" ref={importInputRef} onChange={handleFileSelected} accept=".json" className="hidden" aria-hidden="true" />
                <button
                    onClick={onOpenShortcuts}
                    className="flex items-center w-full pl-4 pr-4 py-2.5 text-sm text-left font-medium hover:bg-[var(--bg-hover)]"
                >
                    <KeyboardIcon className="w-6 h-6" />
                    <span className="ml-3">Atajos y Comandos</span>
                </button>

            <button
              onClick={() => onSelectionChange({ type: 'special', id: 'Archivar' })}
              className={`flex items-center w-full pl-4 pr-4 py-2.5 text-sm text-left transition-colors duration-200 rounded-r-full ${
                activeSelection.id === 'Archivar'
                  ? 'font-semibold text-[var(--text-accent)] bg-[var(--bg-tertiary)]'
                  : 'font-medium hover:bg-[var(--bg-hover)]'
              }`}
            >
                <ArchiveIcon className="w-6 h-6" />
                <span className="ml-3 flex-1 flex justify-between items-center">
                    <span className="truncate">Archivar</span>
                    <span className="text-xs text-[var(--text-secondary)] font-normal">{counts['Archivar'] || 0}</span>
                </span>
            </button>
            <button
              onClick={() => onSelectionChange({ type: 'special', id: 'Papelera' })}
              className={`flex items-center w-full pl-4 pr-4 py-2.5 text-sm text-left transition-colors duration-200 rounded-r-full ${
                activeSelection.id === 'Papelera'
                  ? 'font-semibold text-[var(--text-accent)] bg-[var(--bg-tertiary)]'
                  : 'font-medium hover:bg-[var(--bg-hover)]'
              }`}
            >
                <TrashIcon className="w-6 h-6" />
                <span className="ml-3 flex-1 flex justify-between items-center">
                    <span className="truncate">Papelera</span>
                    <span className="text-xs text-[var(--text-secondary)] font-normal">{counts['Papelera'] || 0}</span>
                </span>
            </button>
        </div>
      </div>
    </aside>
  );
});

export default Sidebar;