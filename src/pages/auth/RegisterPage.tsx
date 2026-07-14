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
    <div class="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground">
      <Card class="w-full max-w-sm">
        <CardHeader class="text-center">
          {/* Logo */}
          <div class="mb-2 flex items-center justify-center gap-2">
            <Rocket class="size-6" />
            <span class="text-xl font-semibold tracking-tight">CLIuno</span>
          </div>
          <CardTitle class="text-xl">Create Account</CardTitle>
          <CardDescription>Join the community</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Error Alert */}
          <Show when={auth.error()}>
            <Alert variant="destructive" class="mb-4">
              <CircleAlert class="size-4" />
              <AlertDescription>{auth.error()}</AlertDescription>
            </Alert>
          </Show>

          <form onSubmit={handleRegister} class="space-y-4">
            {/* Name Row */}
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="register-first-name">First Name</Label>
                <Input
                  id="register-first-name"
                  value={form().first_name}
                  onInput={(e) => updateField('first_name', e.currentTarget.value)}
                  type="text"
                  placeholder="John"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label for="register-last-name">Last Name</Label>
                <Input
                  id="register-last-name"
                  value={form().last_name}
                  onInput={(e) => updateField('last_name', e.currentTarget.value)}
                  type="text"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div class="space-y-2">
              <Label for="register-username">Username</Label>
              <Input
                id="register-username"
                value={form().username}
                onInput={(e) => updateField('username', e.currentTarget.value)}
                type="text"
                placeholder="johndoe"
                required
              />
            </div>

            {/* Email */}
            <div class="space-y-2">
              <Label for="register-email">Email</Label>
              <Input
                id="register-email"
                value={form().email}
                onInput={(e) => updateField('email', e.currentTarget.value)}
                type="email"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div class="space-y-2">
              <Label for="register-phone">Phone</Label>
              <Input
                id="register-phone"
                value={form().phone}
                onInput={(e) => updateField('phone', e.currentTarget.value)}
                type="tel"
                placeholder="+966512345678"
                required
              />
            </div>

            {/* Password */}
            <div class="space-y-2">
              <Label for="register-password">Password</Label>
              <div class="relative">
                <Input
                  id="register-password"
                  value={form().password}
                  onInput={(e) => updateField('password', e.currentTarget.value)}
                  type={showPassword() ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  class="pr-10"
                  required
                  minLength={8}
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

            {/* Confirm Password */}
            <div class="space-y-2">
              <Label for="register-password-confirmation">Confirm Password</Label>
              <Input
                id="register-password-confirmation"
                value={form().password_confirmation}
                onInput={(e) => updateField('password_confirmation', e.currentTarget.value)}
                type={showPassword() ? 'text' : 'password'}
                placeholder="Confirm your password"
                aria-invalid={!!form().password_confirmation && !passwordsMatch()}
                required
              />
              <Show when={form().password_confirmation && !passwordsMatch()}>
                <p class="text-sm text-destructive">Passwords do not match</p>
              </Show>
            </div>

            {/* Submit */}
            <Button type="submit" class="w-full" disabled={auth.loading() || !isFormValid()}>
              <Show when={auth.loading()}>
                <LoaderCircle class="size-4 animate-spin" />
              </Show>
              {auth.loading() ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div class="my-6 flex items-center gap-3">
            <Separator class="flex-1" />
            <span class="text-xs text-muted-foreground">Already have an account?</span>
            <Separator class="flex-1" />
          </div>

          {/* Login Link */}
          <A href="/login" class={cn(buttonVariants({ variant: 'outline' }), 'w-full')}>
            Sign In
          </A>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage
