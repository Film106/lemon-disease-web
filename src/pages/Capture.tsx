import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CameraCapture } from '../components/CameraCapture';
import { useUIStore } from '../store/ui';
import { IconButton } from '../components/ui/IconButton';
import { Container } from '../components/ui/Container';

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

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="pt-4 pb-2 border-b border-gray-100">
        <Container className="flex items-center gap-3">
          <IconButton label={t('capture.cancel_button')} variant="ghost" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </IconButton>
          <h1 className="font-bold text-gray-900 text-lg flex-1">{t('capture.title')}</h1>
        </Container>
      </header>

      <main className="flex-1 py-6">
        <Container>
          {isOffline ? (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-warning" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                </svg>
              </div>
              <p className="font-bold text-gray-800 text-lg max-w-sm">{t('capture.offline_message')}</p>
            </div>
          ) : (
            /* On lg+: two-column — camera left, instructions right */
            <div className="flex flex-col lg:flex-row lg:gap-10 lg:items-start gap-6">

              {/* Camera panel */}
              <div className="lg:flex-1 space-y-4">
                <p className="text-center text-sm text-gray-500">{t('capture.guide_text')}</p>
                <CameraCapture onCapture={handleCapture} />
              </div>

              {/* Instructions panel — visible alongside camera on desktop */}
              <div className="lg:w-72 xl:w-80 space-y-6">
                {/* Tip card */}
                <div className="flex items-start gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  <p className="text-sm text-gray-600 leading-relaxed">{t('capture.tip')}</p>
                </div>

                {/* Steps guide — shown on lg+ only */}
                <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                  <p className="font-semibold text-gray-800 text-sm">{t('home.how_it_works')}</p>
                  {[
                    t('home.step1_desc'),
                    t('home.step2_desc'),
                    t('home.step3_desc'),
                  ].map((desc, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
