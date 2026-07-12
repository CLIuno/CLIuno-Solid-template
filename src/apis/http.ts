import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api/v1'

const http = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      if (globalThis.location.pathname !== '/login') {
        globalThis.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default http
