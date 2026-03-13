
import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

export const useLocalization = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LanguageProvider');
  }
  return context;
};