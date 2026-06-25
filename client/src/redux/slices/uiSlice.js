import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: false,
    cartOpen: false,
    searchOpen: false,
    mobileMenuOpen: false,
    quickViewProduct: null,
    notifications: [],
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      if (state.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload
    },
    toggleCart: (state) => { state.cartOpen = !state.cartOpen },
    openCart: (state) => { state.cartOpen = true },
    closeCart: (state) => { state.cartOpen = false },
    toggleSearch: (state) => { state.searchOpen = !state.searchOpen },
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen },
    closeMobileMenu: (state) => { state.mobileMenuOpen = false },
    setQuickViewProduct: (state, action) => { state.quickViewProduct = action.payload },
    clearQuickView: (state) => { state.quickViewProduct = null },
    addNotification: (state, action) => {
      state.notifications.unshift({ ...action.payload, id: Date.now(), read: false })
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification) notification.read = true
    },
    clearNotifications: (state) => { state.notifications = [] },
  },
})

export const {
  toggleDarkMode, setDarkMode,
  toggleCart, openCart, closeCart,
  toggleSearch, toggleMobileMenu, closeMobileMenu,
  setQuickViewProduct, clearQuickView,
  addNotification, markNotificationRead, clearNotifications,
} = uiSlice.actions
export default uiSlice.reducer
