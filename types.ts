export interface ListItem {
  id: number;
  text: string;
  checked: boolean;
  subItems?: ListItem[];
}

export interface Category {
  id: number;
  name: string;
  color?: string;
}

export interface Folder {
  id: number;
  name: string;
  categories: Category[];
  color?: string;
}

export interface NoteVersion {
  title: string;
  content: string;
  listItems?: ListItem[];
  timestamp: number;
  images?: (string | ImageAttachment)[];
}

export type ImageSize = 'small' | 'medium' | 'large';

export interface ImageAttachment {
  src: string;
  size: ImageSize;
}

export interface CoverImageSettings {
  src: string;
  objectFit: 'cover' | 'contain';
  objectPosition: 'top' | 'center' | 'bottom';
}

export interface Note {
  id: number;
  createdAt: number;
  title: string;
  content: string; // Now stores markdown
  listItems?: ListItem[]; // For backward compatibility, will be migrated
  pinned: boolean;
  status: 'active' | 'archived' | 'trashed';
  color?: string;
  images?: (string | ImageAttachment)[];
  coverImage?: string; // For backward compatibility
  coverImageSettings?: CoverImageSettings;
  folderId: number;
  categoryId: number;
  history?: NoteVersion[];
  tags?: string[];
}

export type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' | 'color';

export interface NoteDraft {
  id: number | 'new'; // 'new' for the creator, or the note's ID for the editor
  title: string;
  content: string; // Markdown content
  images?: ImageAttachment[];
}

// FIX: Add missing 'Tag' type for EditTagsModal component.
export interface Tag {
  name: string;
  color: string;
}