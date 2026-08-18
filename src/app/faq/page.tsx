import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ — Frequently Asked Questions',
  description: 'Got questions about Marvin Thrifts? Find answers about our products, delivery, payments, returns, and more.',
}

const faqs = [
  {
    category: 'Shopping',
    questions: [
      {
        q: 'Are all your products authentic?',
        a: 'Yes. Every item we list is genuine. Items marked with "✓ Verified" have been through our full authenticity inspection process. For any item, if you have concerns, please reach out on WhatsApp before purchasing.',
      },
      {
        q: 'How do your condition scores work?',
        a: 'We rate every item from 6–10. A 10/10 is brand new or unworn. A 9–9.5 is like new, worn once or twice. An 8–8.5 is very good — clearly used but well maintained. A 7–7.5 is good with visible wear. A 6–6.5 is fair — functional but showing significant use. We are always honest about condition.',
      },
      {
        q: 'Do you get more stock regularly?',
        a: 'Yes! We add new items frequently. Follow our Instagram and subscribe to our newsletter to get notified about new drops first.',
      },
      {
        q: 'Can I reserve an item?',
        a: 'We generally operate on a first-come, first-served basis. If you need to arrange payment and are worried about stock, WhatsApp us directly and we can discuss.',
      },
    ],
  },
  {
    category: 'Delivery',
    id: 'delivery',
    questions: [
      {
        q: 'Where do you deliver?',
        a: 'We deliver across Kenya. Nairobi deliveries are handled by our own riders (1–2 days), and nationwide deliveries go via courier (3–5 business days). We also offer free pickup in Nairobi.',
      },
      {
        q: 'How much does delivery cost?',
        a: 'Nairobi delivery: KSh 200. Nationwide courier: KSh 400. Orders above KSh 5,000 qualify for free Nairobi delivery. Pickup is always free.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order is dispatched, we will send you a tracking update via WhatsApp or email. You can also track your order on our website using your order number.',
      },
    ],
  },
  {
    category: 'Payments',
    questions: [
      {
        q: 'How do I pay?',
        a: 'We accept M-Pesa (STK Push sent directly to your phone) and Cash on Delivery for Nairobi orders. You can also order directly via WhatsApp and we will send you M-Pesa payment details.',
      },
      {
        q: 'Is M-Pesa payment secure?',
        a: 'Yes, completely. M-Pesa payments go through Safaricom\'s official Daraja API. We never see your M-Pesa PIN.',
      },
      {
        q: 'What if my M-Pesa payment fails?',
        a: 'This can happen if you enter the wrong PIN or cancel the STK prompt. You can try again from your order confirmation page, or reach us on WhatsApp and we will sort it out immediately.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    questions: [
      {
        q: 'Do you accept returns?',
        a: 'We accept returns within 7 days if the item was significantly misrepresented. Since all items are pre-loved, we strongly encourage reviewing the condition details and photos carefully before purchasing. We are always transparent about any flaws.',
      },
      {
        q: 'What if I receive the wrong item?',
        a: 'That would be very unlikely, but if it happens, contact us immediately on WhatsApp. We will arrange collection and a full refund or exchange.',
      },
      {
        q: 'Can I exchange for a different size?',
        a: 'Since most items are one-of-a-kind, direct exchanges for a different size may not be possible. We can however help you find an alternative in your size.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
      <div className="bg-[#0A0A0A] py-16 sm:py-20">
        <div className="container-brand">
          <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3">Help Centre</div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-white leading-none">FREQUENTLY ASKED<br />QUESTIONS</h1>
        </div>
      </div>

      <div className="container-brand py-12 sm:py-16">
        <div className="max-w-3xl">
          {faqs.map(({ category, questions, id }) => (
            <section key={category} id={id} className="mb-12">
              <div className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-[#C9A84C] mb-5">{category}</div>
              <div className="space-y-3">
                {questions.map(({ q, a }) => (
                  <details key={q} className="bg-white border border-[#E5E5E5] group">
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none font-semibold text-sm hover:text-[#C9A84C] transition-colors">
                      {q}
                      <ChevronDown className="w-4 h-4 shrink-0 text-[#737373] group-open:rotate-180 transition-transform duration-200" />
                    </summary>
                    <div className="px-5 pb-5 text-sm text-[#525252] leading-relaxed border-t border-[#F2F2F2] pt-4">
                      {a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}

          {/* Still need help */}
          <div className="bg-[#0A0A0A] p-8 text-center">
            <h2 className="font-display text-3xl text-white mb-2">STILL HAVE QUESTIONS?</h2>
            <p className="text-white/50 text-sm mb-6">We&apos;re always happy to help. Reach out and we&apos;ll get back to you quickly.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'}`}
                target="_blank" rel="noopener noreferrer"
                className="btn bg-[#25D366] hover:bg-[#20BD5C] text-white"
              >
                WhatsApp Us
              </a>
              <Link href="/contact" className="btn btn-outline-white">Send a Message</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
