import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import authService from '../../services/authService'

export default function VerifyEmail() {
  const { token } = useParams()
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    authService.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card p-10 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Verifying your email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="font-display font-bold text-2xl text-brand mb-2">Email Verified!</h2>
            <p className="text-gray-500 mb-6">Your email has been verified successfully. You can now sign in.</p>
            <Link to="/login" className="btn-primary">Sign In</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="font-display font-bold text-2xl text-brand mb-2">Verification Failed</h2>
            <p className="text-gray-500 mb-6">The verification link is invalid or has expired.</p>
            <Link to="/login" className="btn-outline">Back to Login</Link>
          </>
        )}
      </motion.div>
    </div>
  )
}
