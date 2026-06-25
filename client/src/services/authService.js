import api from './api'

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  googleLogin: async (credential) => {
    const response = await api.post('/auth/google', { credential })
    return response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data)
    return response.data
  },

  uploadAvatar: async (formData) => {
    const response = await api.post('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  changePassword: async (data) => {
    const response = await api.put('/auth/change-password', data)
    return response.data
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password })
    return response.data
  },

  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`)
    return response.data
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken })
    return response.data
  },
}

export default authService
