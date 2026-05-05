import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CameraCapture } from '../components/CameraCapture';
import { useUIStore } from '../store/ui';
import { IconButton } from '../components/ui/IconButton';

export default function Capture() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setCurrentImage, setCurrentResult } = useUIStore();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCapture = (file: File) => {
    setCurrentImage(file);
    setCurrentResult(null);
    navigate('/result');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="flex items-center gap-3 px-4 pt-safe pt-4 pb-2">
        <IconButton label={t('capture.cancel_button')} variant="ghost" onClick={handleCancel}>
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </IconButton>
        <h1 className="font-bold text-gray-900 text-lg flex-1">{t('capture.title')}</h1>
      </header>

      <main className="flex-1 px-4 pb-8 pt-2 space-y-4">
        {isOffline ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center px-4">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-warning" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
              </svg>
            </div>
            <p className="font-bold text-gray-800 text-lg">{t('capture.offline_message')}</p>
          </div>
        ) : (
          <>
            <p className="text-center text-sm text-gray-500">{t('capture.guide_text')}</p>
            <CameraCapture onCapture={handleCapture} />
            <div className="flex items-start gap-2 px-1">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <p className="text-xs text-gray-400">{t('capture.tip')}</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
