import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../store/ui';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useUIStore();

  const toggle = () => {
    const next = language === 'th' ? 'en' : 'th';
    setLanguage(next);
    i18n.changeLanguage(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Switch language to ${language === 'th' ? 'English' : 'Thai'}`}
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-primary/30 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors min-h-[44px]"
    >
      <span className={language === 'th' ? 'text-primary font-bold' : 'text-gray-400'}>TH</span>
      <span className="text-gray-300">|</span>
      <span className={language === 'en' ? 'text-primary font-bold' : 'text-gray-400'}>EN</span>
    </button>
  );
}
