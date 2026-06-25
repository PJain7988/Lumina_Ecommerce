import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingBag, FiHeart, FiStar, FiGift } from 'react-icons/fi'
import { selectCartCount } from '../../redux/slices/cartSlice'
import { selectWishlistItems } from '../../redux/slices/wishlistSlice'

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth)
  const wishlistItems = useSelector(selectWishlistItems)

  const stats = [
    { icon: FiShoppingBag, label: 'Total Orders', value: '—', link: '/dashboard/orders', color: 'bg-blue-50 text-blue-600' },
    { icon: FiHeart, label: 'Wishlist Items', value: wishlistItems.length, link: '/dashboard/wishlist', color: 'bg-pink-50 text-pink-600' },
    { icon: FiStar, label: 'Reviews Given', value: '—', link: '/dashboard/reviews', color: 'bg-yellow-50 text-yellow-600' },
    { icon: FiGift, label: 'Reward Points', value: user?.rewardPoints || 0, link: '#', color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div>
      <div className="card p-6 mb-6 bg-gradient-to-r from-primary to-accent text-white">
        <p className="text-white/70 text-sm">Welcome back,</p>
        <h1 className="font-display font-bold text-2xl mt-1">{user?.name} 👋</h1>
        <p className="text-white/70 text-sm mt-1">{user?.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={stat.link} className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="text-xl" />
              </div>
              <div>
                <p className="font-bold text-2xl text-brand">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-brand mb-4">Recent Orders</h2>
        <div className="text-center py-8 text-gray-400">
          <FiShoppingBag className="text-4xl mx-auto mb-3" />
          <p className="text-sm">Your recent orders will appear here</p>
          <Link to="/shop" className="btn-primary mt-4 inline-block text-sm px-6 py-2">Start Shopping</Link>
        </div>
      </div>
    </div>
  )
}
