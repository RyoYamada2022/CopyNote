import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { Note, ListItem, Folder, NoteVersion, Tag, ImageAttachment, ImageSize, CoverImageSettings } from '../types';
import { PaletteIcon, ArchiveIcon, TrashIcon, CloseIcon, ImageIcon, CopyIcon, UnarchiveIcon, WhatsAppIcon, RestoreIcon, TagIcon, StarIcon, StarOutlineIcon, CheckboxCheckedIcon, CheckboxOutlineIcon, AspectRatioIcon, FitScreenIcon, VerticalAlignTopIcon, VerticalAlignMiddleIcon, VerticalAlignBottomIcon, PencilIcon, PlusIcon, SpinnerIcon } from './Icons';
import ColorPicker from './ColorPicker';

interface NoteEditorModalProps {
  note: Note;
  folders: Folder[];
  tags: Tag[]; // All available tags
  themeId: string;
  onUpdate: (id: number, updatedData: Partial<Omit<Note, 'id'>>) => void;
  onUpdateStatus: (id: number, status: Note['status']) => void;
  onClose: () => void;
  showToast: (message: string, onUndo?: () => void) => void;
  onShowImageCopier: (images: (string | ImageAttachment)[]) => void;
  isLoading: boolean;
}

interface ChecklistItem {
    id: string;
    text: string;
    checked: boolean;
}

const getCordialGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
        return 'Buenos días';
    } else if (hour >= 12 && hour < 18) {
        return 'Buenas tardes';
    } else {
        return 'Buenas noches';
    }
};

const replaceCordialGreeting = (text: string): string => {
    const command = '(Saludo cordial)';
    if (!text.includes(command)) return text;
    const greeting = getCordialGreeting();
    const escapedCommand = command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(escapedCommand, 'g'), greeting);
};

const listItemsToMarkdown = (items: ListItem[]): string => {
  return items.map(item => `- [${item.checked ? 'x' : ' '}] ${item.text}`).join('\n');
};

const normalizeImages = (images: (string | ImageAttachment)[]): ImageAttachment[] => {
    return images.map(img =>
        typeof img === 'string'
            ? { src: img, size: 'medium' }
            : { src: img.src, size: img.size || 'medium' }
    );
};


const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (!event.target?.result) return reject('No result from FileReader');
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 600;
                const MAX_HEIGHT = 600;
                let { width, height } = img;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject('Could not get canvas context');
                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
            img.src = event.target.result as string;
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
};

