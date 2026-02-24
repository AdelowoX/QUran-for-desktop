import React, { useState, useEffect, useCallback } from 'react';
import { Ayah, Bookmark, AppSettings, Theme, Surah } from './types';
import { Reader } from './components/Reader';
import { Sidebar } from './components/Sidebar';
import { SearchOverlay } from './components/SearchOverlay';
import { SettingsOverlay } from './components/SettingsOverlay';
import { Menu, Keyboard } from 'lucide-react';

const DEFAULT_SETTINGS: AppSettings = {
  translation: 'sahih',
  viewMode: 'side-by-side',
  mushafLayout: 'madinah',
  theme: 'light',
  fontSize: 24,
  lineSpacing: 2,
};

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('quran_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [currentSurah, setCurrentSurah] = useState(1);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetch('/api/surahs').then(res => res.json()).then(setSurahs);
    fetchBookmarks();
  }, []);

  // Fetch ayahs when surah changes
  useEffect(() => {
    fetch(`/api/quran?surah=${currentSurah}`)
      .then(res => res.json())
      .then(setAyahs);
  }, [currentSurah]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('quran_settings', JSON.stringify(settings));
    document.body.className = `theme-${settings.theme}`;
  }, [settings]);

  const fetchBookmarks = async () => {
    const res = await fetch('/api/bookmarks');
    const data = await res.json();
    setBookmarks(data);
  };

  const toggleBookmark = async (ayah: Ayah) => {
    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ surah: ayah.surah, ayah: ayah.ayah }),
    });
    fetchBookmarks();
  };

  const handleSurahSelect = (s: number) => {
    setCurrentSurah(s);
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  const handleBookmarkSelect = (s: number, a: number) => {
    setCurrentSurah(s);
    setIsSidebarOpen(false);
    // In a real app, we'd scroll to the specific ayah
    window.scrollTo(0, 0);
  };

  const handleResultClick = (s: number, a: number) => {
    setCurrentSurah(s);
    setIsSearchOpen(false);
    window.scrollTo(0, 0);
  };

  // Keyboard Navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default for handled shortcuts
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'f') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 't') {
        e.preventDefault();
        setIsSettingsOpen(prev => !prev);
      }
      if (e.key === 'm') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
    }

    if (e.key === 'Escape') {
      setIsSidebarOpen(false);
      setIsSearchOpen(false);
      setIsSettingsOpen(false);
      setShowShortcuts(false);
    }

    if (e.key === '?') {
      setShowShortcuts(prev => !prev);
    }

    // Arrow keys for page navigation
    if (e.key === 'ArrowRight') {
      if (currentSurah > 1) handleSurahSelect(currentSurah - 1);
    }
    if (e.key === 'ArrowLeft') {
      if (currentSurah < 114) handleSurahSelect(currentSurah + 1);
    }

    // Smooth scroll with arrows
    if (e.key === 'ArrowDown') {
      window.scrollBy({ top: 100, behavior: 'smooth' });
    }
    if (e.key === 'ArrowUp') {
      window.scrollBy({ top: -100, behavior: 'smooth' });
    }
  }, [currentSurah]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (surahs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 opacity-50">
        <div className="w-12 h-12 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest">Initializing Offline Mushaf...</p>
        <p className="text-[10px] opacity-60">This may take a minute on first run.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans selection:bg-current selection:text-inherit">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between pointer-events-none">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-3 rounded-full bg-inherit border border-current/10 shadow-lg pointer-events-auto hover:scale-110 transition-transform"
        >
          <Menu size={20} />
        </button>

        <div className="text-center pointer-events-auto">
          <h1 className="text-xs font-bold uppercase tracking-[0.4em] opacity-40 mb-1">Al-Mushaf</h1>
          <p className="text-sm font-medium">
            {surahs.find(s => s.number === currentSurah)?.englishName || `Surah ${currentSurah}`}
          </p>
        </div>

        <button 
          onClick={() => setShowShortcuts(true)}
          className="p-3 rounded-full bg-inherit border border-current/10 shadow-lg pointer-events-auto hover:scale-110 transition-transform"
        >
          <Keyboard size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32">
        <Reader 
          ayahs={ayahs} 
          settings={settings} 
          onAyahClick={toggleBookmark}
        />
      </main>

      {/* Overlays */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        surahs={surahs}
        currentSurah={currentSurah}
        onSurahSelect={handleSurahSelect}
        bookmarks={bookmarks}
        onBookmarkSelect={handleBookmarkSelect}
        onSearchClick={() => { setIsSidebarOpen(false); setIsSearchOpen(true); }}
        onSettingsClick={() => { setIsSidebarOpen(false); setIsSettingsOpen(true); }}
      />

      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onResultClick={handleResultClick}
      />

      <SettingsOverlay 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdate={(s) => setSettings(prev => ({ ...prev, ...s }))}
      />

      {/* Keyboard Shortcuts Help */}
      {showShortcuts && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowShortcuts(false)} />
          <div className="relative bg-inherit border border-current/10 p-8 rounded-3xl shadow-2xl max-w-sm w-full space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-center">Keyboard Shortcuts</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><kbd className="bg-current/10 px-2 py-1 rounded">Ctrl + F</kbd> <span>Search</span></div>
              <div className="flex justify-between"><kbd className="bg-current/10 px-2 py-1 rounded">Ctrl + T</kbd> <span>Settings</span></div>
              <div className="flex justify-between"><kbd className="bg-current/10 px-2 py-1 rounded">Ctrl + M</kbd> <span>Menu</span></div>
              <div className="flex justify-between"><kbd className="bg-current/10 px-2 py-1 rounded">← / →</kbd> <span>Next / Prev Surah</span></div>
              <div className="flex justify-between"><kbd className="bg-current/10 px-2 py-1 rounded">↑ / ↓</kbd> <span>Smooth Scroll</span></div>
              <div className="flex justify-between"><kbd className="bg-current/10 px-2 py-1 rounded">?</kbd> <span>Help</span></div>
              <div className="flex justify-between"><kbd className="bg-current/10 px-2 py-1 rounded">Esc</kbd> <span>Close All</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Status */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 flex justify-center pointer-events-none">
        <div className="px-4 py-2 rounded-full bg-inherit border border-current/5 text-[10px] uppercase tracking-widest opacity-30 shadow-sm">
          Offline Mode • {settings.theme} • {settings.viewMode.replace(/-/g, ' ')}
        </div>
      </footer>
    </div>
  );
}
