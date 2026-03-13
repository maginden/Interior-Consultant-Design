
import React, { useState, useRef, useEffect } from 'react';
import { InfoIcon, VeravoxLogo, GlobeIcon } from '../constants';
import { useLocalization } from '../hooks/useLocalization';

interface HeaderProps {
    onInfoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onInfoClick }) => {
  const { language, setLanguage, t } = useLocalization();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const languages: { [key: string]: string } = {
    en: 'English',
    pt: 'Português',
    it: 'Italiano'
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center space-x-3">
            <VeravoxLogo className="h-8 w-auto" />
            <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
                {t('header.title')}
            </h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative">
                <button
                    onClick={() => setIsLangMenuOpen(prev => !prev)}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    aria-label="Change language"
                >
                    <GlobeIcon />
                </button>
                {isLangMenuOpen && (
                    <div ref={langMenuRef} className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-xl z-20 border border-gray-200">
                       <ul className="py-1">
                         {Object.entries(languages).map(([code, name]) => (
                            <li key={code}>
                                <button
                                    onClick={() => {
                                        setLanguage(code as 'en' | 'pt' | 'it');
                                        setIsLangMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between ${language === code ? 'font-semibold text-indigo-600' : ''}`}
                                >
                                    {name}
                                    {language === code && <span className="text-indigo-600">✓</span>}
                                </button>
                            </li>
                         ))}
                       </ul>
                    </div>
                )}
            </div>
            <button
              onClick={onInfoClick}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              aria-label={t('tooltips.aboutAria')}
            >
              <InfoIcon />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};