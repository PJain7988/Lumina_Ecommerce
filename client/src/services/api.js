import axios from 'axios'
import { store } from '../redux/store'
import { clearAuth, setCredentials } from '../redux/slices/authSlice'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.auth?.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const state = store.getState()
        const refreshToken = state.auth?.refreshToken

        if (!refreshToken) {
          store.dispatch(clearAuth())
          return Promise.reject(error)
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken })
        const { token } = response.data

        store.dispatch(setCredentials({ ...store.getState().auth, token }))
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (refreshError) {
        store.dispatch(clearAuth())
        return Promise.reject(refreshError)
      }
    } else {
      // Global error toast for non-401 errors
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      if (error.response?.status !== 404) {
        toast.error(errorMessage);
      }
    }

    return Promise.reject(error)
  }
)

export default api
