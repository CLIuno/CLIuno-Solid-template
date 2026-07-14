import { createSignal, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { CircleAlert, CircleCheck, LoaderCircle, Rocket } from 'lucide-solid'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    <div class="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <Card class="w-full max-w-sm">
        <CardHeader class="text-center">
          {/* Logo */}
          <div class="mb-2 flex items-center justify-center gap-2">
            <Rocket class="size-6" />
            <span class="text-xl font-semibold tracking-tight">CLIuno</span>
          </div>
          <CardTitle class="text-xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a reset link</CardDescription>
        </CardHeader>

        <CardContent>
          <Show when={success()}>
            <Alert class="mb-4">
              <CircleCheck class="size-4" />
              <AlertDescription>Reset link sent! Check your email.</AlertDescription>
            </Alert>
          </Show>

          <Show when={error()}>
            <Alert variant="destructive" class="mb-4">
              <CircleAlert class="size-4" />
              <AlertDescription>{error()}</AlertDescription>
            </Alert>
          </Show>

          <Show when={!success()}>
            <form onSubmit={handleSubmit} class="space-y-4">
              <div class="space-y-2">
                <Label for="forgot-email">Email Address</Label>
                <Input
                  id="forgot-email"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <Button type="submit" class="w-full" disabled={loading()}>
                <Show when={loading()}>
                  <LoaderCircle class="size-4 animate-spin" />
                </Show>
                {loading() ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </Show>

          <div class="mt-4 text-center">
            <A
              href="/login"
              class="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Back to Sign In
            </A>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPasswordPage
