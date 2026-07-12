import { createSignal, For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import Icon from './Icon'
import { useTheme } from '@/utils/theme'

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()
  return (
    <label class="tw:toggle tw:text-base-content">
      <input
        type="checkbox"
        checked={isDark()}
        onChange={(e) => toggleTheme(e.currentTarget.checked)}
        value="dark"
        class="theme-controller"
      />
      <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-width="2"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </g>
      </svg>
      <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-width="2"
          fill="none"
          stroke="currentColor"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </g>
      </svg>
    </label>
  )
}

const NavbarComp = () => {
  const [showMenu, setShowMenu] = createSignal(false)
  const isLoggedIn = () => !!localStorage.getItem('token')

  const navButtons = [
    { label: 'Docs', link: 'https://github.com/CLIuno', style: 'secondary' },
    { label: 'Donate', link: 'https://ko-fi.com/ru44y', style: 'accent' },
    { label: 'Star', link: 'https://github.com/CLIuno', style: 'info' },
  ]

  return (
    <header class="tw:bg-base-100 tw:shadow-sm tw:px-4 sm:tw:px-6 tw:py-3">
      <nav class="tw:flex tw:items-center tw:justify-between tw:container tw:mx-auto">
        {/* Logo */}
        <A href="/" class="tw:flex tw:items-center tw:gap-2">
          <Icon icon="mdi:rocket-launch-outline" class="tw:w-6 tw:h-6 tw:text-primary" />
          <span class="tw:text-xl tw:font-bold tw:text-primary">CLIuno</span>
        </A>

        {/* Desktop Buttons */}
        <div class="tw:hidden tw:md:flex tw:items-center">
          <ThemeToggle />

          <For each={navButtons}>
            {(btn) => (
              <a
                href={btn.link}
                target="_blank"
                rel="noopener"
                class={`tw:btn tw:btn-sm tw:ml-2 tw:btn-${btn.style}`}
              >
                {btn.label}
              </a>
            )}
          </For>

          <Show
            when={isLoggedIn()}
            fallback={
              <>
                <A href="/login" class="tw:btn tw:btn-sm tw:btn-success tw:ml-2">
                  Login
                </A>
                <A href="/register" class="tw:btn tw:btn-sm tw:btn-outline tw:btn-primary tw:ml-2">
                  Register
                </A>
              </>
            }
          >
            <A href="/todos" class="tw:btn tw:btn-sm tw:btn-primary tw:ml-2">
              <Icon icon="mdi:clipboard-check-outline" class="tw:w-4 tw:h-4" />
              Dashboard
            </A>
          </Show>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setShowMenu(!showMenu())}
          class="tw:p-2 tw:rounded-md hover:tw:bg-base-200 tw:transition-colors tw:md:hidden"
        >
          <Icon
            icon={showMenu() ? 'mdi:close' : 'mdi:menu'}
            class="tw:w-6 tw:h-6 tw:text-base-content"
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        class="tw:overflow-hidden tw:transition-all tw:duration-300 tw:ease-in-out tw:mx-auto tw:mt-1 tw:rounded-lg tw:bg-base-200 tw:shadow-md md:tw:hidden"
        style={{ 'max-height': showMenu() ? '500px' : '0px' }}
      >
        <div class="tw:p-3">
          <ul class="tw:flex tw:flex-col tw:gap-2">
            <For each={navButtons}>
              {(btn) => (
                <li>
                  <a
                    href={btn.link}
                    target="_blank"
                    rel="noopener"
                    class="tw:block tw:px-4 tw:py-2 tw:rounded-md tw:transition-colors hover:tw:bg-base-300"
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
                      class="tw:block tw:px-4 tw:py-2 tw:bg-success tw:text-white tw:rounded-md"
                    >
                      Login
                    </A>
                  </li>
                  <li>
                    <A
                      href="/register"
                      class="tw:block tw:px-4 tw:py-2 tw:bg-primary/10 tw:text-primary tw:rounded-md"
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
                  class="tw:block tw:px-4 tw:py-2 tw:bg-primary tw:text-white tw:rounded-md"
                >
                  Dashboard
                </A>
              </li>
            </Show>
            <li>
              <button class="tw:flex tw:items-center tw:gap-2 tw:w-full tw:text-left tw:px-4 tw:py-2 tw:rounded-md hover:tw:bg-base-300">
                <ThemeToggle />
                Toggle Theme
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default NavbarComp
