import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Folder } from '../types';
import { FolderIcon, ChevronRightIcon } from './Icons';

interface MoveNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  onMove: (folderId: number, categoryId: number) => void;
  selectedCount: number;
}

const MoveNoteModal: React.FC<MoveNoteModalProps> = ({ isOpen, onClose, folders, onMove, selectedCount }) => {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
        setSelectedFolderId(null);
        setSelectedCategoryId(null);

        triggerRef.current = document.activeElement as HTMLElement;
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements && focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    } else {
        triggerRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Tab') {
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
  }, [isOpen, selectedFolderId]);

  const selectedFolder = useMemo(() => {
    return folders.find(f => f.id === selectedFolderId) || null;
  }, [selectedFolderId, folders]);

  const handleMove = () => {
    if (selectedFolderId && selectedCategoryId) {
        onMove(selectedFolderId, selectedCategoryId);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="move-note-title"
    >
      <div 
        ref={modalRef}
        className="bg-[var(--bg-secondary)] rounded-lg shadow-xl w-full max-w-sm text-[var(--text-primary)] flex flex-col border border-[var(--border-color)] animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[var(--border-color)]">
          <h2 id="move-note-title" className="text-lg font-medium">Mover {selectedCount} nota(s) a...</h2>
        </div>
        <div className="p-4 max-h-80 overflow-y-auto">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Seleccionar carpeta</h3>
          <ul className="space-y-1">
            {folders.map(folder => (
              <li key={folder.id}>
                <button
                  onClick={() => { setSelectedFolderId(folder.id); setSelectedCategoryId(null); }}
                  aria-selected={selectedFolderId === folder.id}
                  className={`w-full flex items-center text-left p-2 rounded-md transition-colors ${selectedFolderId === folder.id ? 'bg-[var(--bg-accent)] text-[var(--text-accent)]' : 'hover:bg-[var(--bg-hover)]'}`}
                >
                  <FolderIcon className="w-5 h-5 mr-3" style={{ color: folder.color }} />
                  <span className="flex-1">{folder.name}</span>
                  <ChevronRightIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                </button>
              </li>
            ))}
          </ul>

          {selectedFolder && (
            <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Seleccionar categoría en "{selectedFolder.name}"</h3>
              {selectedFolder.categories.length > 0 ? (
                <ul className="space-y-1">
                    {selectedFolder.categories.map(category => (
                    <li key={category.id}>
                        <button
                            onClick={() => setSelectedCategoryId(category.id)}
                            aria-selected={selectedCategoryId === category.id}
                            className={`w-full flex items-center text-left p-2 rounded-md transition-colors ${selectedCategoryId === category.id ? 'bg-[var(--bg-accent)] text-[var(--text-accent)]' : 'hover:bg-[var(--bg-hover)]'}`}
                        >
                            <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: category.color }}></span>
                            <span>{category.name}</span>
                        </button>
                    </li>
                    ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--text-secondary)] italic">Esta carpeta no tiene categorías.</p>
              )}
            </div>
          )}
        </div>
        <div className="p-4 flex justify-end gap-3 border-t border-[var(--border-color)]">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded hover:bg-[var(--bg-hover)]">
            Cancelar
          </button>
          <button
            onClick={handleMove}
            disabled={!selectedFolderId || !selectedCategoryId}
            className="px-4 py-2 text-sm font-medium bg-[var(--accent-color)] text-white rounded disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            Mover
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveNoteModal;