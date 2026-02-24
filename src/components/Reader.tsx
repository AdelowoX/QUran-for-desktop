import React, { useEffect, useRef } from 'react';
import { Ayah, AppSettings } from '../types';
import { motion } from 'motion/react';

interface ReaderProps {
  ayahs: Ayah[];
  settings: AppSettings;
  onAyahClick: (ayah: Ayah) => void;
}

export const Reader: React.FC<ReaderProps> = ({ ayahs, settings, onAyahClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const getTranslationText = (ayah: Ayah) => {
    switch (settings.translation) {
      case 'pickthall': return ayah.text_english_pickthall;
      case 'yusufali': return ayah.text_english_yusufali;
      default: return ayah.text_english_sahih;
    }
  };

  const arabicFont = settings.mushafLayout === 'indopak' ? 'font-indopak' : 'font-arabic';

  return (
    <div 
      ref={containerRef}
      className="max-w-4xl mx-auto px-6 py-12 space-y-12"
      style={{ fontSize: `${settings.fontSize}px`, lineHeight: settings.lineSpacing }}
    >
      {ayahs.map((ayah) => (
        <motion.div
          key={ayah.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group cursor-pointer"
          onClick={() => onAyahClick(ayah)}
        >
          <div className="flex flex-col space-y-6">
            {/* Arabic Text */}
            {(settings.viewMode === 'arabic' || settings.viewMode === 'side-by-side' || settings.viewMode === 'word-by-word') && (
              <div 
                className={`text-right ${arabicFont} text-4xl leading-loose`}
                dir="rtl"
              >
                {ayah.text_arabic}
                <span className="inline-flex items-center justify-center w-10 h-10 mr-4 text-sm border border-current rounded-full font-sans opacity-50">
                  {ayah.ayah}
                </span>
              </div>
            )}

            {/* Translation Text */}
            {(settings.viewMode === 'translation' || settings.viewMode === 'side-by-side') && (
              <div className="font-translation text-lg opacity-80 italic">
                {getTranslationText(ayah)}
              </div>
            )}

            {/* Word-by-word placeholder logic could go here */}
            {settings.viewMode === 'word-by-word' && (
              <div className="text-sm opacity-60 font-sans">
                [Word-by-word mode active - translation shown below each word in a full implementation]
              </div>
            )}
          </div>
          
          <div className="h-px w-full bg-current opacity-5 mt-8 group-hover:opacity-10 transition-opacity" />
        </motion.div>
      ))}
    </div>
  );
};
