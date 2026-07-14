import { Show } from 'solid-js'
import { Moon, Sun } from 'lucide-solid'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/utils/theme'

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <Button variant="ghost" size="icon-sm" onClick={() => toggleTheme()} aria-label="Toggle theme">
      <Show when={isDark()} fallback={<Sun class="size-4" />}>
        <Moon class="size-4" />
      </Show>
    </Button>
  )
}

export default ThemeToggle
