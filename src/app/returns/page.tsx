import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageCircle, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Returns & Refund Policy — Marvin Thrifts',
  description: 'Understand our returns, exchange, and refund policies for thrifted and pre-loved footwear.',
}

export default function ReturnsPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'

  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
      <div className="bg-[#0A0A0A] py-16">
        <div className="container-brand">
          <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3">
            Customer Guarantee
          </div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-white leading-none">
            RETURNS &amp; REFUNDS
          </h1>
          <p className="text-white/40 text-xs mt-3 uppercase tracking-widest">
            Simple, Transparent, Fair
          </p>
        </div>
      </div>

      <div className="container-brand py-16 max-w-3xl">
        <div className="space-y-8">
          {/* Key Principles Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-[#E5E5E5] p-6 flex flex-col items-start">
              <ShieldCheck className="w-8 h-8 text-[#16A34A] mb-3" />
              <h3 className="font-bold text-sm uppercase tracking-wide mb-1">Authenticity Guarantee</h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                If an item received fails verified authenticity inspection, you are entitled to an immediate 100% full refund.
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-6 flex flex-col items-start">
              <RefreshCw className="w-8 h-8 text-[#C9A84C] mb-3" />
              <h3 className="font-bold text-sm uppercase tracking-wide mb-1">7-Day Misrepresentation Window</h3>
              <p className="text-xs text-[#737373] leading-relaxed">
                If a pair arrives with significant undisclosed damage not listed on the item card, notify us within 7 days.
              </p>
            </div>
          </div>

          {/* Policy Breakdown */}
          <div className="bg-white border border-[#E5E5E5] p-8 sm:p-12 space-y-6 text-sm text-[#525252] leading-relaxed">
            <section>
              <h2 className="font-bold text-base text-[#0A0A0A] uppercase tracking-wide mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#D97706]" /> Pre-Loved Specifics
              </h2>
              <p>
                Because our shoes are thrifted and 1-of-1, direct size exchanges for the exact same pair are usually impossible. We urge you to consult our detailed <Link href="/size-guide" className="text-[#C9A84C] font-semibold underline">Size Guide</Link> and <Link href="/condition-guide" className="text-[#C9A84C] font-semibold underline">Condition Ratings</Link> before purchasing.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-base text-[#0A0A0A] uppercase tracking-wide mb-2">
                Eligible Return Conditions
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Item has major structural defect not shown in listing photos or description.</li>
                <li>Wrong shoe model or incorrect size shipped compared to what was ordered.</li>
                <li>Item must be returned in the exact unworn condition it was received.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-base text-[#0A0A0A] uppercase tracking-wide mb-2">
                How to Initiate a Return
              </h2>
              <p>
                Reach out to our operations team on WhatsApp with your order number, photos of the issue, and description. We resolve all inquiries within 24 hours.
              </p>
            </section>

            <div className="pt-4">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Marvin Thrifts! I'd like to ask about a return or exchange for my order.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-[#25D366] hover:bg-[#20BD5C] text-white w-full sm:w-auto gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Returns Desk on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
