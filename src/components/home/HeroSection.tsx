'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      className="relative min-h-[90vh] lg:min-h-[92vh] flex items-center pt-24 pb-16 bg-[#0A0A0A] overflow-hidden"
      aria-label="Hero — Marvin Thrifts"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-jordan1.png"
          alt="Curated authentic pre-loved sneaker collection"
          fill
          priority
          quality={95}
          className="object-cover object-right sm:object-center lg:object-right scale-100 sm:scale-105 transition-transform duration-1000"
          sizes="100vw"
        />
        {/* Soft atmospheric gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent hidden lg:block" />
      </div>

      {/* Hero Content */}
      <div className="container-brand relative z-10 w-full pt-8 sm:pt-12">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Subtitle / Tagline */}
          <div className="text-[0.7rem] sm:text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#C49E6C] mb-4 sm:mb-6">
            PRE-LOVED. AUTHENTIC. ONE OF ONE.
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-[clamp(2.8rem,7.5vw,6rem)] leading-[0.95] text-white tracking-wide mb-6">
            FIND YOUR<br />
            <span className="text-[#C49E6C]">NEXT</span><br />
            FAVORITE<br />
            PAIR.
          </h1>

          {/* Subtext */}
          <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-md mb-8">
            Curated pre-loved footwear.<br />
            Quality checked. Ready for a second life.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/shop"
              className="h-12 sm:h-13 px-6 sm:px-8 bg-[#C49E6C] hover:bg-[#B38D5B] text-[#0A0A0A] text-xs sm:text-sm font-bold uppercase tracking-[0.12em] flex items-center justify-center gap-2 transition-all duration-200 shadow-lg"
            >
              <span className="hidden sm:inline">SHOP THE COLLECTION</span>
              <span className="sm:hidden">SHOP NOW</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/shop?sort=newest"
              className="h-12 sm:h-13 px-6 sm:px-8 border border-white/40 hover:border-white text-white text-xs sm:text-sm font-bold uppercase tracking-[0.12em] flex items-center justify-center transition-all duration-200 bg-black/20 backdrop-blur-sm"
            >
              NEW ARRIVALS
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Pagination Indicator Dots (Mockup match) */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-1.5 lg:hidden z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C49E6C]" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
      </div>
    </section>
  )
}
