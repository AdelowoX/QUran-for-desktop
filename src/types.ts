export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

export interface Ayah {
  id: number;
  surah: number;
  ayah: number;
  text_arabic: string;
  text_english_sahih: string;
  text_english_pickthall: string;
  text_english_yusufali: string;
}

export interface Bookmark {
  id: number;
  surah: number;
  ayah: number;
  created_at: string;
}

export type TranslationType = 'sahih' | 'pickthall' | 'yusufali';
export type ViewMode = 'arabic' | 'translation' | 'side-by-side' | 'word-by-word';
export type MushafLayout = 'madinah' | 'indopak' | 'uthmani' | 'digital';
export type Theme = 'light' | 'dark' | 'sepia';

export interface AppSettings {
  translation: TranslationType;
  viewMode: ViewMode;
  mushafLayout: MushafLayout;
  theme: Theme;
  fontSize: number;
  lineSpacing: number;
}
