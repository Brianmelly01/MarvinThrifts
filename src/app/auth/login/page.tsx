'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('Invalid email or password. Please try again.')
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="font-display text-4xl tracking-widest text-[#0A0A0A] mb-1">MARVIN</div>
        <div className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase text-[#C9A84C]">THRIFTS</div>
        <h1 className="text-2xl font-bold mt-6 mb-2">Welcome back</h1>
        <p className="text-sm text-[#737373]">Sign in to your account to continue shopping</p>
      </div>

      {/* Form */}
      <div className="bg-white border border-[#E5E5E5] p-8">
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="input-label">Email Address</label>
            <input
              id="login-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-password" className="input-label mb-0">Password</label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-[#737373] hover:text-[#0A0A0A] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input pr-10"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#0A0A0A] transition-colors"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full btn-lg gap-2 mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#F2F2F2] text-center">
          <p className="text-sm text-[#737373]">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-semibold text-[#0A0A0A] hover:text-[#C9A84C] transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px] flex items-center justify-center px-4 py-16">
      <Suspense fallback={<div className="w-full max-w-md bg-white border border-[#E5E5E5] p-8 h-80 animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
