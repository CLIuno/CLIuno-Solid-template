import { createSignal, For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { LayoutDashboard, Menu, Rocket, X } from 'lucide-solid'

import ThemeToggle from '@/components/ThemeToggle'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NavbarComp = () => {
  const [showMenu, setShowMenu] = createSignal(false)
  const isLoggedIn = () => !!localStorage.getItem('token')

  const navButtons = [
    { label: 'Docs', link: 'https://github.com/CLIuno' },
    { label: 'Donate', link: 'https://ko-fi.com/ru44y' },
    { label: 'Star', link: 'https://github.com/CLIuno' },
  ]

  return (
    <header class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav class="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Brand */}
        <A href="/" class="flex items-center gap-2">
          <Rocket class="size-5" />
          <span class="text-lg font-semibold tracking-tight">CLIuno</span>
        </A>

        {/* Desktop Buttons */}
        <div class="hidden items-center gap-1 md:flex">
          <ThemeToggle />

          <For each={navButtons}>
            {(btn) => (
              <a
                href={btn.link}
                target="_blank"
                rel="noopener"
                class={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'text-muted-foreground',
                )}
              >
                {btn.label}
              </a>
            )}
          </For>

          <Show
            when={isLoggedIn()}
            fallback={
              <>
                <A href="/login" class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
                  Login
                </A>
                <A href="/register" class={cn(buttonVariants({ size: 'sm' }))}>
                  Register
                </A>
              </>
            }
          >
            <A href="/todos" class={cn(buttonVariants({ size: 'sm' }))}>
              <LayoutDashboard class="size-4" />
              Dashboard
            </A>
          </Show>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div class="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setShowMenu(!showMenu())}
            class={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }))}
            aria-label="Toggle menu"
          >
            <Show when={showMenu()} fallback={<Menu class="size-5" />}>
              <X class="size-5" />
            </Show>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        class="overflow-hidden transition-all duration-300 ease-in-out md:hidden"
        style={{ 'max-height': showMenu() ? '500px' : '0px' }}
      >
        <ul class="flex flex-col gap-1 border-t px-4 py-3">
          <For each={navButtons}>
            {(btn) => (
              <li>
                <a
                  href={btn.link}
                  target="_blank"
                  rel="noopener"
                  class="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {btn.label}
                </a>
              </li>
            )}
          </For>
          <Show
            when={isLoggedIn()}
            fallback={
              <>
                <li>
                  <A
                    href="/login"
                    class="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    Login
                  </A>
                </li>
                <li>
                  <A
                    href="/register"
                    class="block rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
                  >
                    Register
                  </A>
                </li>
              </>
            }
          >
            <li>
              <A
                href="/todos"
                class="block rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
              >
                Dashboard
              </A>
            </li>
          </Show>
        </ul>
      </div>
    </header>
  )
}

export default NavbarComp
