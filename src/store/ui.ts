import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiagnoseResponse } from '../api/types';

interface UIStore {
  language: 'th' | 'en';
  setLanguage: (lang: 'th' | 'en') => void;
  currentImage: File | null;
  setCurrentImage: (img: File | null) => void;
  currentResult: DiagnoseResponse | null;
  setCurrentResult: (result: DiagnoseResponse | null) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      language: 'th',
      setLanguage: (lang) => set({ language: lang }),
      currentImage: null,
      setCurrentImage: (img) => set({ currentImage: img }),
      currentResult: null,
      setCurrentResult: (result) => set({ currentResult: result }),
    }),
    {
      name: 'lemon-ui-store',
      partialize: (state) => ({ language: state.language }),
    }
  )
);