const NoteEditorModal: React.FC<NoteEditorModalProps> = ({ note, folders, tags: allTags, themeId, onUpdate, onUpdateStatus, onClose, showToast, onShowImageCopier, isLoading }) => {
    const titleRef = useRef<HTMLInputElement>(null);
    
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState('');
    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
    const [imageAttachments, setImageAttachments] = useState<ImageAttachment[]>(normalizeImages(note.images || []));
    const [coverImageSettings, setCoverImageSettings] = useState<CoverImageSettings | undefined>(() => {
        if (note.coverImageSettings) {
            return note.coverImageSettings;
        }
        if (note.coverImage) { // Migrate from old string format
            return { src: note.coverImage, objectFit: 'cover', objectPosition: 'center' };
        }
        return undefined;
    });
    const [noteTags, setNoteTags] = useState(note.tags || []);
    const [color, setColor] = useState(note.color || '#202124');
    
    const [showPalette, setShowPalette] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [isTagSelectorOpen, setIsTagSelectorOpen] = useState(false);

    const modalWrapperRef = useRef<HTMLDivElement>(null);
    const modalContentRef = useRef<HTMLDivElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const tagSelectorRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const itemInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const isChecklist = useMemo(() => /^- \[[ xX]\]/.test(content.trim()), [content]);
    
    const tagMap = useMemo(() => new Map(allTags.map(t => [t.name, t.color])), [allTags]);

    const stateRef = useRef({ title, content, imageAttachments, coverImageSettings, noteTags, color, checklistItems, isChecklist });
    useEffect(() => {
        stateRef.current = { title, content, imageAttachments, coverImageSettings, noteTags, color, checklistItems, isChecklist };
    });

    useEffect(() => {
        if (note.listItems && note.listItems.length > 0) {
            setContent(listItemsToMarkdown(note.listItems));
        } else {
            setContent(note.content);
        }
    }, [note]);

    useEffect(() => {
        if (isChecklist) {
            const lines = content.split('\n').filter(line => line.trim() !== '');
            const items = lines.map((line, index) => {
                const match = line.match(/^- \[(x|X|\s)\] (.*)/);
                if (!match) return null;
                return {
                    id: `${Date.now()}-${index}`,
                    checked: match[1].trim() !== '',
                    text: match[2],
                };
            }).filter(Boolean) as ChecklistItem[];
            setChecklistItems(items);
        }
    }, [isChecklist, content]);


    useEffect(() => {
        triggerRef.current = document.activeElement as HTMLElement;
        setColor(note.color || '#202124');
    }, [note.color]);

    useEffect(() => {
        titleRef.current?.focus();
    }, []);

    const handleSaveAndClose = useCallback(() => {
        if (isLoading) return;

        const { title, content, imageAttachments, coverImageSettings, noteTags, color, checklistItems, isChecklist } = stateRef.current;
        
        const finalContent = isChecklist 
            ? checklistItems.map(item => `- [${item.checked ? 'x' : ' '}] ${item.text}`).join('\n')
            : content.trim();

        const originalCoverImageSettings = note.coverImageSettings || (note.coverImage ? { src: note.coverImage, objectFit: 'cover', objectPosition: 'center' } : undefined);

        const hasChanged = title.trim() !== note.title ||
                           finalContent !== (note.listItems && note.listItems.length > 0 ? listItemsToMarkdown(note.listItems) : note.content.trim()) ||
                           JSON.stringify(imageAttachments) !== JSON.stringify(normalizeImages(note.images || [])) ||
                           JSON.stringify(coverImageSettings) !== JSON.stringify(originalCoverImageSettings) ||
                           JSON.stringify(noteTags) !== JSON.stringify(note.tags || []) ||
                           color !== (note.color || '#202124');

        if (hasChanged) {
            onUpdate(note.id, {
                title: title.trim(),
                content: finalContent,
                images: imageAttachments,
                coverImageSettings,
                coverImage: undefined, 
                tags: noteTags,
                color,
                listItems: undefined,
            });
        }
        onClose();
    }, [note, onUpdate, onClose, isLoading]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
                handleSaveAndClose();
            }
             if (tagSelectorRef.current && !tagSelectorRef.current.contains(event.target as Node)) {
                setIsTagSelectorOpen(false);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                const focusableElements = modalWrapperRef.current?.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (!focusableElements || focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        event.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        event.preventDefault();
                    }
                }
            }
            
            if (event.key === 'Escape') {
                if (isTagSelectorOpen) {
                    setIsTagSelectorOpen(false);
                } else if (showPalette) {
                    setShowPalette(false);
                } else if (showHistory) {
                    setShowHistory(false);
                } else {
                    handleSaveAndClose();
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
            triggerRef.current?.focus();
        };
    }, [handleSaveAndClose, isTagSelectorOpen, showPalette, showHistory]);
    
    const handleImageUploadClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        imageInputRef.current?.click();
    };

    const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const compressionPromises: Promise<string>[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file && file.type.startsWith('image/')) {
                    compressionPromises.push(compressImage(file));
                }
            }
            Promise.all(compressionPromises).then(results => {
                const newImages: ImageAttachment[] = results.map(src => ({ src, size: 'medium' }));
                setImageAttachments(prev => [...prev, ...newImages]);
            }).catch(error => {
                console.error("Error compressing images:", error);
                showToast('Error al procesar la imagen.');
            });
            
            if (e.target) {
                e.target.value = '';
            }
        }
    };

    const removeImage = (index: number) => {
        const removedImageSrc = imageAttachments[index]?.src;
        setImageAttachments(previews => previews?.filter((_, i) => i !== index));
        if (coverImageSettings?.src === removedImageSrc) {
            setCoverImageSettings(undefined);
        }
    };

    const handleImageSizeChange = (index: number, newSize: ImageSize) => {
        setImageAttachments(prev => prev.map((img, i) => i === index ? { ...img, size: newSize } : img));
    };
    
    const handleSetCoverImage = (imgSrc: string) => {
        setCoverImageSettings(prev => {
            if (prev?.src === imgSrc) {
                return undefined;
            } else {
                return { src: imgSrc, objectFit: 'cover', objectPosition: 'center' };
            }
        });
    };

    const handleRestoreVersion = (version: NoteVersion) => {
        setTitle(version.title);
        const newContent = version.listItems && version.listItems.length > 0 ? listItemsToMarkdown(version.listItems) : version.content;
        setContent(newContent);
        setImageAttachments(normalizeImages(version.images || []));
        setShowHistory(false);
        showToast('Nota restaurada a una versión anterior.');
    };

    const getFinalContentForCopy = () => {
         return isChecklist 
            ? checklistItems.map(item => `${item.checked ? '☑' : '☐'} ${item.text}`).join('\n')
            : content;
    }

    const handleCopyToClipboardForWhatsapp = async () => {
        const textContent = replaceCordialGreeting(getFinalContentForCopy());
    
        try {
          await navigator.clipboard.writeText(textContent);
          if (imageAttachments && imageAttachments.length > 0) {
            showToast('Texto copiado. Ahora copia las imágenes.');
            onShowImageCopier(imageAttachments);
          } else {
            showToast('Texto de la nota copiado al portapeles.');
          }
        } catch (error) {
          console.error('Error al copiar el texto para WhatsApp:', error);
          showToast('No se pudo copiar el texto de la nota.');
        }
    };
    
    const handleCopyToClipboardRich = async () => {
        const finalContent = getFinalContentForCopy();
        const noteContentAsHtml = finalContent.replace(/\n/g, '<br />');
        let htmlContent = `<div>${replaceCordialGreeting(noteContentAsHtml)}</div>`;
        const textContent = finalContent;
        const hasImages = imageAttachments && imageAttachments.length > 0;
    
        if (!hasImages) {
          try {
            await navigator.clipboard.writeText(textContent);
            showToast('Texto de la nota copiado al portapeles.');
          } catch(e) {
            showToast('No se pudo copiar la nota.');
          }
          return;
        }
    
        try {
          const imageSources = imageAttachments.map(img => img.src);
          const toDataURL = (url: string): Promise<string> => fetch(url)
              .then(response => response.blob())
              .then(blob => new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result as string);
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
              }));
    
          const dataUrls = await Promise.all(imageSources.map(toDataURL));
          dataUrls.forEach(dataUrl => {
              htmlContent += `<br><img src="${dataUrl}" alt="Imagen adjunta" style="max-width: 100%; height: auto;" />`;
          });
    
          const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
          const textBlob = new Blob([textContent], { type: 'text/plain' });
    
          await navigator.clipboard.write([
            new ClipboardItem({
              'text/html': htmlBlob,
              'text/plain': textBlob,
            })
          ]);
          showToast('Nota copiada al portapeles.');
        } catch (error) {
            console.error('Error al copiar al portapeles:', error);
            try {
                await navigator.clipboard.writeText(textContent);
                showToast('No se pudo copiar contenido enriquecido, se copió solo el texto.');
            } catch (fallbackError) {
                console.error('Error en el copiado de texto de respaldo:', fallbackError);
                showToast('No se pudo copiar la nota.');
            }
        }
    };
    
    const handleTagToggle = (tagName: string) => {
        setNoteTags(prev => {
            const newTags = new Set(prev);
            if (newTags.has(tagName)) {
                newTags.delete(tagName);
            } else {
                newTags.add(tagName);
            }
            return Array.from(newTags);
        });
    };

    const getTextColorForBg = (hexColor: string | undefined): string => {
      if (!hexColor || !hexColor.startsWith('#')) return '#e8eaed';
      if (hexColor.toLowerCase() === '#202124') return '#e8eaed';
      try {
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? '#202124' : '#e8eaed';
      } catch (e) {
        return '#e8eaed';
      }
    };
    
    const noteTextColor = getTextColorForBg(color);

    // Checklist handlers
    const handleItemCheck = (id: string) => {
        setChecklistItems(items => items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    };

    const handleItemTextChange = (id: string, newText: string) => {
        setChecklistItems(items => items.map(item => item.id === id ? { ...item, text: newText } : item));
    };

    const handleAddItem = (afterId?: string) => {
        const newItem: ChecklistItem = { id: `${Date.now()}`, text: '', checked: false };
        setChecklistItems(items => {
            if (afterId) {
                const index = items.findIndex(item => item.id === afterId);
                const newItems = [...items];
                newItems.splice(index + 1, 0, newItem);
                return newItems;
            }
            return [...items, newItem];
        });
        setTimeout(() => itemInputRefs.current[newItem.id]?.focus(), 0);
    };

    const handleDeleteItem = (id: string, focusPrevious = false) => {
        const index = checklistItems.findIndex(item => item.id === id);
        setChecklistItems(items => items.filter(item => item.id !== id));
        if (focusPrevious && index > 0) {
           const prevItemId = checklistItems[index - 1].id;
           setTimeout(() => {
                const input = itemInputRefs.current[prevItemId];
                input?.focus();
                input?.setSelectionRange(input.value.length, input.value.length);
           }, 0);
        }
    };
    
    const handleItemKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
        const index = checklistItems.findIndex(item => item.id === id);
        
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddItem(id);
        } else if (e.key === 'Backspace' && checklistItems[index].text === '') {
            e.preventDefault();
            handleDeleteItem(id, true);
        } else if (e.key === 'ArrowUp' && index > 0) {
            e.preventDefault();
            itemInputRefs.current[checklistItems[index - 1].id]?.focus();
        } else if (e.key === 'ArrowDown' && index < checklistItems.length - 1) {
            e.preventDefault();
            itemInputRefs.current[checklistItems[index + 1].id]?.focus();
        }
    };

    
    const imageSizeClasses: Record<ImageSize, string> = {
        small: 'w-1/3',
        medium: 'w-2/3',
        large: 'w-full'
    };

    return (
        <div ref={modalWrapperRef} className="fixed inset-0 bg-black bg-opacity-70 z-40 flex items-center justify-center p-4 animate-slide-in-up" role="dialog" aria-modal="true" aria-labelledby="note-editor-title">
            <div ref={modalContentRef} className="bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-2xl rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col border border-[var(--border-color)]" style={{ backgroundColor: color, color: noteTextColor }}>
                <div className="p-4 flex-grow overflow-y-auto">
                    <input
                        id="note-editor-title"
                        ref={titleRef}
                        type="text"
                        placeholder="Título"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent text-2xl font-medium placeholder-[var(--text-secondary)] focus:outline-none mb-4"
                        style={{ color: 'inherit' }}
                    />
                    
                    {isChecklist ? (
                        <div className="space-y-2">
                           {checklistItems.map((item) => (
                               <div key={item.id} className="group flex items-center gap-2">
                                   <button onClick={() => handleItemCheck(item.id)} className="flex-shrink-0 p-1">
                                       {item.checked ? <CheckboxCheckedIcon className="w-5 h-5 text-current opacity-70" /> : <CheckboxOutlineIcon className="w-5 h-5 text-current opacity-70" />}
                                   </button>
                                   <input
                                        // FIX: The ref callback should not return a value. The assignment expression was being implicitly returned.
                                        ref={el => { itemInputRefs.current[item.id] = el; }}
                                        type="text"
                                        value={item.text}
                                        onChange={(e) => handleItemTextChange(item.id, e.target.value)}
                                        onKeyDown={(e) => handleItemKeyDown(e, item.id)}
                                        className={`w-full bg-transparent focus:outline-none py-1 border-b border-transparent focus:border-current ${item.checked ? 'line-through opacity-60' : ''}`}
                                        placeholder="Elemento de la lista"
                                   />
                                   <button onClick={() => handleDeleteItem(item.id)} className="p-1 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity">
                                       <TrashIcon className="w-4 h-4" />
                                   </button>
                               </div>
                           ))}
                           <button onClick={() => handleAddItem()} className="flex items-center gap-2 text-current opacity-70 hover:opacity-100 mt-2 ml-8">
                                <PlusIcon className="w-5 h-5" />
                                <span>Añadir elemento</span>
                           </button>
                        </div>
                    ) : (
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Crear una nota..."
                            className="w-full bg-transparent focus:outline-none resize-y min-h-[40vh] p-2 rounded-b-md placeholder:text-[var(--text-secondary)]"
                        />
                    )}

                    {imageAttachments && imageAttachments.length > 0 && (
                        <div className="mt-4 -mx-4 p-2 flex flex-col items-center space-y-4 bg-black/10">
                            {imageAttachments.map((img, index) => {
                                const isCover = coverImageSettings?.src === img.src;
                                return (
                                    <div key={index} className={`relative group ${imageSizeClasses[img.size]}`}>
                                        <img src={img.src} alt={`Attachment ${index + 1}`} className="object-cover rounded-md w-full" />
                                        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg p-1 flex items-center gap-1 text-white text-xs">
                                            <button onClick={() => handleImageSizeChange(index, 'small')} className={`p-1.5 rounded ${img.size === 'small' ? 'bg-white/30' : 'hover:bg-white/20'}`} title="Pequeño">S</button>
                                            <button onClick={() => handleImageSizeChange(index, 'medium')} className={`p-1.5 rounded ${img.size === 'medium' ? 'bg-white/30' : 'hover:bg-white/20'}`} title="Mediano">M</button>
                                            <button onClick={() => handleImageSizeChange(index, 'large')} className={`p-1.5 rounded ${img.size === 'large' ? 'bg-white/30' : 'hover:bg-white/20'}`} title="Grande">L</button>
                                            <div className="w-px h-4 bg-white/30 mx-1"></div>
                                            
                                            <button onClick={() => handleSetCoverImage(img.src)} className={`p-1 rounded ${isCover ? 'text-yellow-400' : 'hover:bg-white/20'}`} title={isCover ? 'Quitar de portada' : 'Establecer como portada'}>
                                                {isCover ? <StarIcon className="w-4 h-4" /> : <StarOutlineIcon className="w-4 h-4" />}
                                            </button>

                                            {isCover && coverImageSettings && (
                                                <>
                                                    <button
                                                        onClick={() => setCoverImageSettings(prev => prev ? {...prev, objectFit: prev.objectFit === 'cover' ? 'contain' : 'cover'} : prev)}
                                                        className="p-1.5 rounded hover:bg-white/20"
                                                        title={coverImageSettings.objectFit === 'cover' ? 'Encajar imagen' : 'Rellenar espacio'}
                                                    >
                                                        {coverImageSettings.objectFit === 'cover' ? <FitScreenIcon className="w-4 h-4" /> : <AspectRatioIcon className="w-4 h-4" />}
                                                    </button>
                                                    {coverImageSettings.objectFit === 'cover' && (
                                                        <>
                                                            <div className="w-px h-4 bg-white/30 mx-1"></div>
                                                            <button
                                                                onClick={() => setCoverImageSettings(prev => prev ? {...prev, objectPosition: 'top'} : prev)}
                                                                className={`p-1.5 rounded ${coverImageSettings.objectPosition === 'top' ? 'bg-white/30' : 'hover:bg-white/20'}`}
                                                                title="Alinear arriba"
                                                            >
                                                                <VerticalAlignTopIcon className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setCoverImageSettings(prev => prev ? {...prev, objectPosition: 'center'} : prev)}
                                                                className={`p-1.5 rounded ${coverImageSettings.objectPosition === 'center' ? 'bg-white/30' : 'hover:bg-white/20'}`}
                                                                title="Alinear al centro"
                                                            >
                                                                <VerticalAlignMiddleIcon className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setCoverImageSettings(prev => prev ? {...prev, objectPosition: 'bottom'} : prev)}
                                                                className={`p-1.5 rounded ${coverImageSettings.objectPosition === 'bottom' ? 'bg-white/30' : 'hover:bg-white/20'}`}
                                                                title="Alinear abajo"
                                                            >
                                                                <VerticalAlignBottomIcon className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </>
                                            )}

                                            <div className="w-px h-4 bg-white/30 mx-1"></div>
                                            <button onClick={() => removeImage(index)} className="p-1 rounded hover:bg-white/20" title="Eliminar imagen"><TrashIcon className="w-4 h-4"/></button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}


                     <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/20">
                        {noteTags.map(tagName => {
                            const tagColor = tagMap.get(tagName) || '#808080';
                            const tagTextColor = getTextColorForBg(tagColor);
                            return (
                                <span key={tagName} style={{ backgroundColor: tagColor, color: tagTextColor }} className="px-3 py-1 text-sm font-medium rounded-full flex items-center gap-2">
                                    {tagName}
                                    <button onClick={() => handleTagToggle(tagName)} className="opacity-70 hover:opacity-100"><CloseIcon className="w-3 h-3"/></button>
                                </span>
                            );
                        })}
                        <div className="relative">
                            <button 
                                onClick={() => setIsTagSelectorOpen(p => !p)}
                                className="px-3 py-1 text-sm rounded-full border border-dashed border-white/40 hover:bg-white/10"
                            >
                                + Añadir etiqueta
                            </button>
                            {isTagSelectorOpen && (
                                <div ref={tagSelectorRef} className="absolute bottom-full left-0 mb-2 w-56 max-h-60 overflow-y-auto bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg shadow-lg border border-[var(--border-color)] p-2 z-10">
                                    {allTags.map(tag => (
                                        <button 
                                            key={tag.name}
                                            onClick={() => handleTagToggle(tag.name)}
                                            className="w-full text-left flex items-center p-2 rounded hover:bg-[var(--bg-hover)]"
                                        >
                                            {noteTags.includes(tag.name) ? <CheckboxCheckedIcon className="w-5 h-5 mr-2 text-[var(--accent-color)]"/> : <CheckboxOutlineIcon className="w-5 h-5 mr-2"/>}
                                            <span className="truncate">{tag.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-2 flex items-center justify-between bg-black/10 rounded-b-lg">
                    <div className="flex items-center space-x-1 text-[var(--text-secondary)]" style={{ color: noteTextColor }}>
                        <button onClick={() => setShowPalette(p => !p)} className="p-2 rounded-full hover:bg-black/20" aria-label="Cambiar color"><PaletteIcon className="w-5 h-5"/></button>
                        <button onClick={handleImageUploadClick} className="p-2 rounded-full hover:bg-black/20" aria-label="Añadir imagen"><ImageIcon className="w-5 h-5"/></button>
                        <button onClick={handleCopyToClipboardForWhatsapp} className="p-2 rounded-full hover:bg-black/20" aria-label="Copiar para WhatsApp"><WhatsAppIcon className="w-5 h-5"/></button>
                        <button onClick={handleCopyToClipboardRich} className="p-2 rounded-full hover:bg-black/20" aria-label="Copiar al portapeles"><CopyIcon className="w-5 h-5"/></button>
                        {note.status === 'archived' ? (
                            <button onClick={() => onUpdateStatus(note.id, 'active')} className="p-2 rounded-full hover:bg-black/20" aria-label="Desarchivar"><UnarchiveIcon className="w-5 h-5"/></button>
                        ) : (
                            <button onClick={() => onUpdateStatus(note.id, 'archived')} className="p-2 rounded-full hover:bg-black/20" aria-label="Archivar"><ArchiveIcon className="w-5 h-5"/></button>
                        )}
                        <button onClick={() => onUpdateStatus(note.id, 'trashed')} className="p-2 rounded-full hover:bg-black/20" aria-label="Mover a la papelera"><TrashIcon className="w-5 h-5"/></button>
                        
                        {note.history && note.history.length > 0 && (
                             <div className="relative">
                                <button onClick={() => setShowHistory(p => !p)} className="p-2 rounded-full hover:bg-black/20" aria-label="Ver historial"><RestoreIcon className="w-5 h-5"/></button>
                                {showHistory && (
                                     <div className="absolute bottom-full mb-2 w-64 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-md shadow-lg border border-[var(--border-color)] p-2 max-h-60 overflow-y-auto">
                                        <p className="text-xs font-bold p-2">Historial de versiones</p>
                                        {note.history.map(v => (
                                            <button 
                                                key={v.timestamp} 
                                                onClick={() => handleRestoreVersion(v)}
                                                className="w-full text-left p-2 hover:bg-[var(--bg-hover)] rounded"
                                            >
                                                <p className="font-semibold truncate">{v.title || "Sin título"}</p>
                                                <p className="text-xs text-[var(--text-secondary)]">
                                                    {new Date(v.timestamp).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                                                </p>
                                            </button>
                                        ))}
                                     </div>
                                )}
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={handleSaveAndClose}
                        disabled={isLoading}
                        className="px-6 py-2 text-sm font-medium rounded hover:bg-black/20 disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isLoading ? <SpinnerIcon className="w-5 h-5 mx-auto" /> : 'Cerrar'}
                    </button>
                </div>
                {showPalette && (
                    <div className="absolute bottom-14 left-4 z-10">
                        <ColorPicker themeId={themeId} color={color} onChange={setColor} onClose={() => setShowPalette(false)} />
                    </div>
                )}
                <input type="file" ref={imageInputRef} onChange={handleImageSelected} accept="image/*" className="hidden" multiple />
            </div>
        </div>
    );
};

export default NoteEditorModal;