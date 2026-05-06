import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getAllRecords } from '../history/db';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { LanguageToggle } from '../components/LanguageToggle';

function LeafIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36" fill="none">
      <circle cx="40" cy="40" r="40" fill="#2D5A27" />
      <path
        d="M40 12 C58 22, 65 38, 62 56 C59 68, 48 73, 40 73 C32 73, 21 68, 18 56 C15 38, 22 22, 40 12Z"
        fill="#3D7A35"
      />
      <line x1="40" y1="20" x2="40" y2="68" stroke="#2D5A27" strokeWidth="2" />
      <line x1="40" y1="35" x2="54" y2="44" stroke="#2D5A27" strokeWidth="1.5" />
      <line x1="40" y1="48" x2="54" y2="57" stroke="#2D5A27" strokeWidth="1.5" />
      <line x1="40" y1="35" x2="26" y2="44" stroke="#2D5A27" strokeWidth="1.5" />
      <line x1="40" y1="48" x2="26" y2="57" stroke="#2D5A27" strokeWidth="1.5" />
    </svg>
  );
}

function StepCard({ icon, title, desc, step }: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  step: number;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-3 p-4 sm:p-6">
      <div className="relative">
        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <span className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
          {step}
        </span>
      </div>
      <div>
        <p className="font-semibold text-gray-900 text-sm sm:text-base">{title}</p>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{desc}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: records } = useQuery({
    queryKey: ['history'],
    queryFn: getAllRecords,
    staleTime: 1000 * 30,
  });

  const hasHistory = (records?.length ?? 0) > 0;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-end px-4 pt-4 pb-2">
        <LanguageToggle />
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-10 gap-8">
        {/* Icon + title */}
        <div className="flex flex-col items-center gap-4 text-center">
          <LeafIcon />
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              {t('home.title')}
            </h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base md:text-lg leading-relaxed max-w-xs sm:max-w-sm">
              {t('home.tagline')}
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md space-y-3">
          <PrimaryButton size="lg" fullWidth onClick={() => navigate('/capture')}>
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            {t('home.diagnose_button')}
          </PrimaryButton>

          <SecondaryButton size="lg" fullWidth disabled={!hasHistory} onClick={() => navigate('/history')}>
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('home.history_button')}
          </SecondaryButton>
        </div>

        {/* How it works */}
        <div className="w-full max-w-sm sm:max-w-lg md:max-w-2xl">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            {t('home.how_it_works')}
          </p>
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <StepCard
              step={1}
              title={t('home.step1_title')}
              desc={t('home.step1_desc')}
              icon={
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              }
            />
            <StepCard
              step={2}
              title={t('home.step2_title')}
              desc={t('home.step2_desc')}
              icon={
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.698-1.382 2.698H4.18c-1.412 0-2.382-1.698-1.382-2.698L4.8 15.3" />
                </svg>
              }
            />
            <StepCard
              step={3}
              title={t('home.step3_title')}
              desc={t('home.step3_desc')}
              icon={
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}
