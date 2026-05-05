import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useUIStore } from '../store/ui';
import { diagnose } from '../api/diagnose';
import { saveRecord } from '../history/db';
import { ResultCard } from '../components/ResultCard';
import { LoadingState } from '../components/ui/LoadingState';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { IconButton } from '../components/ui/IconButton';
import { ToastContainer } from '../components/ui/Toast';
import type { ToastVariant } from '../components/ui/Toast';
import type { DiagnoseResponse } from '../api/types';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ResultFooter({
  result,
  saved,
  onSave,
  onRetake,
  onDiagnoseAnother,
  onHome,
}: {
  result: DiagnoseResponse;
  saved: boolean;
  onSave: () => void;
  onRetake: () => void;
  onDiagnoseAnother: () => void;
  onHome: () => void;
}) {
  const { t } = useTranslation();
  const canShare = typeof navigator.share === 'function';

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Lemon Leaf Diagnosis',
        text: result.predicted_class
          ? `Diagnosis: ${result.predicted_class} (${Math.round((result.confidence ?? 0) * 100)}%)`
          : 'Lemon leaf diagnosis result',
      });
    } catch {
      // user cancelled or not supported
    }
  };

  if (result.decision === 'invalid_input') {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-bg/95 backdrop-blur border-t border-gray-100 px-4 pt-3 pb-safe pb-6 flex gap-3">
        <SecondaryButton fullWidth onClick={onRetake}>
          {t('result.retake_button')}
        </SecondaryButton>
        <SecondaryButton fullWidth onClick={onHome}>
          {t('result.back_home')}
        </SecondaryButton>
      </div>
    );
  }

  if (result.decision === 'uncertain') {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-bg/95 backdrop-blur border-t border-gray-100 px-4 pt-3 pb-safe pb-6 flex gap-3">
        <SecondaryButton fullWidth onClick={onRetake}>
          {t('result.retake_button')}
        </SecondaryButton>
        <PrimaryButton fullWidth onClick={onDiagnoseAnother}>
          {t('result.diagnose_another_button')}
        </PrimaryButton>
      </div>
    );
  }

  // Confident
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-bg/95 backdrop-blur border-t border-gray-100 px-4 pt-3 pb-safe pb-6 space-y-2">
      <div className="flex gap-3">
        <PrimaryButton fullWidth onClick={onSave} disabled={saved}>
          {saved ? `✓ ${t('result.save_button')}` : t('result.save_button')}
        </PrimaryButton>
        {canShare && (
          <IconButton label={t('result.share_button')} variant="outline" onClick={handleShare}>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
          </IconButton>
        )}
      </div>
      <SecondaryButton fullWidth onClick={onDiagnoseAnother}>
        {t('result.diagnose_another_button')}
      </SecondaryButton>
    </div>
  );
}

export default function Result() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentImage, currentResult, setCurrentResult } = useUIStore();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [saved, setSaved] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(undefined);

  const addToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const { isPending, error } = useQuery({
    queryKey: ['diagnose', currentImage?.name, currentImage?.lastModified],
    queryFn: async () => {
      if (!currentImage) throw new Error('No image');
      const result = await diagnose(currentImage);
      setCurrentResult(result);
      try {
        const url = await fileToDataUrl(currentImage);
        setThumbnailUrl(url);
      } catch {
        // ignore
      }
      return result;
    },
    enabled: !!currentImage && !currentResult,
    retry: 1,
    staleTime: Infinity,
  });

  const result = currentResult;

  const handleSave = async () => {
    if (!result || saved) return;
    try {
      await saveRecord({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        thumbnailDataUrl: thumbnailUrl ?? '',
        result,
      });
      setSaved(true);
      addToast(t('result.saved_toast'), 'success');
    } catch {
      addToast(t('result.save_error_toast'), 'error');
    }
  };

  const handleRetake = () => navigate('/capture');
  const handleDiagnoseAnother = () => navigate('/capture');
  const handleHome = () => navigate('/');

  if (!currentImage && !currentResult) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 p-6">
        <p className="text-gray-500 text-center">{t('errors.generic')}</p>
        <PrimaryButton onClick={() => navigate('/capture')}>
          {t('capture.title')}
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="flex items-center gap-3 px-4 pt-safe pt-4 pb-2">
        <IconButton label={t('result.back_home')} variant="ghost" onClick={handleHome}>
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </IconButton>
        <h1 className="font-bold text-gray-900 text-lg flex-1">{t('result.title')}</h1>
      </header>

      <main className="flex-1 px-4 pb-40 pt-2 overflow-y-auto">
        {isPending && (
          <LoadingState variant="default" message={t('result.loading')} />
        )}

        {error && !result && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-center space-y-3 mt-4">
            <p className="text-danger font-semibold">{t('errors.generic')}</p>
            <p className="text-sm text-red-600">{(error as Error).message}</p>
            <SecondaryButton onClick={handleRetake}>
              {t('common.retry')}
            </SecondaryButton>
          </div>
        )}

        {result && (
          <ResultCard result={result} thumbnailUrl={thumbnailUrl} />
        )}
      </main>

      {result && (
        <ResultFooter
          result={result}
          saved={saved}
          onSave={handleSave}
          onRetake={handleRetake}
          onDiagnoseAnother={handleDiagnoseAnother}
          onHome={handleHome}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
