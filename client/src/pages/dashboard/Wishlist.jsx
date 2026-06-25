import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi'
import { selectWishlistItems, removeFromWishlist } from '../../redux/slices/wishlistSlice'
import { addToCart } from '../../redux/slices/cartSlice'

export default function Wishlist() {
  const items = useSelector(selectWishlistItems)
  const dispatch = useDispatch()

  return (
    <div>
      <h2 className="font-semibold text-brand text-lg mb-5">My Wishlist ({items.length})</h2>
      {items.length === 0 ? (
        <div className="card p-10 text-center">
          <FiHeart className="text-5xl text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <Link to="/shop" className="btn-primary px-6">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {items.map((product) => (
              <motion.div key={product._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="card overflow-hidden group">
                <Link to={`/product/${product.slug || product._id}`} className="block aspect-square bg-gray-50 overflow-hidden">
                  <img src={product.images?.[0] || 'https://picsum.photos/seed/p1/300/300'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </Link>
                <div className="p-3">
                  <p className="text-sm font-medium text-brand line-clamp-2 mb-2">{product.name}</p>
                  <p className="font-semibold text-brand mb-3">₹{product.price?.toLocaleString()}</p>
                  <div className="flex gap-2">
                    <button onClick={() => dispatch(addToCart({ product, quantity: 1 }))} className="btn-primary flex-1 text-xs py-2 flex items-center justify-center gap-1">
                      <FiShoppingCart className="text-xs" /> Add to Cart
                    </button>
                    <button onClick={() => dispatch(removeFromWishlist(product._id))} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
