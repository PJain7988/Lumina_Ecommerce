import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi'
import { closeCart } from '../../redux/slices/uiSlice'
import { removeFromCart, updateQuantity, selectCartItems, selectCartSubtotal } from '../../redux/slices/cartSlice'

export default function CartDrawer() {
  const { cartOpen } = useSelector((state) => state.ui)
  const cartItems = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const dispatch = useDispatch()

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-display font-semibold text-lg">Shopping Cart ({cartItems.length})</h2>
              <button onClick={() => dispatch(closeCart())} className="btn-ghost p-2 rounded-full">
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <FiShoppingBag className="text-5xl text-gray-200 mb-4" />
                  <p className="font-medium text-gray-400 mb-2">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mb-6">Add products to get started</p>
                  <button onClick={() => dispatch(closeCart())} className="btn-primary">
                    <Link to="/shop">Continue Shopping</Link>
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.product._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                        <img
                          src={item.product.images?.[0] || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-brand line-clamp-2 mb-1">{item.product.name}</h4>
                        <p className="text-sm font-semibold text-primary mb-2">₹{item.product.price?.toLocaleString()}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => dispatch(updateQuantity({ productId: item.product._id, quantity: item.quantity - 1 }))}
                              className="px-2 py-1 hover:bg-gray-100 transition-colors"
                            >
                              <FiMinus className="text-xs" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => dispatch(updateQuantity({ productId: item.product._id, quantity: item.quantity + 1 }))}
                              className="px-2 py-1 hover:bg-gray-100 transition-colors"
                            >
                              <FiPlus className="text-xs" />
                            </button>
                          </div>
                          <button
                            onClick={() => dispatch(removeFromCart(item.product._id))}
                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-400">Shipping and taxes calculated at checkout</p>
                <Link
                  to="/checkout"
                  onClick={() => dispatch(closeCart())}
                  className="btn-primary w-full text-center block"
                >
                  Proceed to Checkout
                </Link>
                <button onClick={() => dispatch(closeCart())} className="btn-outline w-full">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
