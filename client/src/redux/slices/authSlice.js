import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../../services/authService'
import toast from 'react-hot-toast'

// Async thunks
export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const data = await authService.register(userData)
    toast.success('Account created! Please verify your email.')
    return data
  } catch (error) {
    toast.error(error.response?.data?.message || 'Registration failed')
    return rejectWithValue(error.response?.data)
  }
})

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.login(credentials)
    toast.success(`Welcome back, ${data.user.name}!`)
    return data
  } catch (error) {
    toast.error(error.response?.data?.message || 'Login failed')
    return rejectWithValue(error.response?.data)
  }
})

export const googleLogin = createAsyncThunk('auth/googleLogin', async (credential, { rejectWithValue }) => {
  try {
    const data = await authService.googleLogin(credential)
    toast.success(`Welcome back, ${data.user.name}!`)
    return data
  } catch (error) {
    toast.error(error.response?.data?.message || 'Google Login failed')
    return rejectWithValue(error.response?.data)
  }
})

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout()
    toast.success('Logged out successfully')
  } catch (error) {
    return rejectWithValue(error.response?.data)
  }
})

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState()
    if (!auth.token) return null
    const data = await authService.getProfile()
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data)
  }
})

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const data = await authService.forgotPassword(email)
    toast.success('Password reset email sent!')
    return data
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to send reset email')
    return rejectWithValue(error.response?.data)
  }
})

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, password }, { rejectWithValue }) => {
  try {
    const data = await authService.resetPassword(token, password)
    toast.success('Password reset successfully!')
    return data
  } catch (error) {
    toast.error(error.response?.data?.message || 'Password reset failed')
    return rejectWithValue(error.response?.data)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload?.token) {
          state.user = action.payload.user
          state.token = action.payload.token
          state.refreshToken = action.payload.refreshToken
          state.isAuthenticated = true
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Registration failed'
      })
      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Login failed'
      })
      // Google Login
      .addCase(googleLogin.pending, (state) => { state.loading = true; state.error = null })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Google Login failed'
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
      })
      // Load user
      .addCase(loadUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user
          state.isAuthenticated = true
        }
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export const { setCredentials, clearAuth, updateUser, clearError } = authSlice.actions
export default authSlice.reducer
