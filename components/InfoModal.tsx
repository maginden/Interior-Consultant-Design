import React from 'react';
import { VeravoxLogo } from '../constants';
import { useLocalization } from '../hooks/useLocalization';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Feature {
    icon: string;
    title: string;
    description: string;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLocalization();
  if (!isOpen) return null;
  
  const instructions: string[] = t('info.instructions');
  const features: Feature[] = t('info.features');

  const FeatureItem: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
    <li className="flex items-start">
      <div className="flex-shrink-0">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="ml-4">
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
    </li>
  );
  
  const InstructionItem: React.FC<{ step: number; text: string }> = ({ step, text }) => (
    <li className="flex items-start">
        <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-500 text-white font-bold text-sm">
            {step}
        </div>
        <div className="ml-4">
            <p className="text-sm text-gray-600">{text}</p>
        </div>
    </li>
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 transform transition-all animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
            <VeravoxLogo className="h-10" />
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">{t('info.title')}</h2>
            <p className="mt-2 text-center text-gray-600">
                {t('info.subtitle')}
            </p>
        </div>
        
         <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800">{t('info.howToUseTitle')}</h3>
            <ol className="mt-4 space-y-3">
                {instructions.map((text, index) => (
                    <InstructionItem key={index} step={index + 1} text={text} />
                ))}
            </ol>
        </div>

        <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800">{t('info.featuresTitle')}</h3>
            <ul className="mt-4 space-y-4">
                {features.map(feature => (
                     <FeatureItem 
                        key={feature.title}
                        icon={feature.icon} 
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </ul>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: t('info.credit') }} />
            <p className="text-sm text-gray-500 mt-1">
                {t('info.contactPrefix')} <a href="mailto:veravoxdev@gmail.com" className="font-medium text-indigo-600 hover:underline">veravoxdev@gmail.com</a>
            </p>
        </div>
      </div>
    </div>
  );
};