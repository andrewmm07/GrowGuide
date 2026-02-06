'use client'
import Link from 'next/link'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 text-center">
        <div className="text-5xl mb-6">📧</div>
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          Check Your Email
        </h2>
        <p className="text-gray-600 mb-6">
          We've sent you a verification link. Please check your email and click the link to activate your account.
        </p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or try logging in again.
          </p>
          <Link
            href="/auth/login"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  )
} 