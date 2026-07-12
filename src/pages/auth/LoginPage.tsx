import { createSignal, Show } from 'solid-js'
import { A } from '@solidjs/router'
import Icon from '@/components/Icon'
import { useAuth } from '@/stores/auth'

const LoginPage = () => {
  const auth = useAuth()
  const [usernameOrEmail, setUsernameOrEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [showPassword, setShowPassword] = createSignal(false)

  async function handleLogin(e: Event) {
    e.preventDefault()
    if (!usernameOrEmail() || !password()) return
    try {
      await auth.login(usernameOrEmail(), password())
    } catch {
      // error handled in store
    }
  }

  return (
    <div class="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-base-200 tw:px-4">
      <div class="tw:card tw:w-full tw:max-w-md tw:bg-base-100 tw:shadow-xl">
        <div class="tw:card-body tw:p-8">
          {/* Logo */}
          <div class="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:mb-2">
            <Icon icon="mdi:rocket-launch-outline" class="tw:w-8 tw:h-8 tw:text-primary" />
            <span class="tw:text-2xl tw:font-bold tw:text-primary">CLIuno</span>
          </div>

          <h2 class="tw:text-2xl tw:font-bold tw:text-center tw:mb-1">Welcome back</h2>
          <p class="tw:text-center tw:text-base-content/60 tw:mb-6">Sign in to your account</p>

          {/* Error Alert */}
          <Show when={auth.error()}>
            <div class="tw:alert tw:alert-error tw:mb-4">
              <Icon icon="mdi:alert-circle" class="tw:w-5 tw:h-5" />
              <span>{auth.error()}</span>
            </div>
          </Show>

          <form onSubmit={handleLogin} class="tw:space-y-4">
            {/* Email/Username */}
            <fieldset class="tw:fieldset">
              <legend class="tw:fieldset-legend">Email or Username</legend>
              <div class="tw:input tw:w-full">
                <Icon icon="mdi:account-outline" class="tw:h-[1em] tw:opacity-50" />
                <input
                  id="login-username"
                  value={usernameOrEmail()}
                  onInput={(e) => setUsernameOrEmail(e.currentTarget.value)}
                  type="text"
                  placeholder="Enter your email or username"
                  class="tw:grow"
                  required
                />
              </div>
            </fieldset>

            {/* Password */}
            <fieldset class="tw:fieldset">
              <legend class="tw:fieldset-legend">Password</legend>
              <div class="tw:input tw:w-full">
                <Icon icon="mdi:lock-outline" class="tw:h-[1em] tw:opacity-50" />
                <input
                  id="login-password"
                  value={password()}
                  onInput={(e) => setPassword(e.currentTarget.value)}
                  type={showPassword() ? 'text' : 'password'}
                  placeholder="Enter your password"
                  class="tw:grow"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword())}
                  class="tw:btn tw:btn-ghost tw:btn-xs tw:btn-circle"
                >
                  <Icon icon={showPassword() ? 'mdi:eye-off' : 'mdi:eye'} class="tw:w-4 tw:h-4" />
                </button>
              </div>
            </fieldset>

            {/* Forgot Password */}
            <div class="tw:flex tw:justify-end">
              <A href="/forgot-password" class="tw:link tw:link-primary tw:text-sm">
                Forgot password?
              </A>
            </div>

            {/* Submit */}
            <button
              type="submit"
              class="tw:btn tw:btn-primary tw:w-full"
              classList={{ 'tw:loading': auth.loading() }}
              disabled={auth.loading()}
            >
              <Show when={!auth.loading()}>
                <Icon icon="mdi:login" class="tw:w-5 tw:h-5" />
              </Show>
              {auth.loading() ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div class="tw:divider tw:text-sm">Don't have an account?</div>

          {/* Register Link */}
          <A href="/register" class="tw:btn tw:btn-outline tw:btn-secondary tw:w-full">
            <Icon icon="mdi:account-plus-outline" class="tw:w-5 tw:h-5" />
            Create Account
          </A>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
