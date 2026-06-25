import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload
      const exists = state.items.find((item) => item._id === product._id)
      if (exists) {
        state.items = state.items.filter((item) => item._id !== product._id)
        toast.success('Removed from wishlist')
      } else {
        state.items.push(product)
        toast.success('Added to wishlist')
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload)
    },
    clearWishlist: (state) => {
      state.items = []
    },
  },
})

export const selectWishlistItems = (state) => state.wishlist.items
export const selectIsWishlisted = (productId) => (state) =>
  state.wishlist.items.some((item) => item._id === productId)

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
