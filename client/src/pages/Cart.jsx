import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiPlus, FiMinus, FiTag, FiArrowRight } from 'react-icons/fi'
import {
  selectCartItems, selectCartSubtotal, selectCartDiscount, selectCartTotal,
  removeFromCart, updateQuantity, applyCoupon, removeCoupon
} from '../redux/slices/cartSlice'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Cart() {
  const cartItems = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const discount = useSelector(selectCartDiscount)
  const total = useSelector(selectCartTotal)
  const { coupon, discount: discountPct } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [couponCode, setCouponCode] = useState('')
  const [applying, setApplying] = useState(false)

  const shipping = subtotal > 999 ? 0 : 99
  const tax = (subtotal - discount) * 0.18

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setApplying(true)
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode })
      dispatch(applyCoupon({ code: couponCode, discount: data.discount }))
      setCouponCode('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon code')
    } finally {
      setApplying(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-7xl mb-6">🛒</p>
          <h2 className="font-display font-bold text-2xl text-brand mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="btn-primary px-8 py-3">Start Shopping</Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <h1 className="font-display font-bold text-2xl text-brand mb-6">Shopping Cart ({cartItems.length} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.product._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card p-4 flex gap-4"
              >
                <Link to={`/product/${item.product.slug || item.product._id}`} className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                  <img src={item.product.images?.[0] || 'https://picsum.photos/seed/p1/200/200'} alt={item.product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {item.product.brand && <p className="text-xs text-gray-400 mb-0.5">{item.product.brand}</p>}
                      <Link to={`/product/${item.product.slug || item.product._id}`} className="text-sm font-medium text-brand hover:text-primary line-clamp-2">
                        {item.product.name}
                      </Link>
                    </div>
                    <button onClick={() => dispatch(removeFromCart(item.product._id))} className="text-red-400 hover:text-red-600 transition-colors shrink-0">
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => dispatch(updateQuantity({ productId: item.product._id, quantity: item.quantity - 1 }))} className="px-3 py-1.5 hover:bg-gray-100 transition-colors">
                        <FiMinus className="text-xs" />
                      </button>
                      <span className="px-4 py-1.5 text-sm font-medium border-x border-gray-200">{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ productId: item.product._id, quantity: item.quantity + 1 }))} className="px-3 py-1.5 hover:bg-gray-100 transition-colors">
                        <FiPlus className="text-xs" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-brand">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                      {item.quantity > 1 && <p className="text-xs text-gray-400">₹{item.product.price?.toLocaleString()} each</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-5 sticky top-20">
            <h2 className="font-semibold text-brand mb-4">Order Summary</h2>

            {/* Coupon */}
            {coupon ? (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl mb-4 text-sm">
                <div className="flex items-center gap-2 text-green-700">
                  <FiTag /> <span className="font-medium">{coupon}</span>
                  <span>({discountPct}% off)</span>
                </div>
                <button onClick={() => dispatch(removeCoupon())} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
              </div>
            ) : (
              <div className="flex gap-2 mb-4">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="input-field flex-1 py-2 text-sm"
                />
                <button onClick={handleApplyCoupon} disabled={applying} className="btn-outline px-4 text-sm shrink-0">
                  {applying ? '...' : 'Apply'}
                </button>
              </div>
            )}

            <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discountPct}%)</span>
                  <span>-₹{discount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax (18% GST)</span>
                <span>₹{tax.toFixed(0)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base border-t border-gray-100 pt-3">
                <span>Total</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
            </div>

            <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-5 flex items-center justify-center gap-2 py-3">
              Proceed to Checkout <FiArrowRight />
            </button>
            <Link to="/shop" className="block text-center text-sm text-gray-500 mt-3 hover:text-primary">
              Continue Shopping
            </Link>

            {subtotal < 999 && (
              <p className="text-xs text-center text-gray-400 mt-3">
                Add ₹{(999 - subtotal).toLocaleString()} more for free shipping
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
