import React, { createContext, useState, ReactNode, useCallback } from 'react';
import en from '../locales/en.json';
import pt from '../locales/pt.json';
import it from '../locales/it.json';

type Language = 'en' | 'pt' | 'it';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: <T = string>(key: string, replacements?: { [key: string]: string }) => T;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: { [key in Language]: any } = { en, pt, it };

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const getInitialLanguage = (): Language => {
    try {
        const browserLang = navigator.language.split('-')[0] as Language;
        if (['en', 'pt', 'it'].includes(browserLang)) {
            return browserLang;
        }
    } catch (e) {
        // navigator might not be available in some environments (e.g. SSR)
    }
    return 'en';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  const t = useCallback(<T = string>(key: string, replacements?: { [key: string]: string }): T => {
    let value = getNestedValue(translations[language], key);

    if (typeof value !== 'string') {
        // For non-string values like arrays, return them directly
        return value as T;
    }
    
    if (replacements) {
      Object.keys(replacements).forEach(rKey => {
        value = value.replace(`{{${rKey}}}`, replacements[rKey]);
      });
    }

    return value as T;
  }, [language]);


  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};