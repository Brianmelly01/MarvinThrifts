'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Check, MapPin, CreditCard, Package, MessageCircle } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice, KENYA_COUNTIES } from '@/lib/utils'
import { cn } from '@/lib/cn'

const STEPS = ['Contact', 'Delivery', 'Payment', 'Confirm']

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, clearCart } = useCartStore()
  const subtotal = getSubtotal()

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState('')
  const [orderNumber, setOrderNumber] = useState('')

  const [contact, setContact] = useState({ name: '', email: '', phone: '' })
  const [address, setAddress] = useState({ county: '', town: '', estate: '', buildingName: '', instructions: '' })
  const [delivery, setDelivery] = useState<'NAIROBI' | 'NATIONWIDE' | 'PICKUP'>('NAIROBI')
  const [payment, setPayment] = useState<'MPESA' | 'CASH_ON_DELIVERY'>('MPESA')
  const [mpesaPhone, setMpesaPhone] = useState('')
  const [stkSent, setStkSent] = useState(false)

  const deliveryFee = delivery === 'NAIROBI' ? 200 : delivery === 'NATIONWIDE' ? 400 : 0
  const total = subtotal + deliveryFee

  if (items.length === 0 && !orderNumber) {
    return (
      <div className="min-h-screen bg-[#F5F4F0] pt-[88px] flex items-center justify-center">
        <div className="text-center py-16 px-4">
          <Package className="w-12 h-12 text-[#D4D4D4] mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Your bag is empty</h1>
          <p className="text-[#737373] mb-6">Add some items to proceed to checkout</p>
          <Link href="/shop" className="btn btn-primary">Shop Now</Link>
        </div>
      </div>
    )
  }

  // Order confirmed screen
  if (orderNumber) {
    return (
      <div className="min-h-screen bg-[#F5F4F0] pt-[88px] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg text-center">
          <div className="w-16 h-16 bg-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-4xl text-[#0A0A0A] mb-2">ORDER CONFIRMED</h1>
          <p className="text-[#737373] mb-6">Thank you for your order! We&apos;ll be in touch soon.</p>
          <div className="bg-white border border-[#E5E5E5] p-6 mb-6">
            <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-1">Order Number</div>
            <div className="font-display text-3xl text-[#0A0A0A]">#{orderNumber}</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/track?order=${orderNumber}`} className="btn btn-primary flex-1">Track Order</Link>
            <Link href="/shop" className="btn btn-outline flex-1">Continue Shopping</Link>
          </div>
          <p className="text-sm text-[#737373] mt-4">
            A confirmation has been sent to <strong>{contact.email}</strong>
          </p>
        </div>
      </div>
    )
  }

  async function placeOrder() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, price: i.salePrice ?? i.price })),
          deliveryMethod: delivery,
          address: delivery !== 'PICKUP' ? { fullName: contact.name, phone: contact.phone, ...address } : null,
          guestName: contact.name,
          guestEmail: contact.email,
          guestPhone: contact.phone,
          paymentMethod: payment,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Order failed')

      const newOrderId = data.order.id
      const newOrderNumber = data.order.orderNumber
      setOrderId(newOrderId)

      if (payment === 'MPESA') {
        // Initiate STK push
        const mpesaRes = await fetch('/api/payments/mpesa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: newOrderId, phone: mpesaPhone || contact.phone, amount: total }),
        })
        const mpesaData = await mpesaRes.json()

        if (!mpesaRes.ok) {
          // Order placed but payment pending — still show success
          console.warn('STK push failed:', mpesaData.error)
        } else {
          setStkSent(true)
        }
      }

      clearCart()
      setOrderNumber(newOrderNumber)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const stepValid = [
    () => contact.name && contact.email && contact.phone,
    () => delivery === 'PICKUP' || (address.county && address.town),
    () => payment === 'CASH_ON_DELIVERY' || mpesaPhone || contact.phone,
    () => true,
  ]

  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
      <div className="container-brand py-10">
        {/* Header */}
        <div className="mb-10">
          <Link href="/cart" className="flex items-center gap-2 text-sm text-[#737373] hover:text-[#0A0A0A] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to cart
          </Link>
          <h1 className="font-display text-4xl">CHECKOUT</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10 overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center shrink-0">
              <button
                onClick={() => i < step && setStep(i)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-[0.72rem] font-semibold tracking-wide uppercase transition-all',
                  i === step ? 'text-[#0A0A0A]' : i < step ? 'text-[#C9A84C] cursor-pointer' : 'text-[#A3A3A3] cursor-default'
                )}
              >
                <span className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border',
                  i === step ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' :
                  i < step ? 'bg-[#C9A84C] text-white border-[#C9A84C]' :
                  'border-[#D4D4D4] text-[#A3A3A3]'
                )}>
                  {i < step ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-[#E5E5E5]" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main form area */}
          <div className="lg:col-span-2 bg-white border border-[#E5E5E5] p-6 sm:p-8">
            {error && (
              <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
            )}

            {/* Step 0: Contact */}
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold mb-6">Contact Information</h2>
                <div>
                  <label htmlFor="co-name" className="input-label">Full Name *</label>
                  <input id="co-name" type="text" required value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className="input" placeholder="Your full name" />
                </div>
                <div>
                  <label htmlFor="co-email" className="input-label">Email Address *</label>
                  <input id="co-email" type="email" required value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="input" placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="co-phone" className="input-label">Phone Number *</label>
                  <input id="co-phone" type="tel" required value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="input" placeholder="07XX XXX XXX" />
                </div>
              </div>
            )}

            {/* Step 1: Delivery address */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold mb-6">Delivery Information</h2>
                <div className="grid grid-cols-3 gap-3">
                  {(['NAIROBI', 'NATIONWIDE', 'PICKUP'] as const).map((m) => (
                    <button key={m} onClick={() => setDelivery(m)}
                      className={cn('p-3 border-2 text-sm font-semibold text-center transition-all',
                        delivery === m ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white' : 'border-[#E5E5E5] hover:border-[#A3A3A3]')}>
                      <MapPin className="w-4 h-4 mx-auto mb-1" />
                      {m === 'NAIROBI' ? 'Nairobi' : m === 'NATIONWIDE' ? 'Nationwide' : 'Pickup'}
                      <div className="text-[0.65rem] font-normal mt-0.5">
                        {m === 'NAIROBI' ? 'KSh 200' : m === 'NATIONWIDE' ? 'KSh 400' : 'Free'}
                      </div>
                    </button>
                  ))}
                </div>

                {delivery !== 'PICKUP' && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <label htmlFor="addr-county" className="input-label">County *</label>
                      <select id="addr-county" value={address.county} onChange={(e) => setAddress({ ...address, county: e.target.value })} className="input">
                        <option value="">Select county</option>
                        {KENYA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="addr-town" className="input-label">Town/City *</label>
                      <input id="addr-town" type="text" required value={address.town} onChange={(e) => setAddress({ ...address, town: e.target.value })} className="input" placeholder="e.g. Westlands" />
                    </div>
                    <div>
                      <label htmlFor="addr-estate" className="input-label">Estate/Area</label>
                      <input id="addr-estate" type="text" value={address.estate} onChange={(e) => setAddress({ ...address, estate: e.target.value })} className="input" placeholder="e.g. Lavington" />
                    </div>
                    <div>
                      <label htmlFor="addr-building" className="input-label">Building/House/Office</label>
                      <input id="addr-building" type="text" value={address.buildingName} onChange={(e) => setAddress({ ...address, buildingName: e.target.value })} className="input" placeholder="e.g. Eden Heights, Apt 4B" />
                    </div>
                    <div>
                      <label htmlFor="addr-notes" className="input-label">Delivery Instructions</label>
                      <textarea id="addr-notes" value={address.instructions} onChange={(e) => setAddress({ ...address, instructions: e.target.value })} className="input h-20 py-3 resize-none" placeholder="Any special instructions for delivery?" />
                    </div>
                  </div>
                )}

                {delivery === 'PICKUP' && (
                  <div className="p-4 bg-[#F5F4F0] border border-[#E5E5E5] mt-4">
                    <p className="text-sm font-semibold mb-1">Pickup Location</p>
                    <p className="text-sm text-[#737373]">Nairobi CBD — exact address provided after order confirmation via WhatsApp</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div>
                <h2 className="text-lg font-bold mb-6">Payment Method</h2>
                <div className="space-y-3">
                  {(['MPESA', 'CASH_ON_DELIVERY'] as const).map((m) => (
                    <button key={m} onClick={() => setPayment(m)}
                      className={cn('w-full flex items-center gap-4 p-4 border-2 text-left transition-all',
                        payment === m ? 'border-[#0A0A0A] bg-[#F9F9F9]' : 'border-[#E5E5E5] hover:border-[#A3A3A3]')}>
                      <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                        payment === m ? 'border-[#0A0A0A]' : 'border-[#D4D4D4]')}>
                        {payment === m && <div className="w-2.5 h-2.5 rounded-full bg-[#0A0A0A]" />}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          {m === 'MPESA' ? '📱 M-Pesa' : '💵 Cash on Delivery'}
                        </div>
                        <div className="text-[0.72rem] text-[#737373]">
                          {m === 'MPESA' ? 'Pay instantly via M-Pesa STK Push' : 'Pay when you receive your order'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {payment === 'MPESA' && (
                  <div className="mt-5">
                    <label htmlFor="mpesa-phone" className="input-label">M-Pesa Phone Number</label>
                    <input id="mpesa-phone" type="tel" value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      className="input" placeholder={contact.phone || '07XX XXX XXX'} />
                    <p className="text-[0.72rem] text-[#737373] mt-1.5">Leave blank to use {contact.phone || 'your contact number'}</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div>
                <h2 className="text-lg font-bold mb-6">Review Your Order</h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-4">
                      <div className="w-14 h-16 bg-[#F5F5F5] shrink-0" />
                      <div className="flex-1">
                        <div className="text-[0.65rem] text-[#737373] uppercase tracking-wide">{item.brand}</div>
                        <div className="text-sm font-semibold">{item.name}</div>
                        <div className="text-[0.7rem] text-[#A3A3A3]">EU {item.size}</div>
                      </div>
                      <div className="text-sm font-bold">{formatPrice(item.salePrice ?? item.price)}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#E5E5E5] pt-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-[#737373]">Contact</span><span>{contact.name} · {contact.phone}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#737373]">Delivery</span><span>{delivery === 'PICKUP' ? 'Pickup' : `${address.town}, ${address.county}`}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#737373]">Payment</span><span>{payment === 'MPESA' ? 'M-Pesa' : 'Cash on Delivery'}</span></div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-[#E5E5E5]">
              {step > 0 ? (
                <button onClick={() => setStep(step - 1)} className="btn btn-outline gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : <div />}

              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => stepValid[step]() && setStep(step + 1)}
                  disabled={!stepValid[step]()}
                  className="btn btn-primary gap-2 disabled:opacity-40"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={placeOrder} disabled={loading} className="btn btn-gold btn-lg gap-2">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Placing order...
                    </span>
                  ) : (
                    <>Place Order — {formatPrice(total)} <CreditCard className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#E5E5E5] p-6 sticky top-24">
              <h2 className="text-sm font-bold tracking-[0.08em] uppercase mb-5">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-[#525252] truncate pr-2">{item.brand} {item.name}</span>
                    <span className="font-semibold shrink-0">{formatPrice(item.salePrice ?? item.price)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#E5E5E5] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#737373]">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#737373]">Delivery</span>
                  <span>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-[#E5E5E5] pt-3 mt-3">
                  <span>Total</span>
                  <span className="text-[#C9A84C]">{formatPrice(total)}</span>
                </div>
              </div>

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full mt-5 bg-[#25D366] hover:bg-[#20BD5C] text-white gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Order via WhatsApp
              </a>
              <p className="text-[0.65rem] text-[#A3A3A3] text-center mt-2">Prefer a personal touch? Chat with us directly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
