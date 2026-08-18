'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Package, MapPin, CheckCircle, Clock, Truck, Home } from 'lucide-react'

interface OrderTimeline {
  status: string
  note: string | null
  createdAt: string
}

interface TrackResult {
  orderNumber: string
  status: string
  paymentStatus: string
  deliveryMethod: string
  total: number
  createdAt: string
  timeline: OrderTimeline[]
  address?: {
    town: string
    county: string
  } | null
}

const STATUS_STEPS = [
  { key: 'PENDING', label: 'Order Placed', icon: Package },
  { key: 'PAYMENT_CONFIRMED', label: 'Payment Confirmed', icon: CheckCircle },
  { key: 'PROCESSING', label: 'Processing', icon: Clock },
  { key: 'DISPATCHED', label: 'Dispatched', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: Home },
]

function getStepIndex(status: string) {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status)
  return idx === -1 ? 0 : idx
}

function formatPrice(n: number) {
  return `KSh ${n.toLocaleString('en-KE')}`
}

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TrackResult | null>(null)
  const [error, setError] = useState('')

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const res = await fetch(`/api/orders?orderNumber=${orderNumber.trim().toUpperCase()}&phone=${phone.trim()}`)
      const data = await res.json()

      if (!res.ok || !data.order) {
        setError('Order not found. Please check your order number and phone number.')
        return
      }

      setResult(data.order)
    } catch {
      setError('Unable to track order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentStep = result ? getStepIndex(result.status) : 0

  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
      <div className="bg-[#0A0A0A] py-16">
        <div className="container-brand">
          <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3">Order Status</div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-white leading-none">TRACK YOUR ORDER.</h1>
        </div>
      </div>

      <div className="container-brand py-12">
        <div className="max-w-2xl mx-auto">
          {/* Search form */}
          <div className="bg-white border border-[#E5E5E5] p-8 mb-8">
            <h2 className="font-semibold mb-5">Enter your order details</h2>
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label htmlFor="track-order" className="input-label">Order Number *</label>
                <input
                  id="track-order"
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="input font-mono uppercase"
                  placeholder="MT-XXXXX"
                />
              </div>
              <div>
                <label htmlFor="track-phone" className="input-label">Phone Number</label>
                <input
                  id="track-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input"
                  placeholder="07XX XXX XXX (used at checkout)"
                />
              </div>
              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
              )}
              <button type="submit" disabled={loading} className="btn btn-primary w-full gap-2">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Search className="w-4 h-4" />}
                {loading ? 'Tracking...' : 'Track Order'}
              </button>
            </form>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-white border border-[#E5E5E5] p-8 animate-fade-up">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-[0.65rem] text-[#737373] uppercase tracking-wide mb-1">Order</div>
                  <div className="font-display text-3xl">#{result.orderNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-[0.65rem] text-[#737373] uppercase tracking-wide mb-1">Total</div>
                  <div className="font-bold text-lg">{formatPrice(result.total)}</div>
                </div>
              </div>

              {/* Progress stepper */}
              <div className="relative mb-8">
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-[#E5E5E5]" />
                <div
                  className="absolute top-5 left-5 h-0.5 bg-[#C9A84C] transition-all duration-1000"
                  style={{ width: `calc(${(currentStep / (STATUS_STEPS.length - 1)) * 100}% - 2.5rem)` }}
                />
                <div className="relative flex justify-between">
                  {STATUS_STEPS.map(({ key, label, icon: Icon }, i) => {
                    const done = i <= currentStep
                    const active = i === currentStep
                    return (
                      <div key={key} className="flex flex-col items-center gap-2 flex-1">
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                          active ? 'border-[#C9A84C] bg-[#C9A84C] text-white' :
                          done ? 'border-[#C9A84C] bg-white text-[#C9A84C]' :
                          'border-[#D4D4D4] bg-white text-[#D4D4D4]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[0.62rem] text-center font-medium leading-tight ${
                          done ? 'text-[#0A0A0A]' : 'text-[#A3A3A3]'
                        }`}>{label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Order details */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#F9F9F9] p-4">
                  <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-[#737373] mb-1">Delivery Method</div>
                  <div className="text-sm font-medium">
                    {result.deliveryMethod === 'NAIROBI' ? '🚚 Nairobi Delivery' :
                     result.deliveryMethod === 'NATIONWIDE' ? '📦 Nationwide Courier' : '🏪 Pickup'}
                  </div>
                  {result.address && (
                    <div className="text-[0.72rem] text-[#737373] mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {result.address.town}, {result.address.county}
                    </div>
                  )}
                </div>
                <div className="bg-[#F9F9F9] p-4">
                  <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-[#737373] mb-1">Payment Status</div>
                  <div className={`text-sm font-semibold ${
                    result.paymentStatus === 'PAID' ? 'text-[#16A34A]' :
                    result.paymentStatus === 'PENDING' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {result.paymentStatus === 'PAID' ? '✓ Paid' :
                     result.paymentStatus === 'PENDING' ? '⏳ Awaiting Payment' : '✗ Payment Failed'}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {result.timeline.length > 0 && (
                <div>
                  <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-[#737373] mb-3">Updates</div>
                  <div className="space-y-3">
                    {[...result.timeline].reverse().map((t, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] mt-1.5 shrink-0" />
                        <div>
                          <div className="font-medium">{t.status.replace(/_/g, ' ')}</div>
                          {t.note && <div className="text-[#737373] text-xs">{t.note}</div>}
                          <div className="text-[#A3A3A3] text-xs">{new Date(t.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-[#E5E5E5]">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'}?text=${encodeURIComponent(`Hi! I'm enquiring about order #${result.orderNumber}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn bg-[#25D366] hover:bg-[#20BD5C] text-white w-full"
                >
                  Chat with us about this order
                </a>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-[#737373] mt-6">
            Signed in? <Link href="/account/orders" className="text-[#C9A84C] hover:text-[#A8892E]">View all your orders</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
