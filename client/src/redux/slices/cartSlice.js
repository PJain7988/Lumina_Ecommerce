import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    coupon: null,
    discount: 0,
    shippingAddress: null,
    paymentMethod: 'razorpay',
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1, variant } = action.payload
      const existingIndex = state.items.findIndex(
        (item) => item.product._id === product._id && item.variant === variant
      )
      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantity
        toast.success('Cart updated')
      } else {
        state.items.push({ product, quantity, variant })
        toast.success('Added to cart')
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.product._id !== action.payload)
      toast.success('Removed from cart')
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload
      const item = state.items.find((item) => item.product._id === productId)
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.product._id !== productId)
        } else {
          item.quantity = quantity
        }
      }
    },
    clearCart: (state) => {
      state.items = []
      state.coupon = null
      state.discount = 0
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload.code
      state.discount = action.payload.discount
      toast.success(`Coupon applied! ${action.payload.discount}% off`)
    },
    removeCoupon: (state) => {
      state.coupon = null
      state.discount = 0
    },
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload
    },
  },
})

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) => state.cart.items.reduce((acc, item) => acc + item.quantity, 0)
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
export const selectCartDiscount = (state) => {
  const subtotal = selectCartSubtotal({ cart: state.cart })
  return (subtotal * state.cart.discount) / 100
}
export const selectCartTotal = (state) => {
  const subtotal = selectCartSubtotal({ cart: state.cart })
  const discount = selectCartDiscount({ cart: state.cart })
  const shipping = subtotal > 999 ? 0 : 99
  const tax = (subtotal - discount) * 0.18
  return subtotal - discount + shipping + tax
}

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon, setShippingAddress, setPaymentMethod } = cartSlice.actions
export default cartSlice.reducer
