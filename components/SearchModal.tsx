import React, { useEffect, useRef, useMemo } from 'react';
// FIX: Add ListItem to imports.
import type { Note, Folder, Tag, ListItem } from '../types';
import { SearchIcon, TagIcon } from './Icons';

// FIX: Add missing 'SearchModalProps' interface.
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  notes: Note[];
  folders: Folder[];
  tags: Tag[];
  onNoteClick: (note: Note) => void;
}

const listItemsToPlainText = (items: ListItem[]): string => {
    let texts: string[] = [];
    for (const item of items) {
        texts.push(item.text);
        if (item.subItems) {
            texts = texts.concat(listItemsToPlainText(item.subItems));
        }
    }
    return texts.join(' ');
};

const convertToPlainText = (note: Note): string => {
    if (note.listItems && note.listItems.length > 0) {
        return listItemsToPlainText(note.listItems);
    }
    return note.content;
};

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, searchTerm, onSearchChange, notes, folders, tags, onNoteClick }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
        triggerRef.current?.focus();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        } else if (event.key === 'Tab') {
            const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
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
    };
    
    const modalNode = modalRef.current;
    modalNode?.addEventListener('keydown', handleKeyDown);

    return () => {
        modalNode?.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const folderMap = useMemo(() => new Map(folders.map(f => [f.id, f.name])), [folders]);
  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    folders.forEach(f => f.categories.forEach(c => map.set(c.id, c.name)));
    return map;
  }, [folders]);

  const suggestedTags = useMemo(() => {
    if (!searchTerm.trim()) {
      return [];
    }
    const searchLower = searchTerm.toLowerCase();
    // Sugiere etiquetas que incluyen el término de búsqueda, pero no son una coincidencia exacta
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(searchLower) && 
      tag.name.toLowerCase() !== searchLower
    );
  }, [searchTerm, tags]);

  const filteredNotes = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const searchLower = searchTerm.toLowerCase();
      
    return notes.filter(note => {
        const folderName = folderMap.get(note.folderId)?.toLowerCase() || '';
        const categoryName = categoryMap.get(note.categoryId)?.toLowerCase() || '';

        // For backward compatibility with non-migrated list notes
        const listContent = (note.listItems || []).map(item => item.text).join(' ');

        return (
          note.title.toLowerCase().includes(searchLower) ||
          note.content.toLowerCase().includes(searchLower) ||
          listContent.toLowerCase().includes(searchLower) ||
          folderName.includes(searchLower) ||
          categoryName.includes(searchLower) ||
          (note.tags || []).some(tag => tag.toLowerCase().includes(searchLower))
        );
    });
  }, [searchTerm, notes, folderMap, categoryMap]);

  if (!isOpen) {
    return null;
  }

  const handleNoteSelect = (note: Note) => {
    onNoteClick(note);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex justify-center pt-24 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-input"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-[var(--bg-secondary)] rounded-xl shadow-2xl border border-[var(--border-color)] h-fit max-h-[70vh] flex flex-col animate-slide-in-down"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center p-4 border-b border-[var(--border-color)] flex-shrink-0">
          <SearchIcon className="w-6 h-6 text-[var(--text-secondary)] mr-4" />
          <input
            id="search-input"
            ref={inputRef}
            type="text"
            placeholder="Buscar notas o etiquetas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent text-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none"
          />
        </div>
        {suggestedTags.length > 0 && (
          <div className="p-3 border-b border-[var(--border-color)] flex flex-wrap gap-2">
            <span className="text-xs text-[var(--text-secondary)] font-semibold w-full mb-1">SUGERENCIAS DE ETIQUETAS</span>
            {suggestedTags.slice(0, 5).map(tag => (
              <button
                key={tag.name}
                onClick={() => {
                  onSearchChange(tag.name);
                  inputRef.current?.focus();
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--bg-accent)] transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                <TagIcon className="w-4 h-4" style={{ color: tag.color }} />
                <span>{tag.name}</span>
              </button>
            ))}
          </div>
        )}
        <div className="overflow-y-auto">
          {searchTerm.trim() !== '' && (
            <ul role="listbox" aria-label="Search results">
              {filteredNotes.length > 0 ? (
                filteredNotes.map(note => (
                  <li key={note.id} role="option" aria-selected="false">
                    <button
                      onClick={() => handleNoteSelect(note)}
                      className="w-full text-left p-4 hover:bg-[var(--bg-accent)] focus:bg-[var(--bg-accent)] focus:outline-none transition-colors"
                    >
                      <div className="font-medium text-[var(--text-primary)]">{note.title || 'Nota sin título'}</div>
                      <p className="text-sm text-[var(--text-secondary)] mt-1 truncate">
                        {convertToPlainText(note)}
                      </p>
                    </button>
                  </li>
                ))
              ) : (
                <li className="p-6 text-center text-[var(--text-secondary)]">No se encontraron resultados.</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;