import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-100 rounded-full mx-auto" />
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 -translate-x-1/2" />
        </div>
        <p className="mt-4 font-display font-bold text-xl text-secondary">
          Lumi<span className="text-gradient">na</span>
        </p>
        <p className="text-sm text-gray-400 mt-1">Loading...</p>
      </motion.div>
    </div>
  )
}
