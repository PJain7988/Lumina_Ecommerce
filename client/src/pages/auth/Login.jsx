import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { loginUser, googleLogin } from '../../redux/slices/authSlice'
import { useGoogleLogin } from '@react-oauth/google'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)
  const from = location.state?.from?.pathname || '/'

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, navigate, from])

  const onSubmit = (data) => {
    dispatch(loginUser(data))
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => dispatch(googleLogin(codeResponse.access_token)),
    onError: (error) => console.log('Login Failed:', error)
  })

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="inline-block mb-8">
            <span className="font-display font-bold text-2xl text-secondary">
              Lumi<span className="text-gradient">na</span>
            </span>
          </Link>

          <h1 className="font-display font-bold text-3xl text-brand mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className={`input-field pl-11 ${errors.email ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('password')}
                  type="password"
                  placeholder="Enter your password"
                  className={`input-field pl-11 ${errors.password ? 'border-red-400' : ''}`}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign In <FiArrowRight /></>
              )}
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or continue with</span>
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
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary via-accent to-purple-700 items-center justify-center p-12">
        <div className="text-white text-center">
          <div className="text-8xl mb-6">🛍️</div>
          <h2 className="font-display font-bold text-3xl mb-4">Premium Shopping Experience</h2>
          <p className="text-white/70 text-lg">
            Discover thousands of premium products from trusted sellers worldwide.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { number: '50K+', label: 'Products' },
              { number: '10K+', label: 'Sellers' },
              { number: '1M+', label: 'Customers' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4">
                <p className="font-display font-bold text-2xl">{stat.number}</p>
                <p className="text-white/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
