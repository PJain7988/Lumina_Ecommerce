import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { FiLock } from 'react-icons/fi'
import { resetPassword } from '../../redux/slices/authSlice'

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })

export default function ResetPassword() {
  const { token } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async ({ password }) => {
    const result = await dispatch(resetPassword({ token, password }))
    if (!result.error) navigate('/login')
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/" className="inline-block mb-8">
          <span className="font-display font-bold text-2xl text-secondary">Lumi<span className="text-gradient">na</span></span>
        </Link>
        <div className="card p-8">
          <h1 className="font-display font-bold text-2xl text-brand mb-2">Set new password</h1>
          <p className="text-gray-500 text-sm mb-6">Choose a strong password for your account.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">New Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('password')} type="password" placeholder="Min. 8 characters" className={`input-field pl-11 ${errors.password ? 'border-red-400' : ''}`} />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('confirmPassword')} type="password" placeholder="Repeat password" className={`input-field pl-11 ${errors.confirmPassword ? 'border-red-400' : ''}`} />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
