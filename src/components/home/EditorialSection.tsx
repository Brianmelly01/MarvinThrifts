import Image from 'next/image'
import Link from 'next/link'

export function EditorialSection() {
  return (
    <section className="bg-[#F5F4F0]" aria-labelledby="editorial-heading">
      {/* ONE PAIR. ONE STORY. */}
      <div className="grid lg:grid-cols-2 min-h-[520px]">
        {/* Image side */}
        <div className="relative min-h-[320px] lg:min-h-[520px] overflow-hidden bg-[#0A0A0A] order-2 lg:order-1">
          <Image
            src="/images/editorial-lifestyle.png"
            alt="Person wearing premium sneakers — editorial lifestyle shot"
            fill
            className="object-cover object-center opacity-90"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/30 to-transparent" />
        </div>

        {/* Text side */}
        <div className="flex flex-col justify-center px-8 sm:px-14 lg:px-16 py-16 lg:py-20 order-1 lg:order-2">
          <div className="text-[0.65rem] font-semibold tracking-[0.25em] uppercase text-[#C9A84C] mb-5">
            Our Story
          </div>
          <h2
            id="editorial-heading"
            className="font-display text-[clamp(3rem,7vw,6rem)] leading-none text-[#0A0A0A] mb-6"
          >
            ONE PAIR.<br />
            <span className="text-[#C9A84C]">ONE STORY.</span>
          </h2>
          <div className="w-12 h-0.5 bg-[#C9A84C] mb-6" />
          <p className="text-[#525252] text-base leading-relaxed mb-4 max-w-sm">
            Every pair has already lived a life. We find the best ones and give them another.
          </p>
          <p className="text-[#737373] text-sm leading-relaxed mb-8 max-w-sm">
            Marvin Thrifts was born from a simple belief: great style shouldn&apos;t cost the earth — 
            financially or environmentally. We curate the best pre-loved footwear in Kenya so you 
            can find your next favourite pair without compromise.
          </p>
          <Link href="/about" className="btn btn-outline self-start">
            Our Story
          </Link>
        </div>
      </div>

      {/* Style tagline strip */}
      <div className="bg-[#0A0A0A] py-8 text-center">
        <p className="font-display text-[clamp(1.2rem,4vw,2.5rem)] text-white/20 tracking-[0.2em] uppercase">
          GOOD STYLE SHOULD HAVE A SECOND LIFE.
        </p>
      </div>
    </section>
  )
}
