import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import translations from '../translations';
import { useLanguages } from '../hooks';

interface I18nContextValue {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = 'loginpage-lang';

function getDefaultLanguage(languages?: { code: string }[]): string {
  // 1. If localStorage, use that
  const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (saved && (!languages || languages.find((l) => l.code === saved))) return saved;
  // 2. Browser preference if available in supported
  if (languages) {
    const navLangs = (navigator.languages || [navigator.language]).map((l) => l.split('-')[0]);
    for (const nav of navLangs) {
      const match = languages.find((l) => l.code === nav);
      if (match) return match.code;
    }
  }
  // 3. Fallback to first in list or 'en'
  if (languages && languages.length) return languages[0].code;
  return 'en';
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data } = useLanguages();
  const [language, setLanguageState] = useState<string>('en');

  // Set language initially (browser + storage awareness)
  useEffect(() => {
    if (data?.languages) {
      const initial = getDefaultLanguage(data.languages);
      setLanguageState(initial);
    }
  }, [data?.languages]);

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  const t = useCallback((key: string): string => {
    const dict = translations[language as keyof typeof translations] || translations['en'];
    return dict[key] || translations['en'][key] || key;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
