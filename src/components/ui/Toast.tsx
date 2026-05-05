import React, { useEffect, useState } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, variant = 'success', duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // wait for fade-out
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const variantClasses: Record<ToastVariant, string> = {
    success: 'bg-primary text-white',
    error: 'bg-danger text-white',
    info: 'bg-gray-800 text-white',
  };

  const icons: Record<ToastVariant, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg max-w-sm',
        'transition-all duration-300',
        variantClasses[variant],
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
      ].join(' ')}
    >
      <span className="font-bold text-lg">{icons[variant]}</span>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

// Toast container + manager
interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            variant={toast.variant}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
