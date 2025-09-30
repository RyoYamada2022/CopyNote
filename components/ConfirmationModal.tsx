import React, { useEffect, useRef } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmButtonClass = 'bg-red-600 hover:bg-red-700',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        firstElement.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Tab') {
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


  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
    >
      <div
        ref={modalRef}
        className="bg-[var(--bg-secondary)] rounded-lg shadow-xl w-full max-w-sm text-[var(--text-primary)] border border-[var(--border-color)] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 id="confirmation-title" className="text-lg font-semibold mb-2">{title}</h2>
          <div className="text-sm text-[var(--text-secondary)]">{message}</div>
        </div>
        <div className="px-6 py-4 bg-[var(--bg-tertiary)] flex justify-end gap-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded hover:bg-[var(--bg-hover)]"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded transition-colors ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;