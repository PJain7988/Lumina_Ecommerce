import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiUserCheck } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const stats = [
    { icon: FiDollarSign, label: 'Total Revenue', value: '₹0', color: 'text-green-600 bg-green-50' },
    { icon: FiShoppingBag, label: 'Total Orders', value: '0', color: 'text-blue-600 bg-blue-50' },
    { icon: FiUsers, label: 'Total Users', value: '0', color: 'text-purple-600 bg-purple-50' },
    { icon: FiPackage, label: 'Total Products', value: '0', color: 'text-orange-600 bg-orange-50' },
    { icon: FiUserCheck, label: 'Active Sellers', value: '0', color: 'text-teal-600 bg-teal-50' },
  ]

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} mb-3`}>
              <stat.icon />
            </div>
            <p className="font-bold text-xl text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="text-center py-8 text-gray-400 text-sm">Orders will appear here as they come in.</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Users</h2>
          <div className="text-center py-8 text-gray-400 text-sm">New user registrations will appear here.</div>
        </div>
      </div>
    </div>
  )
}
