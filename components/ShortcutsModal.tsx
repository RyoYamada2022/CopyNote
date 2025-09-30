import React, { useEffect, useRef } from 'react';
import { KeyboardIcon } from './Icons';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShortcutItem: React.FC<{ shortcut: string; description: string }> = ({ shortcut, description }) => (
  <div className="flex items-center justify-between py-2.5">
    <p className="text-[var(--text-primary)]">{description}</p>
    <kbd
      className="px-2 py-1.5 text-xs font-semibold border rounded-md"
      style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}
    >
      {shortcut}
    </kbd>
  </div>
);

const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div
        ref={modalRef}
        className="bg-[var(--bg-secondary)] rounded-lg shadow-xl w-full max-w-lg text-[var(--text-primary)] border border-[var(--border-color)] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center border-b border-[var(--border-color)]">
          <KeyboardIcon className="w-12 h-12 mx-auto text-[var(--accent-color)] mb-3" />
          <h2 id="shortcuts-title" className="text-2xl font-semibold">Atajos y Comandos</h2>
          <p className="text-md text-[var(--text-secondary)] mt-1">
            Acelera tu flujo de trabajo con estos atajos.
          </p>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <h3 className="font-semibold text-lg mb-3 text-[var(--text-primary)]">Atajos de Teclado</h3>
          <div className="divide-y divide-[var(--border-color)]">
            <ShortcutItem shortcut="Ctrl / Cmd + K" description="Abrir búsqueda rápida" />
            <ShortcutItem shortcut="Ctrl / Cmd + B" description="Crear una nota nueva" />
            <ShortcutItem shortcut="Ctrl / Cmd + E" description="Mostrar/Ocultar barra lateral" />
            <ShortcutItem shortcut="Ctrl / Cmd + J" description="Cambiar vista (cuadrícula/lista)" />
            <ShortcutItem shortcut="Ctrl / Cmd + S" description="Exportar todos los datos" />
            <ShortcutItem shortcut="Ctrl / Cmd + O" description="Importar datos desde archivo" />
            <ShortcutItem shortcut="Esc" description="Cerrar ventanas o cancelar selección" />
          </div>

          <h3 className="font-semibold text-lg mt-8 mb-3 text-[var(--text-primary)]">Comandos Especiales</h3>
          <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg">
            <p className="font-mono text-sm bg-[var(--code-bg)] text-[var(--code-color)] p-2 rounded inline-block">
              (Saludo cordial)
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Al copiar una nota, este comando se reemplazará automáticamente por "Buenos días", "Buenas tardes" o "Buenas noches" según la hora del día.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-[var(--bg-tertiary)] flex justify-end rounded-b-lg">
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-white rounded-lg bg-[var(--accent-color)] hover:opacity-90 transition-opacity"
          >
            ¡Entendido!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;