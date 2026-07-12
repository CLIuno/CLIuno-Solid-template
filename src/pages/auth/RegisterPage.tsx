import { createSignal, Show } from 'solid-js'
import { A } from '@solidjs/router'
import Icon from '@/components/Icon'
import { useAuth } from '@/stores/auth'

const RegisterPage = () => {
  const auth = useAuth()
  const [showPassword, setShowPassword] = createSignal(false)
  const [form, setForm] = createSignal({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  })

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const passwordsMatch = () => form().password === form().password_confirmation
  const isFormValid = () =>
    form().first_name &&
    form().last_name &&
    form().username &&
    form().email &&
    form().phone &&
    form().password.length >= 8 &&
    passwordsMatch()

  async function handleRegister(e: Event) {
    e.preventDefault()
    if (!isFormValid()) return
    try {
      await auth.register(form())
    } catch {
      // error handled in store
    }
  }

  return (
    <div class="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-base-200 tw:px-4 tw:py-8">
      <div class="tw:card tw:w-full tw:max-w-lg tw:bg-base-100 tw:shadow-xl">
        <div class="tw:card-body tw:p-8">
          {/* Logo */}
          <div class="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:mb-2">
            <Icon icon="mdi:rocket-launch-outline" class="tw:w-8 tw:h-8 tw:text-primary" />
            <span class="tw:text-2xl tw:font-bold tw:text-primary">CLIuno</span>
          </div>

          <h2 class="tw:text-2xl tw:font-bold tw:text-center tw:mb-1">Create Account</h2>
          <p class="tw:text-center tw:text-base-content/60 tw:mb-6">Join the community</p>

          {/* Error Alert */}
          <Show when={auth.error()}>
            <div class="tw:alert tw:alert-error tw:mb-4">
              <Icon icon="mdi:alert-circle" class="tw:w-5 tw:h-5" />
              <span>{auth.error()}</span>
            </div>
          </Show>

          <form onSubmit={handleRegister} class="tw:space-y-4">
            {/* Name Row */}
            <div class="tw:grid tw:grid-cols-2 tw:gap-4">
              <fieldset class="tw:fieldset">
                <legend class="tw:fieldset-legend">First Name</legend>
                <input
                  value={form().first_name}
                  onInput={(e) => updateField('first_name', e.currentTarget.value)}
                  type="text"
                  placeholder="John"
                  class="tw:input tw:w-full"
                  required
                />
              </fieldset>
              <fieldset class="tw:fieldset">
                <legend class="tw:fieldset-legend">Last Name</legend>
                <input
                  value={form().last_name}
                  onInput={(e) => updateField('last_name', e.currentTarget.value)}
                  type="text"
                  placeholder="Doe"
                  class="tw:input tw:w-full"
                  required
                />
              </fieldset>
            </div>

            {/* Username */}
            <fieldset class="tw:fieldset">
              <legend class="tw:fieldset-legend">Username</legend>
              <div class="tw:input tw:w-full">
                <Icon icon="mdi:at" class="tw:h-[1em] tw:opacity-50" />
                <input
                  value={form().username}
                  onInput={(e) => updateField('username', e.currentTarget.value)}
                  type="text"
                  placeholder="johndoe"
                  class="tw:grow"
                  required
                />
              </div>
            </fieldset>

            {/* Email */}
            <fieldset class="tw:fieldset">
              <legend class="tw:fieldset-legend">Email</legend>
              <div class="tw:input tw:w-full">
                <Icon icon="mdi:email-outline" class="tw:h-[1em] tw:opacity-50" />
                <input
                  value={form().email}
                  onInput={(e) => updateField('email', e.currentTarget.value)}
                  type="email"
                  placeholder="john@example.com"
                  class="tw:grow"
                  required
                />
              </div>
            </fieldset>

            {/* Phone */}
            <fieldset class="tw:fieldset">
              <legend class="tw:fieldset-legend">Phone</legend>
              <div class="tw:input tw:w-full">
                <Icon icon="mdi:phone-outline" class="tw:h-[1em] tw:opacity-50" />
                <input
                  value={form().phone}
                  onInput={(e) => updateField('phone', e.currentTarget.value)}
                  type="tel"
                  placeholder="+966512345678"
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
                  value={form().password}
                  onInput={(e) => updateField('password', e.currentTarget.value)}
                  type={showPassword() ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  class="tw:grow"
                  required
                  minLength={8}
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

            {/* Confirm Password */}
            <fieldset class="tw:fieldset">
              <legend class="tw:fieldset-legend">Confirm Password</legend>
              <div
                class="tw:input tw:w-full"
                classList={{
                  'tw:input-error': !!form().password_confirmation && !passwordsMatch(),
                }}
              >
                <Icon icon="mdi:lock-check-outline" class="tw:h-[1em] tw:opacity-50" />
                <input
                  value={form().password_confirmation}
                  onInput={(e) => updateField('password_confirmation', e.currentTarget.value)}
                  type={showPassword() ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  class="tw:grow"
                  required
                />
              </div>
              <Show when={form().password_confirmation && !passwordsMatch()}>
                <p class="tw:label tw:text-error">Passwords do not match</p>
              </Show>
            </fieldset>

            {/* Submit */}
            <button
              type="submit"
              class="tw:btn tw:btn-primary tw:w-full"
              classList={{ 'tw:loading': auth.loading() }}
              disabled={auth.loading() || !isFormValid()}
            >
              <Show when={!auth.loading()}>
                <Icon icon="mdi:account-plus-outline" class="tw:w-5 tw:h-5" />
              </Show>
              {auth.loading() ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div class="tw:divider tw:text-sm">Already have an account?</div>

          {/* Login Link */}
          <A href="/login" class="tw:btn tw:btn-outline tw:w-full">
            <Icon icon="mdi:login" class="tw:w-5 tw:h-5" />
            Sign In
          </A>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
