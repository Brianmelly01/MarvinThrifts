import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Shield, Recycle, Heart, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us — Our Story',
  description: 'Learn about Marvin Thrifts — Kenya\'s premium curated pre-loved footwear destination. Our story, mission, and commitment to sustainable fashion.',
}

const values = [
  { icon: Shield, title: 'Authenticity First', description: 'Every pair is personally inspected. If we wouldn\'t wear it ourselves, we won\'t sell it.' },
  { icon: Recycle, title: 'Sustainable Fashion', description: 'Pre-loved footwear is better for the planet. Each pair re-sold saves resources and reduces waste.' },
  { icon: Heart, title: 'Community', description: 'We\'re building a community of sneaker lovers across Kenya who believe in quality over hype.' },
  { icon: MapPin, title: 'Made in Kenya', description: 'Born and raised in Nairobi. We understand what Kenyan fashion lovers want.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
      {/* Hero */}
      <section className="bg-[#0A0A0A] py-24 sm:py-32 relative overflow-hidden">
        <div className="container-brand relative z-10">
          <div className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase text-[#C9A84C] mb-4">Our Story</div>
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-none text-white mb-6 max-w-3xl">
            WE BELIEVE GREAT STYLE DESERVES A SECOND LIFE.
          </h1>
          <div className="w-12 h-0.5 bg-[#C9A84C]" />
        </div>
        <div className="absolute inset-0 bg-[url('/images/hero-jordan1.png')] bg-cover bg-center opacity-10" />
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-brand">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-4">How it started</div>
              <h2 id="story" className="font-display text-5xl leading-none text-[#0A0A0A] mb-6">THE ORIGIN.</h2>
              <div className="space-y-4 text-[#525252] leading-relaxed">
                <p>
                  Marvin Thrifts started with a simple frustration: finding quality sneakers in Kenya shouldn&apos;t
                  require flying to London or scrolling through unreliable Instagram pages for hours.
                </p>
                <p>
                  We started curating the best pre-loved footwear — carefully selecting, inspecting, and
                  photographing every pair before it goes live. No surprises. No disappointments.
                </p>
                <p>
                  Today, we&apos;re Kenya&apos;s go-to destination for premium pre-loved footwear, serving customers
                  across Nairobi and the whole country.
                </p>
              </div>
            </div>
            <div className="relative h-80 lg:h-auto lg:aspect-[4/5] bg-[#0A0A0A] overflow-hidden">
              <Image
                src="/images/editorial-lifestyle.png"
                alt="Marvin Thrifts — our story"
                fill
                className="object-cover opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="sustainability" className="bg-white py-16 sm:py-20 border-y border-[#E5E5E5]">
        <div className="container-brand">
          <div className="text-center mb-14">
            <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3">What we stand for</div>
            <h2 className="font-display text-4xl sm:text-5xl text-[#0A0A0A]">OUR VALUES.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col items-start">
                <div className="w-10 h-10 border border-[#C9A84C]/30 bg-[#C9A84C]/5 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#C9A84C]" />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wide text-[#0A0A0A] mb-2">{title}</h3>
                <p className="text-sm text-[#737373] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding">
        <div className="container-brand">
          <div className="text-center mb-14">
            <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3">How we do it</div>
            <h2 className="font-display text-4xl sm:text-5xl text-[#0A0A0A]">THE PROCESS.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'We source', body: 'We find the best pre-loved pairs from trusted sellers, collectors, and enthusiasts across Kenya.' },
              { step: '02', title: 'We inspect', body: 'Every single item is photographed, measured, and assessed for condition. We score everything from 6–10.' },
              { step: '03', title: 'You shop', body: 'Browse our curated selection with full confidence. Every listing is honest, accurate, and fair-priced.' },
            ].map(({ step, title, body }) => (
              <div key={step} className="border border-[#E5E5E5] bg-white p-8">
                <div className="font-display text-5xl text-[#C9A84C]/30 mb-4">{step}</div>
                <h3 className="font-bold text-lg mb-3">{title}</h3>
                <p className="text-[#737373] text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A0A0A] py-16 text-center">
        <div className="container-brand">
          <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">READY TO SHOP?</h2>
          <p className="text-white/50 mb-8">Explore our current collection and find your next favourite pair.</p>
          <Link href="/shop" className="btn btn-gold btn-lg">Browse Collection</Link>
        </div>
      </section>
    </div>
  )
}
