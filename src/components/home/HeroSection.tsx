'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)

  // Subtle parallax on scroll
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const handleScroll = () => {
      const scrollY = window.scrollY
      const img = el.querySelector('.hero-bg-img') as HTMLElement
      if (img) img.style.transform = `scale(1.05) translateY(${scrollY * 0.25}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative h-screen min-h-[600px] max-h-[1000px] flex items-end overflow-hidden bg-[#0A0A0A]"
      aria-label="Hero — Marvin Thrifts"
    >
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/hero-jordan1.png"
          alt="Premium pre-loved sneakers"
          fill
          priority
          quality={90}
          className="hero-bg-img object-cover object-center scale-105"
          sizes="100vw"
        />
        {/* Layered overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-brand pb-16 sm:pb-20 lg:pb-24 w-full">
        <div className="max-w-3xl">
          {/* Tagline */}
          <div
            className="flex items-center gap-3 mb-5 animate-fade-up"
            style={{ animationDelay: '200ms', animationFillMode: 'both' }}
          >
            <div className="h-px w-10 bg-[#C9A84C]" />
            <span className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase text-[#C9A84C]">
              Pre-Loved · Authentic · One of One
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-[clamp(3.5rem,10vw,8rem)] leading-none text-white mb-6 animate-fade-up"
            style={{ animationDelay: '350ms', animationFillMode: 'both' }}
          >
            FIND YOUR<br />
            <span className="text-[#C9A84C]">NEXT</span><br />
            FAVORITE PAIR.
          </h1>

          {/* Supporting copy */}
          <p
            className="text-[#F5F4F0]/70 text-base sm:text-lg max-w-md leading-relaxed mb-8 animate-fade-up"
            style={{ animationDelay: '500ms', animationFillMode: 'both' }}
          >
            Curated pre-loved footwear.<br />
            Quality checked. Ready for a second life.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap items-center gap-4 animate-fade-up"
            style={{ animationDelay: '650ms', animationFillMode: 'both' }}
          >
            <Link
              href="/shop"
              id="hero-shop-cta"
              className="btn btn-gold btn-lg gap-3 group"
            >
              Shop the Collection
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/shop?sort=newest"
              id="hero-new-arrivals-cta"
              className="btn btn-outline-white btn-lg"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 right-6 sm:right-10 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-10 bg-white/50 animate-pulse" />
        <span className="text-[0.6rem] text-white tracking-[0.2em] uppercase rotate-90 origin-center mt-4">Scroll</span>
      </div>
    </section>
  )
}
