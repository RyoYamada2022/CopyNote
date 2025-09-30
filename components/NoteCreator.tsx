import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { ImageIcon, CloseIcon, CheckboxIcon, SpinnerIcon } from './Icons';
import type { Note, Folder, NoteDraft, ImageAttachment } from '../types';

interface ActiveSelection {
  type: 'folder' | 'category' | 'special' | 'tag';
  id: number | string;
}
interface NoteCreatorProps {
    onAddNote: (note: Omit<Note, 'id' | 'pinned' | 'status' | 'createdAt'>) => void;
    activeSelection: ActiveSelection;
    folders: Folder[];
    themeId: string;
    isLoading: boolean;
}

interface NoteCreatorRef {
  focus: () => void;
}

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

const NoteCreator = forwardRef<NoteCreatorRef, NoteCreatorProps>(({ onAddNote, activeSelection, folders, themeId, isLoading }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imagePreviews, setImagePreviews] = useState<ImageAttachment[]>([]);
    
    const creatorRef = useRef<HTMLDivElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const DRAFT_KEY = 'note_creator_draft_markdown';
    
    useImperativeHandle(ref, () => ({
        focus: () => {
            setIsExpanded(true);
            setTimeout(() => {
                titleInputRef.current?.focus();
            }, 100);
        }
    }));

    // Auto-save draft
    useEffect(() => {
        if (!isExpanded) return;

        const draft: NoteDraft = { id: 'new', title, content, images: imagePreviews };
        
        const handler = setTimeout(() => {
            if (title || content || imagePreviews.length > 0) {
                 localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
            } else {
                 localStorage.removeItem(DRAFT_KEY);
            }
        }, 3000);

        return () => clearTimeout(handler);
    }, [title, content, imagePreviews, isExpanded]);

    // Restore draft on initial load
    useEffect(() => {
        const savedDraftJSON = localStorage.getItem(DRAFT_KEY);
        if (savedDraftJSON) {
            try {
                const draft: NoteDraft = JSON.parse(savedDraftJSON);
                setTitle(draft.title);
                setContent(draft.content);
                setImagePreviews(draft.images || []);
                setIsExpanded(true);
            } catch (e) {
                console.error("Failed to parse creator draft", e);
                localStorage.removeItem(DRAFT_KEY);
            }
        }
    }, []);

    const resetState = () => {
        setTitle('');
        setContent('');
        setIsExpanded(false);
        setImagePreviews([]);
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
        localStorage.removeItem(DRAFT_KEY);
    }

    const handleClose = useCallback(() => {
        if (isLoading) return;

        let folderId: number;
        let categoryId: number;

        if (activeSelection.type === 'category') {
            categoryId = activeSelection.id as number;
            const containingFolder = folders.find(f => f.categories.some(c => c.id === categoryId));
            folderId = containingFolder ? containingFolder.id : folders[0].id;
        } else if (activeSelection.type === 'folder') {
            folderId = activeSelection.id as number;
            const folder = folders.find(f => f.id === folderId);
            categoryId = folder ? folder.categories[0].id : folders[0].categories[0].id;
        } else { // Default case for 'Notas' or other special views
            folderId = folders[0].id;
            categoryId = folders[0].categories[0].id;
        }

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (trimmedTitle || trimmedContent || imagePreviews.length > 0) {
            const noteData: Omit<Note, 'id' | 'pinned' | 'status' | 'createdAt'> = {
                title: trimmedTitle,
                content: trimmedContent,
                color: '#202124',
                images: imagePreviews.length > 0 ? imagePreviews : undefined,
                folderId,
                categoryId,
            };
            onAddNote(noteData);
        }
        
        resetState();
    }, [activeSelection, content, folders, imagePreviews, onAddNote, title, isLoading]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (creatorRef.current && !creatorRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };
        if (isExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isExpanded, handleClose]); 

    const handleImageUploadClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        imageInputRef.current?.click();
    };
    
    const handleNewChecklistClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(true);
        setContent('- [ ] ');
        setTimeout(() => contentRef.current?.focus(), 100);
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
                setImagePreviews(prev => [...prev, ...newImages]);
                 if (!isExpanded) {
                    setIsExpanded(true);
                }
            }).catch(error => {
                console.error("Error compressing images:", error);
            });
            
            if (e.target) {
                e.target.value = '';
            }
        }
    };
    
    const removeImage = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        setImagePreviews(previews => previews.filter((_, i) => i !== index));
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };

    if (!isExpanded) {
        return (
            <div className="max-w-xl mx-auto mb-10">
                <div className="w-full bg-[var(--bg-secondary)] shadow-lg rounded-lg border border-[var(--border-color)] hover:border-gray-400 dark:hover:border-gray-500 flex items-center justify-between p-2 pl-4">
                    <span onClick={() => setIsExpanded(true)} className="text-[var(--text-secondary)] cursor-text flex-grow">
                        Crear una nota...
                    </span>
                    <div className="flex items-center">
                        <button onClick={handleNewChecklistClick} className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]" aria-label="Nueva nota de lista">
                            <CheckboxIcon className="w-6 h-6" />
                        </button>
                        <button onClick={handleImageUploadClick} className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]" aria-label="Nueva nota con imagen">
                            <ImageIcon className="w-6 h-6" />
                        </button>
                         <input type="file" ref={imageInputRef} onChange={handleImageSelected} accept="image/*" className="hidden" multiple />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto mb-10" ref={creatorRef}>
            <div className="bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-xl rounded-lg border border-[var(--border-color)]">
                {imagePreviews.length > 0 && (
                    <div className="p-2 flex space-x-2 overflow-x-auto">
                        {imagePreviews.map((img, index) => (
                             <div key={index} className="relative flex-shrink-0 group">
                                <img src={img.src} alt={`Preview ${index + 1}`} className="h-24 w-24 object-cover rounded-md" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <button 
                                        onClick={(e) => removeImage(e, index)} 
                                        className="p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                                        aria-label={`Remove image ${index + 1}`}
                                    >
                                        <CloseIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="p-4">
                    <input
                        ref={titleInputRef}
                        type="text"
                        placeholder="Título"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent text-xl font-medium placeholder-[var(--text-secondary)] focus:outline-none mb-3"
                    />
                    
                    <textarea
                        ref={contentRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Crear una nota..."
                        className="w-full bg-transparent focus:outline-none resize-y min-h-[150px] p-2 rounded-b-md placeholder:text-[var(--text-secondary)]"
                        autoFocus={imagePreviews.length === 0}
                    />
                </div>
                 <div className="flex items-center justify-between p-2">
                    <div className="flex items-center space-x-1 text-[var(--text-secondary)]">
                        <button onClick={handleImageUploadClick} className="p-2 rounded-full hover:bg-[var(--bg-hover)]" aria-label="Añadir imagen">
                            <ImageIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <button 
                        onClick={handleClose}
                        disabled={isLoading}
                        className="px-6 py-2 text-sm font-medium rounded hover:bg-[var(--bg-hover)] disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isLoading ? <SpinnerIcon className="w-5 h-5 mx-auto" /> : 'Cerrar'}
                    </button>
                </div>
            </div>
             <input type="file" ref={imageInputRef} onChange={handleImageSelected} accept="image/*" className="hidden" multiple />
        </div>
    );
});

export default NoteCreator;