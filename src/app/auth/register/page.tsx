'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Registration failed')
      setLoading(false)
      return
    }

    // Auto sign-in after registration
    await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="font-display text-4xl tracking-widest text-[#0A0A0A] mb-1">MARVIN</div>
          <div className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase text-[#C9A84C]">THRIFTS</div>
          <h1 className="text-2xl font-bold mt-6 mb-2">Create your account</h1>
          <p className="text-sm text-[#737373]">Join thousands of sneaker lovers across Kenya</p>
        </div>

        <div className="bg-white border border-[#E5E5E5] p-8">
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reg-name" className="input-label">Full Name</label>
              <input id="reg-name" type="text" autoComplete="name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input" placeholder="Your full name" />
            </div>

            <div>
              <label htmlFor="reg-email" className="input-label">Email Address <span className="text-red-500">*</span></label>
              <input id="reg-email" type="email" autoComplete="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input" placeholder="you@example.com" />
            </div>

            <div>
              <label htmlFor="reg-phone" className="input-label">Phone Number (for WhatsApp orders)</label>
              <input id="reg-phone" type="tel" autoComplete="tel" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input" placeholder="07XX XXX XXX" />
            </div>

            <div>
              <label htmlFor="reg-password" className="input-label">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input id="reg-password" type={showPass ? 'text' : 'password'} autoComplete="new-password" required
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input pr-12" placeholder="Min 8 characters" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#0A0A0A] transition-colors"
                  aria-label={showPass ? 'Hide' : 'Show'}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-[#E5E5E5] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${
                      form.password.length < 8 ? 'w-1/3 bg-red-400' :
                      form.password.length < 12 ? 'w-2/3 bg-[#D97706]' : 'w-full bg-[#16A34A]'
                    }`} />
                  </div>
                  <span className="text-[0.65rem] text-[#737373]">
                    {form.password.length < 8 ? 'Too short' : form.password.length < 12 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="reg-confirm" className="input-label">Confirm Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input id="reg-confirm" type={showPass ? 'text' : 'password'} autoComplete="new-password" required
                  value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className="input pr-10" placeholder="Repeat your password" />
                {form.confirm && form.password === form.confirm && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#16A34A]" />
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} id="register-submit" className="btn btn-primary w-full btn-lg gap-3 mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E5E5E5] text-center">
            <p className="text-sm text-[#737373]">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold text-[#0A0A0A] hover:text-[#C9A84C] transition-colors">Sign in</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[0.7rem] text-[#A3A3A3] mt-6">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-[#737373]">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-[#737373]">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
