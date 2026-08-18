import Link from 'next/link'
import { Clock } from 'lucide-react'

const comingSoonCategories = [
  { name: 'Hoodies & Sweatshirts', emoji: '🧥' },
  { name: 'T-Shirts', emoji: '👕' },
  { name: 'Jeans & Trousers', emoji: '👖' },
  { name: 'Jackets', emoji: '🧣' },
  { name: 'Caps & Hats', emoji: '🧢' },
  { name: 'Bags & Accessories', emoji: '🎒' },
]

export function ComingSoonSection() {
  return (
    <section className="bg-[#F5F4F0] border-t border-[#E5E5E5]" aria-labelledby="coming-soon-heading">
      <div className="container-brand py-16 sm:py-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-5">
            <Clock className="w-4 h-4 text-[#C9A84C]" />
            <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C]">
              Coming Soon
            </span>
          </div>
          <h2 id="coming-soon-heading" className="font-display text-[clamp(2rem,5vw,4.5rem)] leading-none text-[#0A0A0A] mb-4">
            EXPANDING TO<br />CLOTHING &amp; MORE.
          </h2>
          <p className="text-[#737373] text-base max-w-lg mb-10 leading-relaxed">
            We&apos;re bringing the same curated, quality-first approach to clothing and accessories. 
            Sign up to be the first to know when new categories drop.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
            {comingSoonCategories.map(({ name, emoji }) => (
              <div
                key={name}
                className="flex items-center gap-3 px-4 py-3.5 border border-[#E5E5E5] bg-white opacity-60"
              >
                <span className="text-lg">{emoji}</span>
                <span className="text-sm font-medium text-[#0A0A0A]">{name}</span>
                <span className="ml-auto text-[0.6rem] font-bold tracking-[0.1em] uppercase text-[#A3A3A3] border border-[#E5E5E5] px-1.5 py-0.5">
                  Soon
                </span>
              </div>
            ))}
          </div>

          <form className="flex gap-0 max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="input flex-1 text-sm"
              aria-label="Email for early access"
            />
            <button
              type="submit"
              className="btn btn-primary px-6 shrink-0"
            >
              Notify Me
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
