import React, { useState, useEffect } from 'react';
import { Ayah } from '../types';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onResultClick: (surah: number, ayah: number) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onResultClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-inherit border border-current/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        <div className="p-4 flex items-center space-x-4 border-b border-current/10">
          <Search size={20} className="opacity-40" />
          <input
            autoFocus
            type="text"
            placeholder="Search by word, surah, or translation..."
            className="flex-1 bg-transparent border-none outline-none text-lg font-sans"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-2 hover:bg-current/5 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="p-8 text-center opacity-40 animate-pulse">Searching...</div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onResultClick(r.surah, r.ayah)}
                  className="w-full text-left p-4 rounded-xl hover:bg-current/5 transition-colors group flex items-start space-x-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest opacity-40">Surah {r.surah}:{r.ayah}</span>
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="font-arabic text-xl text-right mb-2" dir="rtl">{r.text_arabic}</p>
                    <p className="text-sm opacity-60 line-clamp-2">{r.text_english_sahih}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="p-12 text-center opacity-40">No results found for "{query}"</div>
          ) : (
            <div className="p-12 text-center opacity-40">Type to start searching...</div>
          )}
        </div>
      </div>
    </div>
  );
};
