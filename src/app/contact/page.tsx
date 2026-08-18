'use client'

import { useState } from 'react'
import { MessageCircle, Mail, Phone, MapPin, Check } from 'lucide-react'
import { InstagramIcon } from '@/components/ui/Icons'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // WhatsApp-based contact (simulated — in prod you'd call a Resend email route)
      await new Promise((r) => setTimeout(r, 800))
      setSent(true)
    } catch {
      setError('Something went wrong. Please try WhatsApp instead.')
    } finally {
      setLoading(false)
    }
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'
  const whatsappMsg = encodeURIComponent(`Hi Marvin Thrifts! I have a question:\n\nName: ${form.name}\nSubject: ${form.subject}\nMessage: ${form.message}`)

  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
      <div className="bg-[#0A0A0A] py-16 sm:py-20">
        <div className="container-brand">
          <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3">Get in touch</div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-white leading-none">CONTACT US.</h1>
        </div>
      </div>

      <div className="container-brand py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Contact info */}
          <div>
            <p className="text-[#525252] text-sm leading-relaxed mb-8 max-w-md">
              The fastest way to reach us is on WhatsApp — we typically respond within minutes during business hours.
              For general enquiries, use the form below.
            </p>

            <div className="space-y-5 mb-10">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/15 transition-colors group"
              >
                <div className="w-10 h-10 bg-[#25D366] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#25D366]">WhatsApp (Fastest)</div>
                  <div className="text-sm text-[#0A0A0A] font-medium">+{whatsappNumber}</div>
                </div>
              </a>

              <a
                href="https://instagram.com/marvinthrifts"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 border border-[#E5E5E5] bg-white hover:border-[#C9A84C] transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                  <InstagramIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#737373]">Instagram DMs</div>
                  <div className="text-sm text-[#0A0A0A] font-medium">@marvinthrifts</div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 border border-[#E5E5E5] bg-white">
                <div className="w-10 h-10 bg-[#0A0A0A] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#737373]">Email</div>
                  <div className="text-sm text-[#0A0A0A] font-medium">hello@marvinthrifts.co.ke</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border border-[#E5E5E5] bg-white">
                <div className="w-10 h-10 bg-[#F5F4F0] border border-[#E5E5E5] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#C9A84C]" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#737373]">Pickup Location</div>
                  <div className="text-sm text-[#0A0A0A] font-medium">Nairobi CBD — exact address on order confirmation</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border border-[#E5E5E5] bg-white">
                <div className="w-10 h-10 bg-[#F5F4F0] border border-[#E5E5E5] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#C9A84C]" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#737373]">Business Hours</div>
                  <div className="text-sm text-[#0A0A0A] font-medium">Mon – Sat: 9 AM – 7 PM EAT</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact form */}
          <div className="bg-white border border-[#E5E5E5] p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-14 h-14 bg-[#16A34A] rounded-full flex items-center justify-center mb-4">
                  <Check className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-bold text-xl mb-2">Message Received!</h2>
                <p className="text-[#737373] text-sm mb-6">We&apos;ll get back to you within 24 hours. Or WhatsApp us for an instant response.</p>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn bg-[#25D366] hover:bg-[#20BD5C] text-white"
                >
                  Continue on WhatsApp
                </a>
              </div>
            ) : (
              <>
                <h2 className="font-bold text-lg mb-6">Send us a message</h2>
                {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ct-name" className="input-label">Name *</label>
                      <input id="ct-name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Your name" />
                    </div>
                    <div>
                      <label htmlFor="ct-phone" className="input-label">Phone</label>
                      <input id="ct-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="07XX..." />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="ct-email" className="input-label">Email *</label>
                    <input id="ct-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label htmlFor="ct-subject" className="input-label">Subject *</label>
                    <select id="ct-subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input">
                      <option value="">Select a topic</option>
                      <option>Order enquiry</option>
                      <option>Product question</option>
                      <option>Delivery question</option>
                      <option>Return / refund</option>
                      <option>Sell your sneakers</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="ct-message" className="input-label">Message *</label>
                    <textarea id="ct-message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input h-32 py-3 resize-none" placeholder="Tell us how we can help..." />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={loading} className="btn btn-primary flex-1 gap-2">
                      {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! ${form.message || 'I have a question.'}`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="btn bg-[#25D366] hover:bg-[#20BD5C] text-white"
                      title="Chat on WhatsApp instead"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </a>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
