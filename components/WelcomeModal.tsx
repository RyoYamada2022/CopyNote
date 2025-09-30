

import React, { useEffect, useRef } from 'react';
import { LogoIcon, CheckCircleIcon } from './Icons';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      closeButtonRef.current?.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
          // Since there is only one focusable element, we trap the focus there
          event.preventDefault();
        }
      };
      
      const modalNode = modalRef.current;
      modalNode?.addEventListener('keydown', handleKeyDown);
      return () => {
        modalNode?.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div
        ref={modalRef}
        className="bg-[var(--bg-secondary)] rounded-lg shadow-xl w-full max-w-lg text-[var(--text-primary)] border border-[var(--border-color)] animate-scale-in"
      >
        <div className="p-6 text-center">
          <LogoIcon className="w-16 h-16 mx-auto text-[var(--accent-color)] mb-4" />
          <h2 id="welcome-title" className="text-2xl font-semibold mb-2">¡Bienvenido a CopyNote 1.0!</h2>
          <p className="text-md text-[var(--text-secondary)] mb-6">
            Tu nuevo espacio para capturar, organizar y compartir ideas.
          </p>
          
          <div className="text-left space-y-3 mb-8 text-sm text-[var(--text-secondary)]">
              <div className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Crea notas con <strong>texto</strong>, <strong>imágenes</strong> y <strong>listas de tareas</strong> interactivas.</span>
              </div>
              <div className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Organiza todo en <strong>carpetas y categorías</strong> personalizables con colores.</span>
              </div>
              <div className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Cambia de apariencia con múltiples <strong>temas claros y oscuros</strong> para adaptarse a tu estilo.</span>
              </div>
              <div className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Encuentra cualquier nota al instante con la <strong>búsqueda rápida</strong> (puedes usar <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Ctrl+K</kbd>).</span>
              </div>
               <div className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Acelera tu flujo de trabajo con <strong>atajos de teclado</strong> como <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Ctrl+S</kbd> para guardar y <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Ctrl+B</kbd> para una nueva nota.</span>
              </div>
          </div>

        </div>
        <div className="px-6 py-4 bg-[var(--bg-tertiary)] flex justify-end rounded-b-lg">
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-white rounded-lg bg-[var(--accent-color)] hover:opacity-90 transition-opacity"
          >
            ¡Empezar a Crear!
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;