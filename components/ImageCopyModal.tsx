import React, { useEffect, useRef } from 'react';
import { CopyIcon } from './Icons';
import type { ImageAttachment } from '../types';

interface ImageCopyModalProps {
  images: (string | ImageAttachment)[];
  onClose: () => void;
  showToast: (message: string) => void;
}

const convertToPngBlob = (blob: Blob): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error('Failed to get canvas context'));
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((pngBlob) => {
        URL.revokeObjectURL(url);
        if (pngBlob) {
          resolve(pngBlob);
        } else {
          reject(new Error('Canvas toBlob failed to create blob.'));
        }
      }, 'image/png', 1);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image load failed'));
    };
    img.src = url;
  });
};


const ImageCopyModal: React.FC<ImageCopyModalProps> = ({ images, onClose, showToast }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const isOpen = true; // Modal is always open when rendered
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
          triggerRef.current?.focus();
        };
      }
    }
  }, []);

  const handleCopyImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      if (navigator.clipboard && typeof navigator.clipboard.write === 'function') {
        const pngBlob = await convertToPngBlob(blob);
        const clipboardItem = new ClipboardItem({ 'image/png': pngBlob });
        await navigator.clipboard.write([clipboardItem]);
        showToast('Imagen copiada al portapapeles.');
      } else {
        throw new Error('Clipboard API not available.');
      }
    } catch (error) {
      console.error('Failed to copy image to clipboard:', error);
      showToast('Error al copiar la imagen.');
    }
  };
  
  const imageSources = images.map(img => typeof img === 'string' ? img : img.src);

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="image-copy-title"
    >
      <div 
        ref={modalRef}
        className="bg-[var(--bg-secondary)] rounded-lg shadow-xl w-full max-w-lg text-[var(--text-primary)] border border-[var(--border-color)] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[var(--border-color)]">
          <h2 id="image-copy-title" className="text-lg font-medium">Asistente de Copiado de Imágenes</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            El texto de tu nota ya ha sido copiado. Haz clic en cada imagen para copiarla individualmente.
          </p>
        </div>

        <div className="p-4 flex-grow overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {imageSources.map((src, index) => (
              <div key={index} className="relative group aspect-square">
                <img 
                  src={src} 
                  alt={`Image ${index + 1}`} 
                  className="w-full h-full object-cover rounded-md"
                />
                <button 
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer rounded-md focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                  onClick={() => handleCopyImage(src)}
                  aria-label={`Copy image ${index + 1}`}
                >
                  <div className="text-center text-white">
                    <CopyIcon className="w-8 h-8 mx-auto" />
                    <span className="text-xs mt-1 block">Copiar</span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-[var(--border-color)] text-right">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-[var(--text-primary)] rounded hover:bg-[var(--bg-hover)]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCopyModal;