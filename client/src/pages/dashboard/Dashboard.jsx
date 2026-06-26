import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingBag, FiHeart, FiStar, FiGift, FiChevronRight, FiPackage } from 'react-icons/fi'
import { selectWishlistItems } from '../../redux/slices/wishlistSlice'
import orderService from '../../services/orderService'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth)
  const wishlistItems = useSelector(selectWishlistItems)
  const [stats, setStats] = useState({ totalOrders: 0, reviewsGiven: 0, recentOrders: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService.getCustomerDashboardStats()
      .then(res => setStats(res.stats))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { icon: FiShoppingBag, label: 'Total Orders', value: stats.totalOrders, link: '/dashboard/orders', color: 'bg-blue-50 text-blue-600' },
    { icon: FiHeart, label: 'Wishlist Items', value: wishlistItems.length, link: '/dashboard/wishlist', color: 'bg-pink-50 text-pink-600' },
    { icon: FiStar, label: 'Reviews Given', value: stats.reviewsGiven, link: '/dashboard/reviews', color: 'bg-yellow-50 text-yellow-600' },
    { icon: FiGift, label: 'Reward Points', value: user?.rewardPoints || 0, link: '#', color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div>
      <div className="card p-6 mb-6 bg-gradient-to-r from-primary to-accent text-white">
        <p className="text-white/70 text-sm">Welcome back,</p>
        <h1 className="font-display font-bold text-2xl mt-1">{user?.name} 👋</h1>
        <p className="text-white/70 text-sm mt-1">{user?.email}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {statCards.map((stat, i) => (
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
      )}

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-brand">Recent Orders</h2>
          <Link to="/dashboard/orders" className="text-xs font-medium text-primary hover:underline">View All</Link>
        </div>
        
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
        ) : stats.recentOrders?.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FiShoppingBag className="text-4xl mx-auto mb-3" />
            <p className="text-sm">Your recent orders will appear here</p>
            <Link to="/shop" className="btn-primary mt-4 inline-block text-sm px-6 py-2">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentOrders?.map((order) => (
              <Link key={order._id} to={`/dashboard/orders/${order._id}`} className="flex items-center p-3 rounded-xl hover:bg-gray-50 border border-gray-50 transition-colors gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                  {order.items?.[0]?.image ? (
                    <img src={order.items[0].image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <FiPackage className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-brand mb-1">₹{order.total?.toLocaleString()}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                </div>
                <FiChevronRight className="text-gray-400 hidden sm:block ml-2" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
