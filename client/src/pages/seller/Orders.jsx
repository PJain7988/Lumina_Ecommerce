import { useState, useEffect } from 'react'
import { FiShoppingBag, FiTruck, FiCheck, FiX } from 'react-icons/fi'
import orderService from '../../services/orderService'
import toast from 'react-hot-toast'

export default function SellerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {
    setLoading(true)
    orderService.getSellerOrders()
      .then(res => setOrders(res.orders || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusUpdate = async (id, status) => {
    try {
      await orderService.updateOrderStatus(id, { status })
      toast.success('Order status updated')
      fetchOrders()
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-gray-900 mb-6">Orders</h1>
      
      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
          <FiShoppingBag className="text-5xl text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No orders received yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order Details</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">#{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                    <div className="mt-2 space-y-1">
                      {order.items.map(item => (
                        <div key={item._id} className="flex items-center gap-2 text-xs">
                          <img src={item.image || '/placeholder-product.jpg'} alt={item.name} className="w-6 h-6 rounded object-cover" />
                          <span className="truncate max-w-[150px]">{item.name}</span>
                          <span className="text-gray-400">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">{order.user?.name || 'Guest'}</p>
                    <p className="text-xs text-gray-500">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                  </td>
                  <td className="px-4 py-4 font-semibold text-gray-900">
                    ₹{order.total?.toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      disabled={order.status === 'cancelled' || order.status === 'delivered'}
                      className="text-xs border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
