import React, { useState, useRef, useEffect } from 'react';
import { MenuIcon, SearchIcon, GridViewIcon, ListViewIcon, LogoIcon, PaletteIcon, CheckIcon, SortIcon, SpinnerIcon, SettingsIcon } from './Icons';
import type { Theme } from '../themes';
import type { SortOption } from '../types';
import ColorPicker from './ColorPicker';

interface HeaderProps {
    onMenuClick: () => void;
    onSearchClick: () => void;
    viewMode: 'grid' | 'list';
    onViewModeToggle: () => void;
    themes: Theme[];
    activeThemeId: string;
    onThemeChange: (themeId: string) => void;
    sortOption: SortOption;
    onSortChange: (option: SortOption) => void;
    isLoading: boolean;
    glowColor: string | null;
    onGlowColorChange: (color: string | null) => void;
}

const SORT_OPTIONS: { id: SortOption, label: string }[] = [
  { id: 'date-desc', label: 'Fecha de creación (más reciente primero)' },
  { id: 'date-asc', label: 'Fecha de creación (más antigua primero)' },
  { id: 'title-asc', label: 'Título (A-Z)' },
  { id: 'title-desc', label: 'Título (Z-A)' },
  { id: 'color', label: 'Color' },
];


const Header: React.FC<HeaderProps> = ({ onMenuClick, onSearchClick, viewMode, onViewModeToggle, themes, activeThemeId, onThemeChange, sortOption, onSortChange, isLoading, glowColor, onGlowColorChange }) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isConfigMenuOpen, setIsConfigMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const configMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
            setIsThemeMenuOpen(false);
        }
        if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
            setIsSortMenuOpen(false);
        }
        if (configMenuRef.current && !configMenuRef.current.contains(event.target as Node)) {
            setIsConfigMenuOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const lightThemes = themes.filter(t => t.group === 'light');
  const darkThemes = themes.filter(t => t.group === 'dark');
  
  const activeTheme = themes.find(t => t.id === activeThemeId);
  const defaultGlowColor = activeTheme ? activeTheme.colors.accentColor : '#FBBC05';

  return (
    <header className="sticky top-0 flex items-center justify-between px-4 h-16 shrink-0 bg-[var(--bg-secondary-alpha)] shadow-md backdrop-blur-sm z-20 border-b border-[var(--border-color)]">
      <div className="flex items-center space-x-4">
        <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]" aria-label="Toggle menu">
          <MenuIcon className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-3">
          <LogoIcon className="w-8 h-8 text-[var(--text-primary)]" />
          <span className="text-xl text-[var(--text-primary)]">CopyNote</span>
           {isLoading && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] ml-4">
                    <SpinnerIcon className="w-4 h-4" />
                    <span>Guardando...</span>
                </div>
            )}
        </div>
      </div>

      <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
        <button 
          className="p-2 rounded-full hover:bg-[var(--bg-hover)] flex items-center gap-2" 
          onClick={onSearchClick}
          aria-label="Search notes"
        >
          <SearchIcon className="w-6 h-6" />
          <span className="hidden md:inline text-sm text-[var(--text-secondary)]">Ctrl+K</span>
        </button>
        <button className="p-2 rounded-full hover:bg-[var(--bg-hover)]" onClick={onViewModeToggle} aria-label="Toggle view mode">
          {viewMode === 'grid' ? <ListViewIcon className="w-6 h-6" /> : <GridViewIcon className="w-6 h-6" />}
        </button>
        <div className="relative" ref={sortMenuRef}>
          <button 
            className="p-2 rounded-full hover:bg-[var(--bg-hover)]" 
            onClick={() => setIsSortMenuOpen(p => !p)} 
            aria-label="Sort notes"
            aria-haspopup="true"
            aria-expanded={isSortMenuOpen}
            aria-controls="sort-menu"
          >
            <SortIcon className="w-6 h-6" />
          </button>
          {isSortMenuOpen && (
            <div id="sort-menu" role="menu" className="absolute right-0 top-full mt-2 w-64 bg-[var(--bg-secondary)] rounded-md shadow-lg border border-[var(--border-color)] z-30 p-2">
                <p className="px-2 py-1 text-xs font-semibold text-[var(--text-secondary)]" id="sort-menu-label">Ordenar por</p>
                {SORT_OPTIONS.map(option => (
                    <button 
                        key={option.id}
                        role="menuitem" 
                        onClick={() => { onSortChange(option.id); setIsSortMenuOpen(false); }} 
                        className="w-full flex items-center text-left px-2 py-1.5 text-sm rounded hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
                    >
                        <span className="flex-1">{option.label}</span>
                        {sortOption === option.id && <CheckIcon className="w-5 h-5 text-[var(--accent-color)]"/>}
                    </button>
                ))}
            </div>
          )}
        </div>
        <div className="relative" ref={configMenuRef}>
          <button 
            className="p-2 rounded-full hover:bg-[var(--bg-hover)]" 
            onClick={() => setIsConfigMenuOpen(p => !p)} 
            aria-label="Configuración"
            aria-haspopup="true"
            aria-expanded={isConfigMenuOpen}
            aria-controls="config-menu"
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
          {isConfigMenuOpen && (
            <div 
              id="config-menu" 
              role="menu" 
              className="absolute right-0 top-full mt-2 bg-[var(--bg-secondary)] rounded-md shadow-lg border border-[var(--border-color)] z-30"
            >
                <div className="p-2">
                    <p className="px-2 py-1 text-xs font-semibold text-[var(--text-secondary)]" id="config-menu-label">Color del Resplandor</p>
                    <ColorPicker
                        color={glowColor || defaultGlowColor}
                        onChange={(newColor) => onGlowColorChange(newColor)}
                        onClose={() => setIsConfigMenuOpen(false)}
                        themeId={activeThemeId}
                    />
                </div>
                <div className="p-2 border-t border-[var(--border-color)]">
                    <button
                        onClick={() => {
                            onGlowColorChange(null);
                            setIsConfigMenuOpen(false);
                        }}
                        className="w-full text-center px-2 py-1.5 text-sm rounded hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
                    >
                        Restaurar al color del tema
                    </button>
                </div>
            </div>
          )}
        </div>
        <div className="relative" ref={themeMenuRef}>
          <button 
            className="p-2 rounded-full hover:bg-[var(--bg-hover)]" 
            onClick={() => setIsThemeMenuOpen(p => !p)} 
            aria-label="Toggle theme"
            aria-haspopup="true"
            aria-expanded={isThemeMenuOpen}
            aria-controls="theme-menu"
          >
            <PaletteIcon className="w-6 h-6" />
          </button>
          {isThemeMenuOpen && (
            <div id="theme-menu" role="menu" className="absolute right-0 top-full mt-2 w-56 bg-[var(--bg-secondary)] rounded-md shadow-lg border border-[var(--border-color)] z-30 p-2">
                <div className="mb-2">
                  <p className="px-2 py-1 text-xs font-semibold text-[var(--text-secondary)]">Temas claros</p>
                  {lightThemes.map(theme => (
                     <button role="menuitem" key={theme.id} onClick={() => { onThemeChange(theme.id); setIsThemeMenuOpen(false); }} className="w-full flex items-center text-left px-2 py-1.5 text-sm rounded hover:bg-[var(--bg-hover)] text-[var(--text-primary)]">
                        <div className="w-4 h-4 rounded-full mr-3 border border-[var(--border-color)]" style={{backgroundColor: theme.colors.preview}}></div>
                        <span className="flex-1">{theme.name}</span>
                        {activeThemeId === theme.id && <CheckIcon className="w-5 h-5 text-[var(--accent-color)]"/>}
                     </button>
                  ))}
                </div>
                <div>
                  <p className="px-2 py-1 text-xs font-semibold text-[var(--text-secondary)]">Temas oscuros</p>
                  {darkThemes.map(theme => (
                     <button role="menuitem" key={theme.id} onClick={() => { onThemeChange(theme.id); setIsThemeMenuOpen(false); }} className="w-full flex items-center text-left px-2 py-1.5 text-sm rounded hover:bg-[var(--bg-hover)] text-[var(--text-primary)]">
                        <div className="w-4 h-4 rounded-full mr-3 border border-[var(--border-color)]" style={{backgroundColor: theme.colors.preview}}></div>
                        <span className="flex-1">{theme.name}</span>
                        {activeThemeId === theme.id && <CheckIcon className="w-5 h-5 text-[var(--accent-color)]"/>}
                     </button>
                  ))}
                </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;