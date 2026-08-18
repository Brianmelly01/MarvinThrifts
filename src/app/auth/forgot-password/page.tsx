'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Simulate recovery request
    await new Promise((resolve) => setTimeout(resolve, 800))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-display text-4xl tracking-widest text-[#0A0A0A] mb-1">MARVIN</div>
          <div className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase text-[#C9A84C]">THRIFTS</div>
          <h1 className="text-2xl font-bold mt-6 mb-2">Reset Password</h1>
          <p className="text-sm text-[#737373]">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        <div className="bg-white border border-[#E5E5E5] p-8">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
              </div>
              <h2 className="text-lg font-bold text-[#0A0A0A]">Check your inbox</h2>
              <p className="text-xs text-[#737373] leading-relaxed">
                If an account exists for <strong>{email}</strong>, we have sent instructions to reset your password.
              </p>
              <div className="pt-4">
                <Link href="/auth/login" className="btn btn-primary w-full text-xs">
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="reset-email" className="input-label">Email Address</label>
                <div className="relative">
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-11"
                    placeholder="you@example.com"
                  />
                  <Mail className="w-4 h-4 text-[#A3A3A3] absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full btn-lg gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending link...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-[#0A0A0A] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
