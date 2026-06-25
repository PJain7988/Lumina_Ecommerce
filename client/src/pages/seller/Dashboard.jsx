import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FiPackage, FiShoppingBag, FiDollarSign, FiTrendingUp, FiPlus, FiArrowRight } from 'react-icons/fi'
import { motion } from 'framer-motion'
import orderService from '../../services/orderService'

export default function SellerDashboard() {
  const { user } = useSelector((state) => state.auth)
  const [analytics, setAnalytics] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      orderService.getSellerAnalytics().catch(() => ({ analytics: null })),
      orderService.getSellerOrders({ limit: 5 }).catch(() => ({ orders: [] }))
    ]).then(([analyticsRes, ordersRes]) => {
      setAnalytics(analyticsRes.analytics)
      setRecentOrders(ordersRes.orders || [])
      setLoading(false)
    })
  }, [])

  const stats = [
    { icon: FiDollarSign, label: 'Total Revenue', value: `₹${analytics?.totalRevenue?.toLocaleString() || 0}`, color: 'text-green-600 bg-green-50' },
    { icon: FiShoppingBag, label: 'Total Orders', value: analytics?.totalOrders || 0, color: 'text-blue-600 bg-blue-50' },
    { icon: FiPackage, label: 'Total Products', value: analytics?.totalProducts || 0, color: 'text-purple-600 bg-purple-50' },
    { icon: FiTrendingUp, label: 'Avg. Order', value: `₹${Math.round(analytics?.avgOrderValue || 0).toLocaleString()}`, color: 'text-orange-600 bg-orange-50' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, {user?.name}</p>
        </div>
        <Link to="/seller/products/add" className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-primary-700 transition-colors">
          <FiPlus /> Add Product
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} mb-3`}>
                <stat.icon />
              </div>
              <p className="font-bold text-2xl text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/seller/orders" className="text-xs font-medium text-primary hover:underline">View All</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FiShoppingBag className="text-4xl mx-auto mb-2" />
              <p className="text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-gray-50">
                  <div>
                    <p className="font-medium text-sm text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-gray-900">₹{order.total?.toLocaleString()}</p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="space-y-3">
            <Link to="/seller/products" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><FiPackage /></div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Manage Products</p>
                  <p className="text-xs text-gray-500">Edit or remove your products</p>
                </div>
              </div>
              <FiArrowRight className="text-gray-400 group-hover:text-primary transition-colors" />
            </Link>
            <Link to="/seller/orders" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><FiShoppingBag /></div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Manage Orders</p>
                  <p className="text-xs text-gray-500">Update order status & tracking</p>
                </div>
              </div>
              <FiArrowRight className="text-gray-400 group-hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
