

import React from 'react';
// FIX: Import ImageAttachment to correctly type the onShowImageCopier prop.
import type { Note, Folder, Tag, ImageAttachment } from '../types';
import NoteCard from './NoteCard';
import { LogoIcon } from './Icons';

interface NoteGridProps {
  pinnedNotes: Note[];
  otherNotes: Note[];
  viewMode: 'grid' | 'list';
  tags: Tag[];
  themeId: string;
  onUpdateNote: (id: number, updatedData: Partial<Omit<Note, 'id'>>) => void;
  onUpdateStatus: (id: number, status: Note['status']) => void;
  onPermanentlyDelete: (id: number) => void;
  onEmptyTrash: () => void;
  activeSelection: { type: string, id: number | string };
  folders: Folder[];
  onNoteClick: (note: Note) => void;
  showToast: (message: string) => void;
  // FIX: Update prop type to accept both string and ImageAttachment arrays.
  onShowImageCopier: (images: (string | ImageAttachment)[]) => void;
  selectedNoteIds: number[];
  onToggleNoteSelection: (id: number) => void;
  onMoveSingleNote: (noteId: number) => void;
}

const NoteGrid: React.FC<NoteGridProps> = ({ 
  pinnedNotes, 
  otherNotes, 
  viewMode, 
  tags,
  themeId,
  onUpdateNote, 
  onUpdateStatus, 
  onPermanentlyDelete,
  onEmptyTrash,
  activeSelection,
  folders,
  onNoteClick,
  showToast,
  onShowImageCopier,
  selectedNoteIds,
  onToggleNoteSelection,
  onMoveSingleNote
}) => {
  
  const selectionModeActive = selectedNoteIds.length > 0;

  const renderNotes = (notes: Note[], isPinnedSection: boolean = false) => {
    const gridKey = `${activeSelection.type}-${activeSelection.id}-${isPinnedSection}`;

    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" key={gridKey}>
          {notes.map((note, index) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              tags={tags}
              themeId={themeId}
              viewMode={viewMode}
              onUpdate={onUpdateNote}
              onUpdateStatus={onUpdateStatus}
              onPermanentlyDelete={onPermanentlyDelete}
              folders={folders}
              onNoteClick={onNoteClick}
              showToast={showToast}
              onShowImageCopier={onShowImageCopier}
              isSelected={selectedNoteIds.includes(note.id)}
              onToggleSelection={onToggleNoteSelection}
              selectionModeActive={selectionModeActive}
              onMoveNote={onMoveSingleNote}
              animationDelay={`${index * 50}ms`}
            />
          ))}
        </div>
      );
    }
    return (
        <div className="flex flex-col items-center gap-3" key={gridKey}>
            {notes.map((note, index) => (
                <div key={note.id} className="w-full max-w-3xl">
                    <NoteCard 
                      note={note}
                      tags={tags}
                      themeId={themeId}
                      viewMode={viewMode}
                      onUpdate={onUpdateNote}
                      onUpdateStatus={onUpdateStatus}
                      onPermanentlyDelete={onPermanentlyDelete}
                      folders={folders}
                      onNoteClick={onNoteClick}
                      showToast={showToast}
                      onShowImageCopier={onShowImageCopier}
                      isSelected={selectedNoteIds.includes(note.id)}
                      onToggleSelection={onToggleNoteSelection}
                      selectionModeActive={selectionModeActive}
                      onMoveNote={onMoveSingleNote}
                      animationDelay={`${index * 50}ms`}
                    />
                </div>
            ))}
        </div>
    );
  };

  const hasPinnedNotes = pinnedNotes.length > 0;
  const hasOtherNotes = otherNotes.length > 0;
  const hasContent = hasPinnedNotes || hasOtherNotes;
  const isTrashView = activeSelection.id === 'Papelera';

  const emptyIcon = isTrashView 
      ? <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-[var(--text-secondary)] opacity-50 mb-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"></path></svg>
      : <LogoIcon className="w-24 h-24 text-[var(--text-secondary)] opacity-50 mb-4" />;

  return (
    <div>
      {isTrashView && otherNotes.length > 0 && (
        <div className="text-center text-[var(--text-secondary)] text-sm mb-6 flex justify-between items-center max-w-2xl mx-auto px-4">
            <span>Las notas de la papelera se eliminan después de 7 días.</span>
            <button 
              onClick={onEmptyTrash} 
              className="text-[var(--accent-color)] hover:underline font-semibold"
            >
              Vaciar papelera
            </button>
        </div>
      )}

      {!hasContent ? (
        <div className="text-center text-[var(--text-secondary)] mt-16 flex flex-col items-center">
            {emptyIcon}
            <p className="text-lg">{isTrashView ? 'La papelera está vacía' : 'No se han encontrado notas.'}</p>
        </div>
      ) : (
        <>
          {hasPinnedNotes && (
            <div className="mb-12">
              <h2 className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-4 tracking-wider">FIJADAS</h2>
              {renderNotes(pinnedNotes, true)}
            </div>
          )}
          {hasOtherNotes && (
            <div>
              {hasPinnedNotes && <h2 className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-4 tracking-wider">OTRAS</h2>}
              {renderNotes(otherNotes)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NoteGrid;