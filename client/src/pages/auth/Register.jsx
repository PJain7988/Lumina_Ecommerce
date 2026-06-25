import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { registerUser, googleLogin } from '../../redux/slices/authSlice'
import { useGoogleLogin } from '@react-oauth/google'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['customer', 'seller']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'customer' },
  })

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  const onSubmit = (data) => {
    const { confirmPassword, ...userData } = data
    dispatch(registerUser(userData))
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => dispatch(googleLogin(codeResponse.access_token)),
    onError: (error) => console.log('Login Failed:', error)
  })

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="inline-block mb-8">
          <span className="font-display font-bold text-2xl text-secondary">
            Lumi<span className="text-gradient">na</span>
          </span>
        </Link>

        <h1 className="font-display font-bold text-3xl text-brand mb-2">Create your account</h1>
        <p className="text-gray-500 mb-8">Join thousands of premium shoppers</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Role selection */}
          <div className="grid grid-cols-2 gap-3">
            {['customer', 'seller'].map((role) => (
              <label key={role} className="relative cursor-pointer">
                <input {...register('role')} type="radio" value={role} className="peer sr-only" />
                <div className="p-3 border-2 border-gray-200 rounded-xl text-center text-sm font-medium capitalize peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all">
                  {role === 'customer' ? '🛍️' : '🏪'} {role}
                </div>
              </label>
            ))}
          </div>

          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input {...register('name')} placeholder="John Doe" className={`input-field pl-11 ${errors.name ? 'border-red-400' : ''}`} />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Email address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input {...register('email')} type="email" placeholder="you@example.com" className={`input-field pl-11 ${errors.email ? 'border-red-400' : ''}`} />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label">Password</label>
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

          <p className="text-xs text-gray-400">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Create Account <FiArrowRight /></>
            )}
          </button>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or sign up with</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
          >
            <FcGoogle className="text-xl" /> Google
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
