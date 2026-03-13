
import React from 'react';

interface StyleCarouselProps {
  styles: string[];
  selectedStyle: string;
  onSelectStyle: (style: string) => void;
}

export const StyleCarousel: React.FC<StyleCarouselProps> = ({ styles, selectedStyle, onSelectStyle }) => {
  return (
    <div className="flex space-x-3 overflow-x-auto pb-4 -mx-4 px-4">
      {styles.map((style) => (
        <button
          key={style}
          onClick={() => onSelectStyle(style)}
          className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            selectedStyle === style
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {style}
        </button>
      ))}
    </div>
  );
};