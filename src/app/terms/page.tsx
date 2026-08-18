import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Marvin Thrifts',
  description: 'Terms and conditions for shopping curated pre-loved sneakers and footwear at Marvin Thrifts Kenya.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
      <div className="bg-[#0A0A0A] py-16">
        <div className="container-brand">
          <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3">
            Legal
          </div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-white leading-none">
            TERMS OF SERVICE
          </h1>
          <p className="text-white/40 text-xs mt-3 uppercase tracking-widest">
            Effective: August 2026
          </p>
        </div>
      </div>

      <div className="container-brand py-16 max-w-3xl">
        <div className="bg-white border border-[#E5E5E5] p-8 sm:p-12 space-y-8 text-sm text-[#525252] leading-relaxed">
          <section>
            <h2 className="font-bold text-base text-[#0A0A0A] uppercase tracking-wide mb-3">
              1. Nature of Products (One-of-One Pre-Loved)
            </h2>
            <p>
              Unless explicitly marked as &quot;Brand New / Deadstock&quot;, all items listed on Marvin Thrifts are unique, authenticated, pre-owned items (1-of-1 inventory). Once an item is sold, it cannot be duplicated or re-ordered in another size unless a similar pair is sourced.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-[#0A0A0A] uppercase tracking-wide mb-3">
              2. Condition Transparency & Sizing
            </h2>
            <p>
              We provide comprehensive photographs, condition scores (6–10 scale), and defect assessments for every listed shoe. It is the buyer&apos;s responsibility to review condition notes and size measurements prior to completing checkout.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-[#0A0A0A] uppercase tracking-wide mb-3">
              3. Orders, Payments & Inventory Reservation
            </h2>
            <p>
              Orders are confirmed upon successful payment verification via Safaricom M-Pesa or approved Cash on Delivery terms. If an M-Pesa transaction fails or is cancelled, the item is restored to public availability.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-[#0A0A0A] uppercase tracking-wide mb-3">
              4. Deliveries
            </h2>
            <p>
              Delivery times in Nairobi are typically 24–48 hours. Regional deliveries outside Nairobi are handled via courier within 2–4 business days. Free delivery applies to qualifying orders meeting the published threshold.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
