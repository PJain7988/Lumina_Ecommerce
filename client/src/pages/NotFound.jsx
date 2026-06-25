import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <p className="font-display font-bold text-8xl text-gradient mb-4">404</p>
        <h1 className="font-display font-bold text-2xl text-brand mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary px-8 py-3">Back to Home</Link>
      </motion.div>
    </div>
  )
}
