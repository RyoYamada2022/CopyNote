import React from 'react';

interface ToastProps {
  message: string;
  onUndo?: () => void;
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onUndo, onDismiss }) => {
    const handleUndo = () => {
        if (onUndo) {
            onUndo();
        }
        onDismiss();
    };

    return (
        <div 
            className="fixed bottom-4 left-4 bg-[#323639] text-white py-3 px-6 rounded-md shadow-lg flex items-center justify-between animate-slide-in-up z-50"
            role="alert"
            aria-live="assertive"
        >
            <span>{message}</span>
            <div className="flex items-center ml-6">
                {onUndo && (
                    <button 
                        onClick={handleUndo} 
                        className="font-bold text-yellow-400 hover:text-yellow-300 uppercase text-sm tracking-wider"
                    >
                        Deshacer
                    </button>
                )}
                <button 
                    onClick={onDismiss} 
                    className="ml-4 text-gray-400 hover:text-white"
                    aria-label="Dismiss"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Toast;
