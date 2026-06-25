import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { FiMapPin, FiCreditCard, FiCheck } from 'react-icons/fi'
import { selectCartItems, selectCartSubtotal, selectCartDiscount, clearCart } from '../redux/slices/cartSlice'
import orderService from '../services/orderService'
import toast from 'react-hot-toast'

const schema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10, 'Enter valid phone number'),
  address: z.string().min(10),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().length(6, 'Enter valid 6-digit pincode'),
  landmark: z.string().optional(),
})

const paymentMethods = [
  { id: 'razorpay', label: 'Razorpay', icon: '💳', desc: 'Cards, UPI, Wallets' },
  { id: 'stripe', label: 'Stripe', icon: '💳', desc: 'International Cards' },
  { id: 'upi', label: 'UPI', icon: '📱', desc: 'Google Pay, PhonePe, etc.' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when delivered' },
]

const steps = ['Shipping', 'Payment', 'Review']

export default function Checkout() {
  const [step, setStep] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [loading, setLoading] = useState(false)
  const [shippingData, setShippingData] = useState(null)

  const cartItems = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const discount = useSelector(selectCartDiscount)
  const { coupon, discount: discountPct } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const shipping = subtotal > 999 ? 0 : 99
  const tax = (subtotal - discount) * 0.18
  const total = subtotal - discount + shipping + tax

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { fullName: user?.name, phone: user?.phone },
  })

  const onShippingSubmit = (data) => {
    setShippingData(data)
    setStep(1)
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: shippingData,
        paymentMethod,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        coupon,
      }

      const { data } = await orderService.createOrder(orderData)

      if (paymentMethod === 'razorpay') {
        // Razorpay integration
        const { data: paymentData } = await orderService.createPaymentOrder({ amount: total, orderId: data.order._id })
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY,
          amount: paymentData.amount,
          currency: 'INR',
          name: 'Lumina',
          description: 'Order Payment',
          order_id: paymentData.razorpayOrderId,
          handler: async (response) => {
            await orderService.verifyPayment({ ...response, orderId: data.order._id })
            dispatch(clearCart())
            navigate(`/order-success/${data.order._id}`)
          },
          prefill: { name: user?.name, email: user?.email, contact: shippingData?.phone },
          theme: { color: '#2563EB' },
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        dispatch(clearCart())
        navigate(`/order-success/${data.order._id}`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order placement failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-custom py-8 max-w-5xl">
      <h1 className="font-display font-bold text-2xl text-brand mb-6">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 ${i <= step ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${i < step ? 'bg-primary border-primary text-white' : i === step ? 'border-primary text-primary' : 'border-gray-200'}`}>
                {i < step ? <FiCheck /> : i + 1}
              </div>
              <span className="text-sm font-medium hidden sm:block">{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 min-w-8 transition-colors ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2">
          {step === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
              <h2 className="font-semibold text-brand flex items-center gap-2 mb-5">
                <FiMapPin className="text-primary" /> Shipping Address
              </h2>
              <form onSubmit={handleSubmit(onShippingSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">Full Name</label>
                  <input {...register('fullName')} className={`input-field ${errors.fullName ? 'border-red-400' : ''}`} placeholder="John Doe" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input {...register('phone')} className={`input-field ${errors.phone ? 'border-red-400' : ''}`} placeholder="+91 9876543210" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="label">Pincode</label>
                  <input {...register('pincode')} className={`input-field ${errors.pincode ? 'border-red-400' : ''}`} placeholder="110001" />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Address</label>
                  <textarea {...register('address')} rows={2} className={`input-field resize-none ${errors.address ? 'border-red-400' : ''}`} placeholder="House no, Street, Area" />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>
                <div>
                  <label className="label">City</label>
                  <input {...register('city')} className={`input-field ${errors.city ? 'border-red-400' : ''}`} placeholder="Mumbai" />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="label">State</label>
                  <input {...register('state')} className={`input-field ${errors.state ? 'border-red-400' : ''}`} placeholder="Maharashtra" />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Landmark (optional)</label>
                  <input {...register('landmark')} className="input-field" placeholder="Near landmark" />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="btn-primary w-full py-3">Continue to Payment</button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
              <h2 className="font-semibold text-brand flex items-center gap-2 mb-5">
                <FiCreditCard className="text-primary" /> Payment Method
              </h2>
              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => (
                  <label key={method.id} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="text-primary" />
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-medium text-sm text-brand">{method.label}</p>
                      <p className="text-xs text-gray-400">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="btn-outline flex-1">Back</button>
                <button onClick={() => setStep(2)} className="btn-primary flex-1">Review Order</button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Items */}
              <div className="card p-5">
                <h3 className="font-semibold text-brand mb-4">Order Items ({cartItems.length})</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.product._id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50">
                        <img src={item.product.images?.[0] || 'https://picsum.photos/seed/p1/100/100'} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 py-3">
                  {loading ? 'Placing Order...' : `Place Order — ₹${total.toFixed(0)}`}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Summary */}
        <div className="card p-5 h-fit sticky top-20">
          <h3 className="font-semibold text-brand mb-4">Price Details</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal ({cartItems.length} items)</span><span>₹{subtotal.toLocaleString()}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{discount.toFixed(0)}</span></div>}
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tax (18%)</span><span>₹{tax.toFixed(0)}</span></div>
            <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2.5"><span>Total</span><span>₹{total.toFixed(0)}</span></div>
          </div>
          {discount > 0 && (
            <p className="text-xs text-green-600 mt-3 p-2 bg-green-50 rounded-lg text-center">
              You save ₹{discount.toFixed(0)} on this order!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
