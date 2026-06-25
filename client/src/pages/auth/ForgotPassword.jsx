import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { FiMail } from 'react-icons/fi'
import { forgotPassword } from '../../redux/slices/authSlice'

const schema = z.object({ email: z.string().email('Invalid email') })

export default function ForgotPassword() {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = ({ email }) => dispatch(forgotPassword(email))

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/" className="inline-block mb-8">
          <span className="font-display font-bold text-2xl text-secondary">Lumi<span className="text-gradient">na</span></span>
        </Link>
        <div className="card p-8">
          <h1 className="font-display font-bold text-2xl text-brand mb-2">Forgot password?</h1>
          <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send you a reset link.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('email')} type="email" placeholder="you@example.com" className={`input-field pl-11 ${errors.email ? 'border-red-400' : ''}`} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <Link to="/login" className="block text-center text-sm text-gray-500 mt-4 hover:text-primary">Back to login</Link>
        </div>
      </motion.div>
    </div>
  )
}
