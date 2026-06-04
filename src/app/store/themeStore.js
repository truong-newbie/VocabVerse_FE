import { create } from 'zustand'

const THEME_KEY = 'vocabverse.theme'

function getInitialTheme() {
  return localStorage.getItem(THEME_KEY) || 'system'
}

function applyTheme(theme) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const useDark = theme === 'dark' || (theme === 'system' && prefersDark)
  document.documentElement.classList.toggle('dark', useDark)
}

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme)
    applyTheme(theme)
    set({ theme })
  },
  initializeTheme: () => applyTheme(get().theme),
}))
