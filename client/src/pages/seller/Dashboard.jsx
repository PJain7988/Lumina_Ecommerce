import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FiPackage, FiShoppingBag, FiDollarSign, FiTrendingUp, FiPlus } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function SellerDashboard() {
  const { user } = useSelector((state) => state.auth)

  const stats = [
    { icon: FiDollarSign, label: 'Total Revenue', value: '₹0', change: '+0%', color: 'text-green-600 bg-green-50' },
    { icon: FiShoppingBag, label: 'Total Orders', value: '0', change: '+0', color: 'text-blue-600 bg-blue-50' },
    { icon: FiPackage, label: 'Total Products', value: '0', change: '+0', color: 'text-purple-600 bg-purple-50' },
    { icon: FiTrendingUp, label: 'This Month', value: '₹0', change: '+0%', color: 'text-orange-600 bg-orange-50' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="text-center py-8 text-gray-400">
            <FiShoppingBag className="text-4xl mx-auto mb-2" />
            <p className="text-sm">No orders yet</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Top Products</h2>
          <div className="text-center py-8 text-gray-400">
            <FiPackage className="text-4xl mx-auto mb-2" />
            <p className="text-sm">No products added yet</p>
            <Link to="/seller/products/add" className="text-primary text-sm mt-2 block hover:underline">Add your first product →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
