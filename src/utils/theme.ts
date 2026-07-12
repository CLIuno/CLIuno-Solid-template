import { createSignal } from 'solid-js'

const getInitialTheme = (): boolean => {
  if (globalThis.window === undefined) return false
  return document.documentElement.dataset.theme === 'dark'
}

const [isDark, setIsDark] = createSignal(getInitialTheme())

function toggleTheme(checked: boolean) {
  setIsDark(checked)
  document.documentElement.dataset.theme = checked ? 'dark' : 'light'
}

export function useTheme() {
  return { isDark, toggleTheme }
}
