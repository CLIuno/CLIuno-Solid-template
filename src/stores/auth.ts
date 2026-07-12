import { createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import axios from 'axios'
import api from '@/apis'

export interface User {
  id: string
  username: string
  first_name: string
  last_name: string
  email: string
  phone: string
  is_verified: boolean
}

const [user, setUser] = createSignal<User | null>(null)
const [token, setTokenSignal] = createSignal<string | null>(localStorage.getItem('token'))
const [loading, setLoading] = createSignal(false)
const [error, setError] = createSignal<string | null>(null)

function setTokens(accessToken: string, refresh: string) {
  setTokenSignal(accessToken)
  localStorage.setItem('token', accessToken)
  localStorage.setItem('refreshToken', refresh)
}

function clearAuth() {
  setUser(null)
  setTokenSignal(null)
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
}

export function useAuth() {
  const navigate = useNavigate()

  const isAuthenticated = () => !!token()
  const fullName = () => {
    const u = user()
    return u ? `${u.first_name} ${u.last_name}` : ''
  }

  async function login(usernameOrEmail: string, password: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await api.auth.login({ usernameOrEmail, password })
      const data = res.data.data
      setTokens(data.token, data.refreshToken)
      setUser(data.user)
      navigate('/todos')
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Login failed'
        : 'Login failed'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function register(userData: {
    first_name: string
    last_name: string
    username: string
    email: string
    phone: string
    password: string
    password_confirmation: string
  }) {
    setLoading(true)
    setError(null)
    try {
      await api.auth.register(userData)
      navigate('/login')
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Registration failed'
        : 'Registration failed'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      await api.auth.logout()
    } catch {
      // ignore
    } finally {
      clearAuth()
      navigate('/login')
    }
  }

  async function fetchCurrentUser() {
    if (!token()) return
    try {
      const res = await api.user.getCurrentUser()
      setUser(res.data.data.user)
    } catch {
      clearAuth()
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    fullName,
    login,
    register,
    logout,
    fetchCurrentUser,
    clearAuth,
  }
}
