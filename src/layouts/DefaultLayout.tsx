import { Show } from 'solid-js'
import type { ParentComponent } from 'solid-js'
import { A, useNavigate } from '@solidjs/router'
import { ChevronDown, ListTodo, LogOut, Rocket, StickyNote, User, Users } from 'lucide-solid'

import ThemeToggle from '@/components/ThemeToggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useAuth } from '@/stores/auth'

const DefaultLayout: ParentComponent = (props) => {
  const auth = useAuth()
  const navigate = useNavigate()

  const initials = () => {
    const u = auth.user()
    return `${u?.first_name?.[0] || '?'}${u?.last_name?.[0] || ''}`
  }

  return (
    <div class="flex min-h-screen flex-col bg-background text-foreground">
      {/* App Navbar */}
      <header class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <nav class="container mx-auto flex h-14 items-center justify-between gap-2 px-4">
          <div class="flex items-center gap-2 sm:gap-6">
            {/* Brand */}
            <A href="/" class="flex items-center gap-2">
              <Rocket class="size-5" />
              <span class="text-lg font-semibold tracking-tight">CLIuno</span>
            </A>

            {/* Nav Links */}
            <div class="flex items-center gap-1">
              <A
                href="/todos"
                class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                inactiveClass="text-muted-foreground"
                activeClass="bg-muted"
              >
                <ListTodo class="size-4" />
                <span class="hidden sm:inline">Todos</span>
              </A>
              <A
                href="/posts"
                class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                inactiveClass="text-muted-foreground"
                activeClass="bg-muted"
              >
                <StickyNote class="size-4" />
                <span class="hidden sm:inline">Posts</span>
              </A>
              <A
                href="/users"
                class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                inactiveClass="text-muted-foreground"
                activeClass="bg-muted"
              >
                <Users class="size-4" />
                <span class="hidden sm:inline">Users</span>
              </A>
            </div>
          </div>

          <div class="flex items-center gap-1">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu placement="bottom-end">
              <DropdownMenuTrigger
                class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-2 px-1.5')}
              >
                <Avatar class="size-7">
                  <AvatarFallback class="text-xs">{initials()}</AvatarFallback>
                </Avatar>
                <span class="hidden sm:inline">{auth.user()?.username}</span>
                <ChevronDown class="size-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-48">
                <Show when={auth.user()}>
                  {(u) => (
                    <>
                      <DropdownMenuLabel class="text-xs text-muted-foreground">
                        @{u().username}
                      </DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => navigate(`/users/${u().id}`)}>
                        <User class="size-4" />
                        My Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                </Show>
                <DropdownMenuItem variant="destructive" onSelect={() => auth.logout()}>
                  <LogOut class="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main class="flex-1">{props.children}</main>

      {/* Footer */}
      <footer class="border-t py-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} CLIuno &mdash; Built with SolidJS
      </footer>
    </div>
  )
}

export default DefaultLayout
