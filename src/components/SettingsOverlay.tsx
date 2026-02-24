import React from 'react';
import { AppSettings, TranslationType, ViewMode, MushafLayout, Theme } from '../types';
import { X, Type, Layout, Languages, Palette } from 'lucide-react';

interface SettingsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdate: (settings: Partial<AppSettings>) => void;
}

export const SettingsOverlay: React.FC<SettingsOverlayProps> = ({ isOpen, onClose, settings, onUpdate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-inherit border border-current/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 flex items-center justify-between border-b border-current/10">
          <h2 className="font-sans font-semibold uppercase tracking-widest text-sm">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-current/5 rounded-full">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto max-h-[80vh]">
          {/* Theme */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2 opacity-50">
              <Palette size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Theme</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['light', 'dark', 'sepia'] as Theme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => onUpdate({ theme: t })}
                  className={`py-2 px-4 rounded-xl text-xs capitalize border transition-all ${
                    settings.theme === t ? 'border-current bg-current/10 font-bold' : 'border-current/10 hover:bg-current/5'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          {/* Mushaf Layout */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2 opacity-50">
              <Layout size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Mushaf Layout</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['madinah', 'indopak', 'uthmani', 'digital'] as MushafLayout[]).map((l) => (
                <button
                  key={l}
                  onClick={() => onUpdate({ mushafLayout: l })}
                  className={`py-2 px-4 rounded-xl text-xs capitalize border transition-all ${
                    settings.mushafLayout === l ? 'border-current bg-current/10 font-bold' : 'border-current/10 hover:bg-current/5'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </section>

          {/* View Mode */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2 opacity-50">
              <Layout size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">View Mode</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['arabic', 'translation', 'side-by-side', 'word-by-word'] as ViewMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => onUpdate({ viewMode: m })}
                  className={`py-2 px-4 rounded-xl text-xs capitalize border transition-all ${
                    settings.viewMode === m ? 'border-current bg-current/10 font-bold' : 'border-current/10 hover:bg-current/5'
                  }`}
                >
                  {m.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </section>

          {/* Translation */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2 opacity-50">
              <Languages size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Translation</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {(['sahih', 'pickthall', 'yusufali'] as TranslationType[]).map((tr) => (
                <button
                  key={tr}
                  onClick={() => onUpdate({ translation: tr })}
                  className={`py-2 px-4 rounded-xl text-xs capitalize border text-left transition-all ${
                    settings.translation === tr ? 'border-current bg-current/10 font-bold' : 'border-current/10 hover:bg-current/5'
                  }`}
                >
                  {tr === 'sahih' ? 'Sahih International' : tr === 'pickthall' ? 'Pickthall' : 'Yusuf Ali'}
                </button>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2 opacity-50">
              <Type size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Typography</span>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-50">
                  <span>Font Size</span>
                  <span>{settings.fontSize}px</span>
                </div>
                <input 
                  type="range" min="16" max="48" step="1"
                  value={settings.fontSize}
                  onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
                  className="w-full h-1 bg-current/10 rounded-lg appearance-none cursor-pointer accent-current"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-50">
                  <span>Line Spacing</span>
                  <span>{settings.lineSpacing}</span>
                </div>
                <input 
                  type="range" min="1.2" max="3" step="0.1"
                  value={settings.lineSpacing}
                  onChange={(e) => onUpdate({ lineSpacing: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-current/10 rounded-lg appearance-none cursor-pointer accent-current"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
