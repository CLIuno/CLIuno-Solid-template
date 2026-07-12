import { onMount, lazy } from 'solid-js'
import { Router, Route } from '@solidjs/router'
import { useAuth } from '@/stores/auth'
import DefaultLayout from '@/layouts/DefaultLayout'

// Lazy-loaded pages
const HomePage = lazy(() => import('@/pages/HomePage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const TodosPage = lazy(() => import('@/pages/app/TodosPage'))
const TodoDetailPage = lazy(() => import('@/pages/app/TodoDetailPage'))
const PostsPage = lazy(() => import('@/pages/app/PostsPage'))
const PostDetailPage = lazy(() => import('@/pages/app/PostDetailPage'))
const UsersPage = lazy(() => import('@/pages/app/UsersPage'))
const UserProfilePage = lazy(() => import('@/pages/user-profile/UserProfilePage'))

function AuthGuard(props: Readonly<{ children: any }>) {
  const auth = useAuth()
  onMount(() => {
    if (!auth.token()) {
      globalThis.location.href = '/login'
    }
  })
  return <>{props.children}</>
}

function GuestGuard(props: Readonly<{ children: any }>) {
  const auth = useAuth()
  onMount(() => {
    if (auth.token()) {
      globalThis.location.href = '/todos'
    }
  })
  return <>{props.children}</>
}

function AppLayout(props: Readonly<{ children?: any }>) {
  return (
    <AuthGuard>
      <DefaultLayout>{props.children}</DefaultLayout>
    </AuthGuard>
  )
}

function AuthInit(props: Readonly<{ children?: any }>) {
  const auth = useAuth()
  onMount(async () => {
    if (auth.token()) {
      await auth.fetchCurrentUser()
    }
  })
  return <>{props.children}</>
}

const App = () => {
  return (
    <Router root={AuthInit}>
      <Route path="/" component={HomePage} />
      <Route
        path="/login"
        component={() => (
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        )}
      />
      <Route
        path="/register"
        component={() => (
          <GuestGuard>
            <RegisterPage />
          </GuestGuard>
        )}
      />
      <Route
        path="/forgot-password"
        component={() => (
          <GuestGuard>
            <ForgotPasswordPage />
          </GuestGuard>
        )}
      />
      <Route path="/todos" component={AppLayout}>
        <Route path="/" component={TodosPage} />
        <Route path="/:id" component={TodoDetailPage} />
      </Route>
      <Route path="/posts" component={AppLayout}>
        <Route path="/" component={PostsPage} />
        <Route path="/:id" component={PostDetailPage} />
      </Route>
      <Route path="/users" component={AppLayout}>
        <Route path="/" component={UsersPage} />
        <Route path="/:id" component={UserProfilePage} />
      </Route>
      <Route
        path="/profile"
        component={() => (
          <AppLayout>
            <UserProfilePage />
          </AppLayout>
        )}
      />
    </Router>
  )
}

export default App
