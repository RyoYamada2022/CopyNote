import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Note, Folder, Tag, ListItem, ImageAttachment, CoverImageSettings } from '../types';
import { PinIcon, PaletteIcon, ArchiveIcon, TrashIcon, RestoreIcon, MoreVertIcon, CopyIcon, UnarchiveIcon, WhatsAppIcon, CheckCircleIcon, RadioButtonUncheckedIcon, MoveToFolderIcon, PencilIcon, CheckboxOutlineIcon, CheckboxCheckedIcon } from './Icons';
import ColorPicker from './ColorPicker';
import { parseMarkdown } from '../utils/markdownParser';

interface NoteCardProps {
  note: Note;
  tags: Tag[]; // All available tags
  themeId: string;
  viewMode: 'grid' | 'list';
  onUpdate: (id: number, updatedData: Partial<Omit<Note, 'id'>>) => void;
  onUpdateStatus: (id: number, status: Note['status']) => void;
  onPermanentlyDelete: (id: number) => void;
  folders: Folder[];
  onNoteClick: (note: Note) => void;
  showToast: (message: string) => void;
  onShowImageCopier: (images: (string | ImageAttachment)[]) => void;
  isSelected: boolean;
  onToggleSelection: (id: number) => void;
  selectionModeActive: boolean;
  onMoveNote: (noteId: number) => void;
  animationDelay: string;
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

const listItemsToPlainText = (items: ListItem[], level = 0): string => {
  let text = '';
  for (const item of items) {
    const indent = '  '.repeat(level);
    const checkbox = item.checked ? '☑' : '☐';
    text += `${indent}${checkbox} ${item.text}\n`;
    if (item.subItems) {
      text += listItemsToPlainText(item.subItems, level + 1);
    }
  }
  return text;
};

const getNotePlainText = (note: Note): string => {
  // For backward compatibility, check listItems first.
  if (note.listItems && note.listItems.length > 0) {
    const flattenItems = (items: ListItem[]): string[] => {
      let texts: string[] = [];
      for (const item of items) {
        texts.push(item.text);
        if (item.subItems) {
          texts = texts.concat(flattenItems(item.subItems));
        }
      }
      return texts;
    };
    return flattenItems(note.listItems).join(' ');
  }
  // New notes use markdown content.
  // This simple replace removes markdown for a plain text snippet.
  return note.content
    .replace(/#+\s/g, '') // Headings
    .replace(/[-*] \[[ xX]\]/g, '') // Checklist items
    .replace(/[-*+]\s/g, '') // List items
    .replace(/`|~~|\*\*|__/g, ''); // Inline styles
};


const NoteCard: React.FC<NoteCardProps> = ({ note, tags: allTags, themeId, viewMode, onUpdate, onUpdateStatus, onPermanentlyDelete, folders, onNoteClick, showToast, onShowImageCopier, isSelected, onToggleSelection, selectionModeActive, onMoveNote, animationDelay }) => {
  const { id, title, content, listItems, color, images, coverImage, coverImageSettings, pinned, status, createdAt, tags } = note;
  const [showPalette, setShowPalette] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const clickTimeout = useRef<number | null>(null);

  const tagMap = useMemo(() => new Map(allTags.map(t => [t.name, t.color])), [allTags]);

  useEffect(() => {
    // Cleanup timeout on component unmount
    return () => {
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (cardRef.current && !cardRef.current.contains(target)) {
            setShowPalette(false);
        }
        if (menuRef.current && !menuRef.current.contains(target)) {
            setMenuOpen(false);
        }
    };
    if (showPalette || isMenuOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPalette, isMenuOpen]);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const notePath = useMemo(() => {
    const folder = folders.find(f => f.id === note.folderId);
    const category = folder?.categories.find(c => c.id === note.categoryId);
    if (folder && category) {
      return `${folder.name} > ${category.name}`;
    }
    return null;
  }, [folders, note.folderId, note.categoryId]);
  
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

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  }

  const handleMoveToTrash = () => onUpdateStatus(id, 'trashed');
  const handleRestore = () => onUpdateStatus(id, 'active');
  const handlePermanentlyDelete = () => {
    if (window.confirm('Esto eliminará la nota de forma permanente. Esta acción no se puede deshacer. ¿Estás seguro?')) {
      onPermanentlyDelete(id);
    }
  };
  const handlePinToggle = () => onUpdate(id, { pinned: !pinned });
  const handleColorChange = (newColor: string) => {
    onUpdate(id, { color: newColor });
    setShowPalette(false);
  };
  const handlePaletteToggle = () => setShowPalette(prev => !prev);
  const handleArchive = () => onUpdateStatus(id, 'archived');
  
  const handleCopyToClipboardForWhatsapp = async () => {
    let textContent = note.content;
    if (note.listItems && note.listItems.length > 0) {
        textContent = listItemsToPlainText(note.listItems);
    }
    textContent = replaceCordialGreeting(textContent);

    try {
      await navigator.clipboard.writeText(textContent);
      if (images && images.length > 0) {
        showToast('Texto copiado. Ahora copia las imágenes.');
        onShowImageCopier(images);
      } else {
        showToast('Texto de la nota copiado al portapapeles.');
      }
    } catch (error) {
      console.error('Error al copiar el texto para WhatsApp:', error);
      showToast('No se pudo copiar el texto de la nota.');
    }
  };

  const handleCopyToClipboardRich = async () => {
    let noteContent = note.content;
    if (note.listItems && note.listItems.length > 0) {
        noteContent = listItemsToPlainText(note.listItems);
    }
    const noteContentAsHtml = noteContent.replace(/\n/g, '<br />');
    let htmlContent = `<div>${replaceCordialGreeting(noteContentAsHtml)}</div>`;
    const textContent = noteContent;
    const hasImages = images && images.length > 0;

    if (!hasImages) {
      try {
        await navigator.clipboard.writeText(textContent);
        showToast('Texto de la nota copiado al portapapeles.');
      } catch(e) {
        showToast('No se pudo copiar la nota.');
      }
      return;
    }

    try {
      const imageSources = images.map(img => typeof img === 'string' ? img : img.src);
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
      showToast('Nota copiada al portapapeles.');
    } catch (error) {
        console.error('Error al copiar al portapapeles:', error);
        try {
            await navigator.clipboard.writeText(textContent);
            showToast('No se pudo copiar contenido enriquecido, se copió solo el texto.');
        } catch (fallbackError) {
            console.error('Error en el copiado de texto de respaldo:', fallbackError);
            showToast('No se pudo copiar la nota.');
        }
    }
  };

  const handleClick = () => {
    // If the title is being edited in-place, a single click on the card
    // should not trigger any action. The input's onBlur will handle saving.
    if (isEditingTitle) {
      return;
    }
    if (selectionModeActive) {
      onToggleSelection(id);
      return;
    }
    // Defer opening the note editor to distinguish single clicks from double clicks.
    clickTimeout.current = window.setTimeout(() => {
      onNoteClick(note);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // This logic should only run when the title is not being edited.
    // The event handler is conditionally attached in the JSX to enforce this.
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const handleTitleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Cancel any pending single-click action (like opening the editor).
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }

    if (selectionModeActive || status === 'trashed' || isEditingTitle) return;
    setEditedTitle(title);
    setIsEditingTitle(true);
  };

  const saveTitle = () => {
    if (editedTitle.trim() !== title) {
      onUpdate(id, { title: editedTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Stop the event from bubbling up to the main card's onKeyDown handler.
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      saveTitle();
    } else if (e.key === 'Escape') {
      setEditedTitle(title); // Reset before closing
      setIsEditingTitle(false);
    }
  };

  const markdownContent = useMemo(() => {
    // One-time migration visualization for old listItems
    if (listItems && listItems.length > 0) {
      return listItems.map(item => `- [${item.checked ? 'x' : ' '}] ${item.text}`).join('\n');
    }
    return content;
  }, [content, listItems]);
  
  const renderedHtml = useMemo(() => parseMarkdown(markdownContent), [markdownContent]);

  const isTrashed = status === 'trashed';
  
  const getCoverImageConfig = () => {
    if (coverImageSettings) {
        return {
            src: coverImageSettings.src,
            style: {
                objectFit: coverImageSettings.objectFit,
                objectPosition: coverImageSettings.objectPosition,
            }
        };
    }
    if (coverImage) {
        return { src: coverImage, style: { objectFit: 'cover', objectPosition: 'center' } };
    }
    if (images && images.length > 0) {
        const firstImage = images[0];
        return {
            src: typeof firstImage === 'string' ? firstImage : firstImage.src,
            style: { objectFit: 'cover', objectPosition: 'center' }
        };
    }
    return { src: null, style: {} };
  };
  
  if (viewMode === 'list') {
    const plainTextContent = useMemo(() => getNotePlainText(note), [note]);
    const snippet = plainTextContent.substring(0, 100).trim();
    const formattedDate = new Date(createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

    const noteColor = color || 'var(--bg-secondary)';
    const textColor = color ? getTextColorForBg(color) : 'var(--text-primary)';

    const cardStyle: React.CSSProperties = {
        backgroundColor: noteColor,
        color: textColor,
        animationDelay,
    };

    const handleCompleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectionModeActive) {
            onToggleSelection(id);
        } else {
            // "Completing" a note will archive it.
            onUpdateStatus(id, 'archived');
        }
    };
    
    return (
        <div
            ref={cardRef}
            role="article"
            aria-labelledby={`note-title-${id}`}
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={!isEditingTitle ? handleKeyDown : undefined}
            className={`relative group shadow-md rounded-lg border border-transparent ${isTrashed ? 'opacity-80' : ''} ${isSelected ? 'card-selected-style' : ''} cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] w-full flex items-center p-2 gap-3 card-hover-effect animate-fade-in-up-stagger`}
            style={cardStyle}
        >
            {/* Left Button: Complete/Select */}
            <div className="flex-shrink-0">
                <button
                    onClick={handleCompleteClick}
                    aria-pressed={isSelected}
                    aria-label={selectionModeActive ? `Seleccionar nota: ${title}` : `Marcar como completada: ${title}`}
                    className="p-2 rounded-full hover:bg-black/10"
                >
                    {selectionModeActive ? (
                        isSelected 
                            ? <CheckboxCheckedIcon className="w-6 h-6 text-[var(--accent-color)]" />
                            : <CheckboxOutlineIcon className="w-6 h-6 opacity-70" />
                    ) : (
                        <CheckCircleIcon className="w-6 h-6 opacity-70"/>
                    )}
                </button>
            </div>

            {/* Center Content */}
            <div className="flex-grow min-w-0" onDoubleClick={handleTitleDoubleClick}>
                <div className="flex items-center">
                    {isEditingTitle ? (
                        <input
                            ref={titleInputRef}
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            onBlur={saveTitle}
                            onKeyDown={handleTitleKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-black/10 font-medium border-b-2 border-[var(--accent-color)] focus:outline-none p-1 -m-1"
                            style={{ color: 'inherit' }}
                            aria-label="Editar título de la nota"
                        />
                    ) : (
                        <h3 id={`note-title-${id}`} className="font-medium break-words truncate">{title || 'Nota sin título'}</h3>
                    )}
                </div>
                <p className="text-sm opacity-80 mt-1 truncate">
                    <span className="font-medium">{formattedDate}</span>
                    <span className="mx-2">&middot;</span>
                    {snippet || 'Sin contenido adicional'}
                </p>
            </div>
            
            {/* Right Actions Menu */}
            {!isTrashed && (
                <div className="flex-shrink-0 relative" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => setMenuOpen(p => !p)}
                        className="p-2 rounded-full hover:bg-black/10 text-current"
                        aria-label="Más acciones"
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen}
                    >
                        <MoreVertIcon className="w-6 h-6"/>
                    </button>
                    {isMenuOpen && (
                        <div ref={menuRef} className="absolute bottom-full right-0 mb-1 w-52 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md shadow-lg border border-[var(--border-color)] z-20 py-1">
                            {!selectionModeActive && (
                                <button onClick={(e) => handleAction(e, handlePinToggle)} className="w-full flex items-center text-left px-3 py-2 text-sm hover:bg-[var(--bg-hover)]">
                                    <PinIcon pinned={pinned} className="w-5 h-5 mr-3"/>
                                    <span>{pinned ? 'Desfijar' : 'Fijar nota'}</span>
                                </button>
                            )}
                            <button onClick={(e) => { e.stopPropagation(); setShowPalette(true); setMenuOpen(false); }} className="w-full flex items-center text-left px-3 py-2 text-sm hover:bg-[var(--bg-hover)]"><PaletteIcon className="w-5 h-5 mr-3"/><span>Cambiar color</span></button>
                            <button onClick={() => { onMoveNote(id); setMenuOpen(false); }} className="w-full flex items-center text-left px-3 py-2 text-sm hover:bg-[var(--bg-hover)]"><MoveToFolderIcon className="w-5 h-5 mr-3"/><span>Mover nota...</span></button>
                            <div className="my-1 h-px bg-[var(--border-color)]"></div>
                            <button onClick={(e) => handleAction(e, handleCopyToClipboardRich)} className="w-full flex items-center text-left px-3 py-2 text-sm hover:bg-[var(--bg-hover)]"><CopyIcon className="w-5 h-5 mr-3"/><span>Copiar nota</span></button>
                            {status === 'archived' ? (
                                <button onClick={(e) => handleAction(e, () => onUpdateStatus(id, 'active'))} className="w-full flex items-center text-left px-3 py-2 text-sm hover:bg-[var(--bg-hover)]"><UnarchiveIcon className="w-5 h-5 mr-3"/><span>Desarchivar</span></button>
                            ) : (
                                <button onClick={(e) => handleAction(e, handleArchive)} className="w-full flex items-center text-left px-3 py-2 text-sm hover:bg-[var(--bg-hover)]"><ArchiveIcon className="w-5 h-5 mr-3"/><span>Archivar</span></button>
                            )}
                            <button onClick={(e) => handleAction(e, handleMoveToTrash)} className="w-full flex items-center text-left px-3 py-2 text-sm hover:bg-[var(--bg-hover)] text-red-500"><TrashIcon className="w-5 h-5 mr-3"/><span>Mover a la papelera</span></button>
                        </div>
                    )}
                </div>
            )}
            
            {isTrashed && (
                 <div className="flex-shrink-0 flex items-center">
                    <button className="p-2 rounded-full hover:bg-black/20" onClick={(e) => handleAction(e, handlePermanentlyDelete)} aria-label="Eliminar permanentemente"><TrashIcon className="w-5 h-5"/></button>
                    <button className="p-2 rounded-full hover:bg-black/20" onClick={(e) => handleAction(e, handleRestore)} aria-label="Restaurar"><RestoreIcon className="w-5 h-5"/></button>
                </div>
            )}

            {showPalette && (
                <div className="absolute bottom-0 right-12 z-30" onClick={e => e.stopPropagation()}>
                    <ColorPicker themeId={themeId} color={color || '#202124'} onChange={handleColorChange} onClose={() => setShowPalette(false)} />
                </div>
            )}
        </div>
    );
  }

  // --- GRID VIEW RENDER ---
  const { src: displayImage, style: imageStyle } = getCoverImageConfig();
  const hasImage = !!displayImage;
  const noteColor = color || '#202124';
  const noteTextColor = getTextColorForBg(noteColor);
  const buttonClasses = hasImage ? 'text-white hover:bg-white/20' : 'hover:bg-black/10';
  
  const cardStyle: React.CSSProperties = {
    backgroundColor: noteColor,
    color: noteTextColor,
    animationDelay,
  };

  return (
    <div
      ref={cardRef}
      role="article"
      aria-labelledby={`note-title-${id}`}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={!isEditingTitle ? handleKeyDown : undefined}
      className={`relative group shadow-lg rounded-lg border border-transparent hover:border-[var(--border-color)] ${isTrashed ? 'opacity-80' : ''} ${isSelected ? 'card-selected-style' : ''} cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] flex flex-col ${hasImage ? 'p-2' : ''} card-hover-effect animate-fade-in-up-stagger`}
      style={cardStyle}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onToggleSelection(id); }}
        aria-pressed={isSelected}
        aria-label={`Seleccionar nota: ${title}`}
        className={`absolute top-2 left-2 z-20 p-1 rounded-full bg-black/20 backdrop-blur-sm transition-opacity ${isSelected || selectionModeActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'}`}
      >
        {isSelected 
            ? <CheckCircleIcon className="w-5 h-5 text-yellow-400 animate-checkbox-pop" />
            : <RadioButtonUncheckedIcon className="w-5 h-5 text-white/80" />
        }
      </button>

      {!isTrashed && !selectionModeActive && (
            <button
                onClick={(e) => handleAction(e, handlePinToggle)}
                aria-label={pinned ? `Desfijar nota: ${title}` : `Fijar nota: ${title}`}
                className={`absolute top-[-16px] left-1/2 -translate-x-1/2 p-2 rounded-full bg-[var(--bg-secondary)] shadow-md border border-[var(--border-color)] text-[var(--text-secondary)] transition-all z-10 ${pinned ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'} hover:!scale-110 hover:text-[var(--text-primary)]`}
            >
                <PinIcon pinned={pinned} className="w-5 h-5" />
            </button>
        )}
      
      {hasImage ? (
        <div className="relative flex-grow w-full rounded-md bg-black/20 overflow-hidden aspect-square">
            <img src={displayImage!} alt={title} className="absolute h-full w-full" style={imageStyle as React.CSSProperties} />
            <div className="absolute bottom-0 left-0 right-0 px-3 pt-3 pb-14 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                 <h3 id={`note-title-${id}`} className="font-medium break-words text-lg text-white shadow-lg">{title}</h3>
            </div>
        </div>
      ) : (
        <div className="px-4 pt-4 pb-16 h-full overflow-hidden flex flex-col">
            <div onDoubleClick={handleTitleDoubleClick} className="group/title-container">
                {isEditingTitle ? (
                     <input
                        ref={titleInputRef}
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onBlur={saveTitle}
                        onKeyDown={handleTitleKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-black/10 text-lg font-medium border-b-2 border-[var(--accent-color)] focus:outline-none p-1 -m-1 mb-2"
                        style={{ color: 'inherit' }}
                        aria-label="Editar título de la nota"
                    />
                ) : (
                    <div className="flex items-start justify-between mb-2">
                        <h3 id={`note-title-${id}`} className={`font-medium break-words flex-1 pr-2 text-lg`}>{title}</h3>
                        {!isTrashed && !selectionModeActive && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditedTitle(title);
                                    setIsEditingTitle(true);
                                }}
                                className="p-1 rounded-full hover:bg-black/20 opacity-0 group-hover/title-container:opacity-70 focus:opacity-100 transition-opacity flex-shrink-0"
                                aria-label={`Editar título de la nota: ${title}`}
                            >
                                <PencilIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>
            
            <div
              className="note-content break-words flex-grow text-sm truncate-note-content prose-styles"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
    
            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    {tags.map(tagName => {
                        const tagColor = tagMap.get(tagName) || '#808080';
                        const tagTextColor = getTextColorForBg(tagColor);
                        return (
                            <span key={tagName} style={{ backgroundColor: tagColor, color: tagTextColor }} className="px-2 py-0.5 text-xs font-medium rounded-full">
                                {tagName}
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2 flex items-end justify-between">
          <div className="min-w-0">
              {createdAt && !hasImage && (
                  <span className="text-xs opacity-60 truncate">
                      {new Date(createdAt).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                      })}
                  </span>
              )}
          </div>
          <div className="flex items-center">
            {isTrashed ? (
              <div className="flex items-center space-x-1">
                <button className={`p-2 rounded-full ${buttonClasses}`} onClick={(e) => handleAction(e, handlePermanentlyDelete)} aria-label={`Eliminar permanentemente la nota: ${title}`}><TrashIcon className="w-5 h-5"/></button>
                <button className={`p-2 rounded-full ${buttonClasses}`} onClick={(e) => handleAction(e, handleRestore)} aria-label={`Restaurar nota: ${title}`}><RestoreIcon className="w-5 h-5"/></button>
              </div>
            ) : (
              !selectionModeActive && (
                <div 
                    onClick={e => e.stopPropagation()}
                    className="flex items-center space-x-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                >
                    <button className={`p-2 rounded-full ${buttonClasses}`} onClick={(e) => handleAction(e, handlePaletteToggle)} aria-label="Cambiar color"><PaletteIcon className="w-5 h-5"/></button>
                    <button className={`p-2 rounded-full ${buttonClasses}`} onClick={(e) => handleAction(e, handleCopyToClipboardForWhatsapp)} aria-label="Copiar para WhatsApp"><WhatsAppIcon className="w-5 h-5"/></button>
                    <button className={`p-2 rounded-full ${buttonClasses}`} onClick={(e) => handleAction(e, handleCopyToClipboardRich)} aria-label="Copiar al portapapeles"><CopyIcon className="w-5 h-5"/></button>
                    {status === 'archived' ? (
                        <button className={`p-2 rounded-full ${buttonClasses}`} onClick={(e) => handleAction(e, () => onUpdateStatus(id, 'active'))} aria-label="Desarchivar"><UnarchiveIcon className="w-5 h-5"/></button>
                    ) : (
                        <button className={`p-2 rounded-full ${buttonClasses}`} onClick={(e) => handleAction(e, handleArchive)} aria-label="Archivar"><ArchiveIcon className="w-5 h-5"/></button>
                    )}
                    <button className={`p-2 rounded-full ${buttonClasses}`} onClick={(e) => handleAction(e, handleMoveToTrash)} aria-label="Mover a la papelera"><TrashIcon className="w-5 h-5"/></button>
                    <div className="relative">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(p => !p); }} 
                            className={`p-2 rounded-full ${buttonClasses}`} 
                            aria-label="Más opciones"
                            aria-haspopup="true"
                            aria-expanded={isMenuOpen}
                        >
                            <MoreVertIcon className="w-5 h-5"/>
                        </button>
                        {isMenuOpen && (
                            <div ref={menuRef} className="absolute bottom-full right-0 mb-1 w-48 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md shadow-lg border border-[var(--border-color)] z-20 py-1"
                                onClick={e => e.stopPropagation()}
                            >
                                <button 
                                    onClick={() => { onMoveNote(id); setMenuOpen(false); }}
                                    className="w-full flex items-center text-left px-3 py-2 text-sm hover:bg-[var(--bg-hover)]"
                                >
                                    <MoveToFolderIcon className="w-5 h-5 mr-3" />
                                    <span>Mover nota...</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
              )
            )}
          </div>
      </div>
      
      {showPalette && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20" onClick={e => e.stopPropagation()}>
            <ColorPicker
                themeId={themeId}
                color={noteColor}
                onChange={handleColorChange}
                onClose={() => setShowPalette(false)}
            />
        </div>
      )}
    </div>
  );
};

export default NoteCard;