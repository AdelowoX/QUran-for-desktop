import React from 'react';
import { Bookmark, Surah } from '../types';
import { Book, Bookmark as BookmarkIcon, Search, Settings, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  surahs: Surah[];
  currentSurah: number;
  onSurahSelect: (surah: number) => void;
  bookmarks: Bookmark[];
  onBookmarkSelect: (surah: number, ayah: number) => void;
  onSearchClick: () => void;
  onSettingsClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  surahs,
  currentSurah,
  onSurahSelect,
  bookmarks,
  onBookmarkSelect,
  onSearchClick,
  onSettingsClick
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-80 h-full bg-inherit border-r border-current/10 shadow-2xl flex flex-col">
        <div className="p-6 flex items-center justify-between border-b border-current/10">
          <h2 className="font-sans font-semibold uppercase tracking-widest text-sm">Navigation</h2>
          <button onClick={onClose} className="p-2 hover:bg-current/5 rounded-full">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          {/* Surahs */}
          <section>
            <div className="flex items-center space-x-2 px-2 mb-4 opacity-50">
              <Book size={14} />
              <span className="text-xs font-bold uppercase tracking-tighter">Surahs</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {surahs.map((s) => (
                <button
                  key={s.number}
                  onClick={() => onSurahSelect(s.number)}
                  className={`text-left px-3 py-3 rounded-xl text-sm transition-all flex items-center justify-between group ${
                    currentSurah === s.number ? 'bg-current/10 font-bold' : 'hover:bg-current/5'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs opacity-50 font-mono">{s.number}</span>
                    <span className="font-sans">{s.englishName}</span>
                    <span className="text-[10px] opacity-40 italic">{s.englishNameTranslation}</span>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="font-arabic text-lg">{s.name}</span>
                    <span className="text-[10px] opacity-40 uppercase tracking-tighter">{s.revelationType}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Bookmarks */}
          <section>
            <div className="flex items-center space-x-2 px-2 mb-4 opacity-50">
              <BookmarkIcon size={14} />
              <span className="text-xs font-bold uppercase tracking-tighter">Bookmarks</span>
            </div>
            <div className="space-y-2">
              {bookmarks.length === 0 ? (
                <p className="px-2 text-xs opacity-40 italic">No bookmarks yet.</p>
              ) : (
                bookmarks.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => onBookmarkSelect(b.surah, b.ayah)}
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-current/5 flex justify-between items-center"
                  >
                    <span>Surah {b.surah}:{b.ayah}</span>
                    <span className="text-[10px] opacity-40">{new Date(b.created_at).toLocaleDateString()}</span>
                  </button>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="p-4 border-t border-current/10 grid grid-cols-2 gap-2">
          <button 
            onClick={onSearchClick}
            className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-current/5 hover:bg-current/10 text-sm"
          >
            <Search size={16} />
            <span>Search</span>
          </button>
          <button 
            onClick={onSettingsClick}
            className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-current/5 hover:bg-current/10 text-sm"
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
