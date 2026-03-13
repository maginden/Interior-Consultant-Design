import React, { useState, useRef } from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface ImageComparatorProps {
  originalImage: string;
  generatedImage: string;
}

export const ImageComparator: React.FC<ImageComparatorProps> = ({ originalImage, generatedImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLocalization();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };
  
  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto aspect-[4/3] overflow-hidden rounded-lg shadow-xl border">
      <img src={originalImage} alt={t('comparator.originalAlt')} className="absolute inset-0 w-full h-full object-cover" />
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={generatedImage} alt={t('comparator.generatedAlt')} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="absolute inset-y-0" style={{ left: `calc(${sliderPosition}% - 2px)`, zIndex: 10 }}>
        <div className="w-1 h-full bg-white opacity-75"></div>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 bg-white rounded-full shadow-md flex items-center justify-center cursor-ew-resize">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        className="absolute inset-0 w-full h-full cursor-ew-resize opacity-0"
        aria-label={t('comparator.sliderAria')}
      />
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">{t('comparator.original')}</div>
      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded" style={{ opacity: sliderPosition > 50 ? 1 : 0, transition: 'opacity 0.2s' }}>{t('comparator.generated')}</div>
    </div>
  );
};