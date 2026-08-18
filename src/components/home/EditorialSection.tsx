import Image from 'next/image'
import Link from 'next/link'

export function EditorialSection() {
  return (
    <section className="relative min-h-[440px] sm:min-h-[520px] bg-[#0A0A0A] flex items-center overflow-hidden" aria-labelledby="editorial-heading">
      {/* Background Lifestyle Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/editorial-lifestyle.png"
          alt="Curated sneakers editorial lifestyle"
          fill
          priority={false}
          className="object-cover object-right sm:object-center opacity-80"
          sizes="100vw"
        />
        {/* Dark gradient for crisp text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/75 to-transparent sm:w-2/3" />
      </div>

      {/* Content */}
      <div className="container-brand relative z-10 py-16">
        <div className="max-w-md">
          <h2
            id="editorial-heading"
            className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-white tracking-wide mb-5"
          >
            ONE PAIR.<br />
            ONE STORY.
          </h2>

          <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8">
            Every pair has already lived a life.<br />
            We find the best ones and<br />
            give them another.
          </p>

          <Link
            href="/about"
            className="inline-block px-7 py-3 border border-white/60 hover:border-white text-white text-xs sm:text-sm font-bold uppercase tracking-[0.12em] transition-all duration-200 bg-black/30 backdrop-blur-sm"
          >
            OUR STORY
          </Link>
        </div>
      </div>
    </section>
  )
}
