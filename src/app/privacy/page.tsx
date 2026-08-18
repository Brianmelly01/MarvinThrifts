import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Marvin Thrifts',
  description: 'Learn how Marvin Thrifts handles your personal data, order information, and privacy.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
      <div className="bg-[#0A0A0A] py-16">
        <div className="container-brand">
          <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3">
            Legal
          </div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-white leading-none">
            PRIVACY POLICY
          </h1>
          <p className="text-white/40 text-xs mt-3 uppercase tracking-widest">
            Last Updated: August 2026
          </p>
        </div>
      </div>

      <div className="container-brand py-16 max-w-3xl">
        <div className="bg-white border border-[#E5E5E5] p-8 sm:p-12 space-y-8 text-sm text-[#525252] leading-relaxed">
          <section>
            <h2 className="font-bold text-base text-[#0A0A0A] uppercase tracking-wide mb-3">
              1. Overview
            </h2>
            <p>
              At Marvin Thrifts, we respect your privacy and are committed to safeguarding the personal information you share with us when browsing our platform, placing orders, or communicating via WhatsApp or email.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-[#0A0A0A] uppercase tracking-wide mb-3">
              2. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Contact details:</strong> Name, phone number, and email address provided during checkout or account registration.</li>
              <li><strong>Delivery details:</strong> County, town, estate, building, and specific courier instructions.</li>
              <li><strong>Transaction metadata:</strong> M-Pesa transaction IDs and checkout confirmation codes (we never store or have access to your PIN).</li>
              <li><strong>Device & Usage:</strong> Analytics and browser details collected automatically to optimize your browsing experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-base text-[#0A0A0A] uppercase tracking-wide mb-3">
              3. How We Use Your Data
            </h2>
            <p>
              We process your data strictly to fulfill shoe orders, organize logistics and deliveries across Nairobi and Kenya, send status updates, provide authentic customer support, and improve our services.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-[#0A0A0A] uppercase tracking-wide mb-3">
              4. Data Sharing & Security
            </h2>
            <p>
              We do not sell your personal data to third parties. We share delivery information only with verified local dispatch riders and vetted courier partners (e.g. Fargo Courier, Wells Fargo, or dedicated bike riders) to ensure your package arrives safely.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-base text-[#0A0A0A] uppercase tracking-wide mb-3">
              5. Contact Us
            </h2>
            <p>
              If you have questions regarding this Privacy Policy or wish to request the deletion of your account records, please contact our support team at <a href="mailto:hello@marvinthrifts.co.ke" className="text-[#C9A84C] underline">hello@marvinthrifts.co.ke</a> or message us on WhatsApp.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
