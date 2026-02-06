'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'

export default function HomePage() {
  const router = useRouter()
  const { login, signup, user, loading: authLoading } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [signupData, setSignupData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    name: '' 
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-green-600 text-2xl">Loading...</div>
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(loginData.email, loginData.password)
    } catch (err: any) {
      console.error('Login error:', err)
      const errorMessage = err?.message || 'Failed to log in'
      
      if (errorMessage.includes('Invalid login credentials') || errorMessage.includes('Invalid')) {
        setError('Invalid email or password')
      } else if (errorMessage.includes('Email not confirmed')) {
        setError('Please confirm your email address')
      } else if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('connect')) {
        setError('Unable to connect to the server. Please check your internet connection and ensure the server is running.')
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (signupData.password !== signupData.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      if (signupData.password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      await signup(signupData.email, signupData.password, signupData.name)
    } catch (err: any) {
      console.error('Signup error:', err)
      if (err?.message?.includes('already exists') || err?.message?.includes('already registered')) {
        setError('An account with this email already exists. Please log in instead.')
      } else {
        setError(err?.message || 'Failed to create account')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="text-green-600 text-4xl mb-4">🌿</div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Grow Your Garden with Confidence
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl">
            Your smart companion for planting, tracking, and thriving — tailored to your location.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              onClick={() => {
                setShowSignup(false)
                setShowLogin(!showLogin)
                setError('')
              }}
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold 
                hover:bg-green-700 transition-all duration-200 hover:scale-105 
                shadow-md hover:shadow-lg"
            >
              Log In
            </button>
            <button 
              onClick={() => {
                setShowLogin(false)
                setShowSignup(!showSignup)
                setError('')
              }}
              className="bg-white text-green-600 border-2 border-green-600 px-8 py-4 rounded-lg font-semibold 
                hover:bg-green-50 transition-all duration-200 hover:scale-105 
                shadow-md hover:shadow-lg"
            >
              Create Account
            </button>
          </div>

          {/* Login Form */}
          {showLogin && (
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 mt-4">
              <h2 className="text-2xl font-bold text-green-800 mb-6">Log In</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
              </form>
            </div>
          )}

          {/* Signup Form */}
          {showSignup && (
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 mt-4">
              <h2 className="text-2xl font-bold text-green-800 mb-6">Create Account</h2>
              <form onSubmit={handleSignup} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    required
                    minLength={6}
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="signup-confirm" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="signup-confirm"
                    type="password"
                    required
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </div>
          )}

          {!showLogin && !showSignup && (
            <button 
              onClick={() => router.push('/location-select')}
              className="text-green-600 hover:text-green-700 font-medium mt-4"
            >
              Continue without account →
            </button>
          )}
        </div>
      </main>
    </div>
  )
} 