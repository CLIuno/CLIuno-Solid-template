import { createSignal, Show } from 'solid-js'
import { A } from '@solidjs/router'
import Icon from '@/components/Icon'
import api from '@/apis'

const ForgotPasswordPage = () => {
  const [email, setEmail] = createSignal('')
  const [loading, setLoading] = createSignal(false)
  const [success, setSuccess] = createSignal(false)
  const [error, setError] = createSignal('')

  async function handleSubmit(e: Event) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.auth.forgotPassword(email())
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="tw:min-h-screen tw:flex tw:items-center tw:justify-center tw:bg-base-200 tw:px-4">
      <div class="tw:card tw:w-full tw:max-w-md tw:bg-base-100 tw:shadow-xl">
        <div class="tw:card-body tw:p-8">
          <div class="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:mb-2">
            <Icon icon="mdi:rocket-launch-outline" class="tw:w-8 tw:h-8 tw:text-primary" />
            <span class="tw:text-2xl tw:font-bold tw:text-primary">CLIuno</span>
          </div>

          <h2 class="tw:text-2xl tw:font-bold tw:text-center tw:mb-1">Forgot Password</h2>
          <p class="tw:text-center tw:text-base-content/60 tw:mb-6">
            Enter your email to receive a reset link
          </p>

          <Show when={success()}>
            <div class="tw:alert tw:alert-success tw:mb-4">
              <Icon icon="mdi:check-circle" class="tw:w-5 tw:h-5" />
              <span>Reset link sent! Check your email.</span>
            </div>
          </Show>

          <Show when={error()}>
            <div class="tw:alert tw:alert-error tw:mb-4">
              <Icon icon="mdi:alert-circle" class="tw:w-5 tw:h-5" />
              <span>{error()}</span>
            </div>
          </Show>

          <Show when={!success()}>
            <form onSubmit={handleSubmit} class="tw:space-y-4">
              <fieldset class="tw:fieldset">
                <legend class="tw:fieldset-legend">Email Address</legend>
                <div class="tw:input tw:w-full">
                  <Icon icon="mdi:email-outline" class="tw:h-[1em] tw:opacity-50" />
                  <input
                    value={email()}
                    onInput={(e) => setEmail(e.currentTarget.value)}
                    type="email"
                    placeholder="Enter your email"
                    class="tw:grow"
                    required
                  />
                </div>
              </fieldset>

              <button type="submit" class="tw:btn tw:btn-primary tw:w-full" disabled={loading()}>
                {loading() ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </Show>

          <div class="tw:text-center tw:mt-4">
            <A href="/login" class="tw:link tw:link-primary">
              Back to Sign In
            </A>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
