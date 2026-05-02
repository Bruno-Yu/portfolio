import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Lang = 'en' | 'zh';
export type Theme = 'light' | 'dark';

interface UiState {
  lang: Lang;
  theme: Theme;
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('pf-theme', theme);
}

function applyLang(lang: Lang) {
  document.documentElement.setAttribute('data-lang', lang);
  localStorage.setItem('pf-lang', lang);
}

function getInitialLang(): Lang {
  const saved = localStorage.getItem('pf-lang');
  if (saved === 'en' || saved === 'zh') return saved;
  return 'zh';
}

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('pf-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

const initialLang = getInitialLang();
const initialTheme = getInitialTheme();

// Apply on startup
if (typeof document !== 'undefined') {
  applyTheme(initialTheme);
  applyLang(initialLang);
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    lang: initialLang,
    theme: initialTheme,
  } as UiState,
  reducers: {
    setLang(state, action: PayloadAction<Lang>) {
      state.lang = action.payload;
      applyLang(action.payload);
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      applyTheme(action.payload);
    },
    toggleTheme(state) {
      const next: Theme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = next;
      applyTheme(next);
    },
  },
});

export const { setLang, setTheme, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;
