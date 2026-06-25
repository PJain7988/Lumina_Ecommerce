import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiArrowLeft, FiMapPin, FiCreditCard } from 'react-icons/fi'
import orderService from '../../services/orderService'

const statusSteps = ['pending', 'processing', 'shipped', 'delivered']

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService.getOrderById(id)
      .then((res) => setOrder(res.order))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="skeleton h-96 rounded-2xl" />
  if (!order) return <div className="card p-10 text-center"><p className="text-gray-500">Order not found</p><Link to="/dashboard/orders" className="btn-outline mt-4">Back to Orders</Link></div>

  const currentStep = statusSteps.indexOf(order.status)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/dashboard/orders" className="btn-ghost p-2"><FiArrowLeft /></Link>
        <div>
          <h2 className="font-semibold text-brand">Order #{id.slice(-8).toUpperCase()}</h2>
          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          {statusSteps.map((step, i) => (
            <div key={step} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${i <= currentStep ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {i + 1}
                </div>
                <span className="text-xs capitalize text-gray-500 hidden sm:block">{step}</span>
              </div>
              {i < statusSteps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < currentStep ? 'bg-primary' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="card p-5">
        <h3 className="font-semibold text-brand mb-4">Items</h3>
        <div className="space-y-3">
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden">
                <img src={item.product?.images?.[0] || 'https://picsum.photos/seed/p1/100/100'} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-brand">{item.product?.name || 'Product'}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
              </div>
              <p className="text-sm font-semibold">₹{(item.quantity * item.price)?.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Shipping */}
        <div className="card p-5">
          <h3 className="font-semibold text-brand flex items-center gap-2 mb-3"><FiMapPin className="text-primary" /> Shipping Address</h3>
          {order.shippingAddress && (
            <div className="text-sm text-gray-600 space-y-0.5">
              <p className="font-medium text-brand">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p>📞 {order.shippingAddress.phone}</p>
            </div>
          )}
        </div>
        {/* Payment summary */}
        <div className="card p-5">
          <h3 className="font-semibold text-brand flex items-center gap-2 mb-3"><FiCreditCard className="text-primary" /> Payment</h3>
          <div className="text-sm space-y-1.5">
            <div className="flex justify-between text-gray-500"><span>Method</span><span className="capitalize font-medium text-brand">{order.paymentMethod}</span></div>
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString()}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{order.discount}</span></div>}
            <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span></div>
            <div className="flex justify-between font-semibold text-brand border-t pt-1.5"><span>Total</span><span>₹{order.total?.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
