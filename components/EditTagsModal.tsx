import React, { useState, useRef, useEffect } from 'react';
import { TagIcon, TrashIcon, CloseIcon, CheckIcon, PencilIcon } from './Icons';
import type { Tag } from '../types';
import ColorPicker from './ColorPicker';

interface EditTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: Tag[];
  themeId: string;
  onCreateTag: (tagName: string) => void;
  onDeleteTag: (tagName: string) => void;
  onUpdateTag: (oldName: string, updatedData: { newName?: string; color?: string }) => void;
  showToast: (message: string) => void;
}

const EditTagsModal: React.FC<EditTagsModalProps> = ({ isOpen, onClose, tags, themeId, onCreateTag, onDeleteTag, onUpdateTag, showToast }) => {
  const [newTagName, setNewTagName] = useState('');
  const [renamingTag, setRenamingTag] = useState<Tag | null>(null);
  const [editedName, setEditedName] = useState('');
  const [colorPickerOpenFor, setColorPickerOpenFor] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();

        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Tab') {
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
        };

        const modalNode = modalRef.current;
        modalNode?.addEventListener('keydown', handleKeyDown);

        return () => {
          modalNode?.removeEventListener('keydown', handleKeyDown);
        };
      }
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && modalRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest('.color-picker-container')) {
             setColorPickerOpenFor(null);
        }
      }
    };

    if (colorPickerOpenFor) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [colorPickerOpenFor]);

  const handleCloseAndReset = () => {
    onClose();
    setNewTagName('');
    setRenamingTag(null);
    setEditedName('');
    setColorPickerOpenFor(null);
  };

  if (!isOpen) {
    return null;
  }
  
  const handleCreate = () => {
    const trimmedName = newTagName.trim();
    if (!trimmedName) {
      return;
    }
    if (tags.some(t => t.name.toLowerCase() === trimmedName.toLowerCase())) {
      showToast(`La etiqueta "${trimmedName}" ya existe.`);
      return;
    }
    onCreateTag(trimmedName);
    setNewTagName('');
  };
  
  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  const startRename = (tag: Tag) => {
    setRenamingTag(tag);
    setEditedName(tag.name);
    setColorPickerOpenFor(null);
  };

  const cancelRename = () => {
    setRenamingTag(null);
    setEditedName('');
  };

  const saveRename = () => {
    if (!renamingTag) return;
    
    const newName = editedName.trim();
    const oldName = renamingTag.name;

    if (!newName) {
      cancelRename();
      return;
    }
    
    if (newName.toLowerCase() !== oldName.toLowerCase()) {
      if (tags.some(t => t.name.toLowerCase() === newName.toLowerCase())) {
        showToast(`La etiqueta "${newName}" ya existe.`);
        return;
      }
    }

    if (newName !== oldName) {
      onUpdateTag(oldName, { newName });
    }
    cancelRename();
  };
  
  const handleRenameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        saveRename();
    } else if (e.key === 'Escape') {
        cancelRename();
    }
  };
  
  const handleColorUpdate = (tagName: string, color: string) => {
    onUpdateTag(tagName, { color });
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center animate-fade-in"
        onClick={handleCloseAndReset}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-tags-title"
    >
      <div 
        ref={modalRef}
        className="bg-[var(--bg-secondary)] rounded-lg shadow-xl w-full max-w-sm text-[var(--text-primary)] border border-[var(--border-color)] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[var(--border-color)]">
          <h2 id="edit-tags-title" className="text-lg font-medium">Editar etiquetas</h2>
        </div>

        <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Crear etiqueta nueva"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyPress={handleInputKeyPress}
                    className="flex-grow bg-[var(--bg-tertiary)] placeholder-[var(--text-secondary)] text-[var(--text-primary)] rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                    aria-label="New tag name"
                />
                <button 
                    onClick={handleCreate} 
                    className="p-2 rounded-full hover:bg-[var(--bg-hover)]"
                    aria-label="Create tag"
                >
                    <CheckIcon className="w-6 h-6"/>
                </button>
            </div>

            <ul className="space-y-1 max-h-60 overflow-y-auto pr-2">
                {tags.map((tag) => (
                    <li key={tag.name} className="group flex items-center justify-between hover:bg-[var(--bg-hover)] p-1 rounded-md">
                        {renamingTag?.name === tag.name ? (
                            <>
                                <div className="flex items-center gap-4 flex-grow">
                                    <TagIcon className="w-5 h-5" style={{ color: tag.color }} />
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        onKeyDown={handleRenameKeyPress}
                                        className="flex-grow bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded py-1 px-2 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] w-full"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex items-center">
                                    <button onClick={saveRename} className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]" aria-label="Save rename"><CheckIcon className="w-5 h-5"/></button>
                                    <button onClick={cancelRename} className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]" aria-label="Cancel rename"><CloseIcon className="w-5 h-5"/></button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-4">
                                    <div className="relative color-picker-container">
                                        <button 
                                            onClick={() => setColorPickerOpenFor(tag.name === colorPickerOpenFor ? null : tag.name)}
                                            className="p-1 rounded-full hover:bg-[var(--bg-hover)]"
                                            aria-label={`Change color for tag ${tag.name}`}
                                        >
                                            <TagIcon className="w-5 h-5" style={{ color: tag.color }} />
                                        </button>
                                        {colorPickerOpenFor === tag.name && (
                                            <div className="absolute top-full mt-2 left-0 z-10" onClick={e => e.stopPropagation()}>
                                                <ColorPicker
                                                    themeId={themeId}
                                                    color={tag.color}
                                                    onChange={(newColor) => handleColorUpdate(tag.name, newColor)}
                                                    onClose={() => setColorPickerOpenFor(null)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <span className="truncate max-w-[150px]">{tag.name}</span>
                                </div>
                                <div className="flex items-center">
                                    <button 
                                        onClick={() => startRename(tag)} 
                                        className="p-2 rounded-full text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-hover)] focus:opacity-100"
                                        aria-label={`Rename tag ${tag.name}`}
                                    >
                                        <PencilIcon className="w-5 h-5"/>
                                    </button>
                                    <button 
                                        onClick={() => onDeleteTag(tag.name)} 
                                        className="p-2 rounded-full text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-hover)] focus:opacity-100"
                                        aria-label={`Delete tag ${tag.name}`}
                                    >
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
                 {tags.length === 0 && <li className="px-2 py-1 text-[var(--text-secondary)] italic text-center">No hay etiquetas creadas.</li>}
            </ul>
        </div>
        
        <div className="p-4 border-t border-[var(--border-color)] text-right">
          <button 
            onClick={handleCloseAndReset}
            className="px-6 py-2 text-sm font-medium text-[var(--text-primary)] rounded hover:bg-[var(--bg-hover)]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTagsModal;