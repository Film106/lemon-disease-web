import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SecondaryButton } from './SecondaryButton';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
        <h2 id="confirm-dialog-title" className="text-lg font-bold text-gray-900">
          {title}
        </h2>
        <p className="text-gray-600 text-sm">{message}</p>
        <div className="flex gap-3 pt-2">
          <SecondaryButton
            onClick={onCancel}
            fullWidth
          >
            {cancelLabel ?? t('common.cancel')}
          </SecondaryButton>
          <button
            onClick={onConfirm}
            className={[
              'flex-1 inline-flex items-center justify-center rounded-xl font-semibold px-6 py-3 text-base min-h-[44px]',
              'text-white transition-all duration-150 active:scale-95',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              variant === 'danger'
                ? 'bg-danger hover:bg-red-700 focus-visible:ring-danger'
                : 'bg-primary hover:bg-primary-light focus-visible:ring-primary',
            ].join(' ')}
          >
            {confirmLabel ?? t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
