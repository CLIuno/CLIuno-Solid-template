import { createSignal } from 'solid-js'

const THEME_KEY = 'theme'

const getInitialDark = (): boolean => {
  if (globalThis.window === undefined) return false
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'dark' || stored === 'light') return stored === 'dark'
  return globalThis.matchMedia('(prefers-color-scheme: dark)').matches
}

const applyTheme = (dark: boolean) => {
  document.documentElement.classList.toggle('dark', dark)
}

const [isDark, setIsDark] = createSignal(getInitialDark())

if (globalThis.window !== undefined) {
  applyTheme(isDark())
}

function toggleTheme(dark?: boolean) {
  const next = dark ?? !isDark()
  setIsDark(next)
  localStorage.setItem(THEME_KEY, next ? 'dark' : 'light')
  applyTheme(next)
}

export function useTheme() {
  return { isDark, toggleTheme }
}
