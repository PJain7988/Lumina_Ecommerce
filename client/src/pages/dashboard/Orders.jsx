import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiChevronRight } from 'react-icons/fi'
import orderService from '../../services/orderService'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService.getMyOrders()
      .then((res) => setOrders(res.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
    </div>
  )

  return (
    <div>
      <h2 className="font-semibold text-brand text-lg mb-5">My Orders</h2>
      {orders.length === 0 ? (
        <div className="card p-10 text-center">
          <FiPackage className="text-5xl text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
          <Link to="/shop" className="btn-primary px-6">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link key={order._id} to={`/dashboard/orders/${order._id}`} className="card p-4 flex items-center gap-4 hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                {order.items?.[0]?.image ? (
                  <img src={order.items[0].image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FiPackage className="text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-brand text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()} · {order.items?.length} items</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${statusColors[order.status] || 'bg-gray-100 text-gray-600'} capitalize`}>{order.status}</span>
                <p className="font-semibold text-sm">₹{order.total?.toLocaleString()}</p>
                <FiChevronRight className="text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
