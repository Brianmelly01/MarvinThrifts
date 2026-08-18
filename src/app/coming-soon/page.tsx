import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Clock, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Coming Soon — Upcoming Drops & Expansions',
  description: 'Preview upcoming categories, new drops, and vintage clothing collections arriving soon at Marvin Thrifts.',
}

const upcomingCategories = [
  {
    title: 'Vintage Outerwear & Jackets',
    date: 'Dropping Q3 2026',
    tag: 'Apparel',
    description: 'Curated 90s and 2000s vintage windbreakers, bomber jackets, varsity jackets, and denim from Carhartt, Nike, and Ralph Lauren.',
  },
  {
    title: 'Archive Denim & Cargo Pants',
    date: 'Dropping Q3 2026',
    tag: 'Apparel',
    description: 'Washed selvedge denim, carpenter pants, and tactical streetwear bottoms chosen for fit and patina.',
  },
  {
    title: 'Rare Hype Footwear Vault',
    date: 'Weekly Releases',
    tag: 'Sneakers',
    description: 'High-heat collaborations including Travis Scott Jordan 1s, Off-White Nike Dunks, and Yeezy 700s.',
  },
  {
    title: 'Accessories & Streetwear Bags',
    date: 'Coming Soon',
    tag: 'Accessories',
    description: 'Vintage caps, cross-body bags, and authentic streetwear accessories.',
  },
]

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
      <div className="bg-[#0A0A0A] py-16 sm:py-24">
        <div className="container-brand">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-white/50 hover:text-white uppercase mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3">
            In The Pipeline
          </div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] text-white leading-none">
            FUTURE DROPS &amp; EXPANSIONS
          </h1>
          <p className="text-white/50 text-base max-w-lg mt-4">
            We started with footwear. We&apos;re expanding into full-look curated streetwear, vintage garments, and rare archive drops.
          </p>
        </div>
      </div>

      <div className="container-brand py-16">
        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl">
          {upcomingCategories.map((cat) => (
            <div
              key={cat.title}
              className="bg-white border border-[#E5E5E5] p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#0A0A0A] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[0.65rem] font-bold tracking-[0.15em] uppercase px-2.5 py-1 bg-[#0A0A0A] text-white">
                    {cat.tag}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[#C9A84C] font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    {cat.date}
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl text-[#0A0A0A] mb-3">
                  {cat.title}
                </h2>
                <p className="text-sm text-[#737373] leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#F2F2F2] flex items-center justify-between">
                <span className="text-xs text-[#A3A3A3] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                  Follow IG for early access
                </span>
                <a
                  href="https://instagram.com/marvinthrifts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:text-[#C9A84C] transition-colors"
                >
                  @marvinthrifts ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
