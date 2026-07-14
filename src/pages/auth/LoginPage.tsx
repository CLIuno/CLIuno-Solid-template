import { createSignal, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { CircleAlert, Eye, EyeOff, LoaderCircle, Rocket } from 'lucide-solid'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
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
    <div class="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <Card class="w-full max-w-sm">
        <CardHeader class="text-center">
          {/* Logo */}
          <div class="mb-2 flex items-center justify-center gap-2">
            <Rocket class="size-6" />
            <span class="text-xl font-semibold tracking-tight">CLIuno</span>
          </div>
          <CardTitle class="text-xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Error Alert */}
          <Show when={auth.error()}>
            <Alert variant="destructive" class="mb-4">
              <CircleAlert class="size-4" />
              <AlertDescription>{auth.error()}</AlertDescription>
            </Alert>
          </Show>

          <form onSubmit={handleLogin} class="space-y-4">
            {/* Email/Username */}
            <div class="space-y-2">
              <Label for="login-username">Email or Username</Label>
              <Input
                id="login-username"
                value={usernameOrEmail()}
                onInput={(e) => setUsernameOrEmail(e.currentTarget.value)}
                type="text"
                placeholder="Enter your email or username"
                required
              />
            </div>

            {/* Password */}
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <Label for="login-password">Password</Label>
                <A
                  href="/forgot-password"
                  class="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Forgot password?
                </A>
              </div>
              <div class="relative">
                <Input
                  id="login-password"
                  value={password()}
                  onInput={(e) => setPassword(e.currentTarget.value)}
                  type={showPassword() ? 'text' : 'password'}
                  placeholder="Enter your password"
                  class="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword())}
                  class="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword() ? 'Hide password' : 'Show password'}
                >
                  <Show when={showPassword()} fallback={<Eye class="size-4" />}>
                    <EyeOff class="size-4" />
                  </Show>
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" class="w-full" disabled={auth.loading()}>
              <Show when={auth.loading()}>
                <LoaderCircle class="size-4 animate-spin" />
              </Show>
              {auth.loading() ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div class="my-6 flex items-center gap-3">
            <Separator class="flex-1" />
            <span class="text-xs text-muted-foreground">Don't have an account?</span>
            <Separator class="flex-1" />
          </div>

          {/* Register Link */}
          <A href="/register" class={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
            Create Account
          </A>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
