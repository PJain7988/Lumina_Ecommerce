// OrderSuccess
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiPackage, FiHome } from 'react-icons/fi'

export function OrderSuccess() {
  const { id } = useParams()
  return (
    <div className="container-custom py-20 max-w-lg text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
        <FiCheckCircle className="text-7xl text-green-500 mx-auto mb-6" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h1 className="font-display font-bold text-3xl text-brand mb-3">Order Placed!</h1>
        <p className="text-gray-500 mb-2">Your order has been placed successfully.</p>
        <p className="text-sm text-gray-400 mb-8">Order ID: <span className="font-mono text-brand">{id}</span></p>
        <div className="flex gap-3 justify-center">
          <Link to="/dashboard/orders" className="btn-outline flex items-center gap-2"><FiPackage /> Track Order</Link>
          <Link to="/" className="btn-primary flex items-center gap-2"><FiHome /> Continue Shopping</Link>
        </div>
      </motion.div>
    </div>
  )
}

export default OrderSuccess
