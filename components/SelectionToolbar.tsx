import React from 'react';
import { CloseIcon, ArchiveIcon, TrashIcon, MoveToFolderIcon } from './Icons';

interface SelectionToolbarProps {
  selectedCount: number;
  onArchive: () => void;
  onTrash: () => void;
  onMove: () => void;
  onClearSelection: () => void;
  isLoading: boolean;
}

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  selectedCount,
  onArchive,
  onTrash,
  onMove,
  onClearSelection,
  isLoading
}) => {
  return (
    <div 
      role="toolbar" 
      aria-label="Selection actions"
      className="fixed top-16 left-0 right-0 z-30 bg-[var(--bg-secondary)] shadow-lg flex items-center justify-between px-4 h-14 animate-slide-in-down border-b border-[var(--border-color)]"
    >
      <div className="flex items-center gap-4">
        <button onClick={onClearSelection} className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]" aria-label="Clear selection">
          <CloseIcon className="w-6 h-6" />
        </button>
        <span className="font-semibold text-[var(--text-primary)]">{selectedCount} seleccionada(s)</span>
      </div>
      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
        <button onClick={onArchive} disabled={isLoading} className="p-2 rounded-full hover:bg-[var(--bg-hover)] disabled:opacity-50 disabled:cursor-wait" aria-label="Archive selected">
          <ArchiveIcon className="w-6 h-6" />
        </button>
        <button onClick={onTrash} disabled={isLoading} className="p-2 rounded-full hover:bg-[var(--bg-hover)] disabled:opacity-50 disabled:cursor-wait" aria-label="Move selected to trash">
          <TrashIcon className="w-6 h-6" />
        </button>
        <button onClick={onMove} disabled={isLoading} className="p-2 rounded-full hover:bg-[var(--bg-hover)] disabled:opacity-50 disabled:cursor-wait" aria-label="Move selected">
          <MoveToFolderIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default SelectionToolbar;