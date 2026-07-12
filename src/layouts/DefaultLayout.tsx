import { Show } from 'solid-js'
import type { ParentComponent } from 'solid-js'
import { A } from '@solidjs/router'
import Icon from '@/components/Icon'
import { useAuth } from '@/stores/auth'
import { useTheme } from '@/utils/theme'

const DefaultLayout: ParentComponent = (props) => {
  const auth = useAuth()
  const { isDark, toggleTheme } = useTheme()

  return (
    <div class="tw:min-h-screen tw:flex tw:flex-col tw:bg-base-200">
      {/* App Navbar */}
      <header class="tw:bg-base-100 tw:shadow-sm tw:sticky tw:top-0 tw:z-50">
        <nav class="tw:container tw:mx-auto tw:flex tw:items-center tw:justify-between tw:px-4 tw:py-3">
          {/* Logo */}
          <A href="/todos" class="tw:flex tw:items-center tw:gap-2">
            <Icon icon="mdi:rocket-launch-outline" class="tw:w-6 tw:h-6 tw:text-primary" />
            <span class="tw:text-xl tw:font-bold tw:text-primary">CLIuno</span>
          </A>

          {/* Nav Links */}
          <div class="tw:flex tw:items-center tw:gap-1">
            <A href="/todos" class="tw:btn tw:btn-ghost tw:btn-sm" activeClass="tw:btn-active">
              <Icon icon="mdi:clipboard-check-outline" class="tw:w-5 tw:h-5" />
              <span class="tw:hidden sm:tw:inline">Todos</span>
            </A>
            <A href="/posts" class="tw:btn tw:btn-ghost tw:btn-sm" activeClass="tw:btn-active">
              <Icon icon="mdi:post-outline" class="tw:w-5 tw:h-5" />
              <span class="tw:hidden sm:tw:inline">Posts</span>
            </A>
            <A href="/users" class="tw:btn tw:btn-ghost tw:btn-sm" activeClass="tw:btn-active">
              <Icon icon="mdi:account-group-outline" class="tw:w-5 tw:h-5" />
              <span class="tw:hidden sm:tw:inline">Users</span>
            </A>

            {/* Theme Toggle */}
            <label class="tw:toggle tw:text-base-content tw:ml-1">
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

            {/* User Menu */}
            <div class="tw:dropdown tw:dropdown-end">
              <button class="tw:btn tw:btn-ghost tw:btn-sm">
                <div class="tw:avatar tw:placeholder">
                  <div class="tw:bg-primary tw:text-primary-content tw:w-7 tw:h-7 tw:rounded-full">
                    <span class="tw:text-xs">
                      {auth.user()?.first_name?.[0] || '?'}
                      {auth.user()?.last_name?.[0] || ''}
                    </span>
                  </div>
                </div>
                <span class="tw:hidden sm:tw:inline tw:ml-1">{auth.user()?.username}</span>
                <Icon icon="mdi:chevron-down" class="tw:w-4 tw:h-4" />
              </button>
              <ul class="tw:dropdown-content tw:menu tw:p-2 tw:shadow-lg tw:bg-base-100 tw:rounded-box tw:w-52 tw:z-10">
                <li>
                  <Show when={auth.user()}>
                    <A href={`/users/${auth.user()!.id}`}>
                      <Icon icon="mdi:account" class="tw:w-4 tw:h-4" /> My Profile
                    </A>
                  </Show>
                </li>
                <li>
                  <button onClick={() => auth.logout()} class="tw:text-error">
                    <Icon icon="mdi:logout" class="tw:w-4 tw:h-4" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main class="tw:flex-1">{props.children}</main>

      {/* Footer */}
      <footer class="tw:py-4 tw:text-center tw:text-sm tw:text-base-content/50">
        &copy; {new Date().getFullYear()} CLIuno — Built with SolidJS
      </footer>
    </div>
  )
}

export default DefaultLayout
