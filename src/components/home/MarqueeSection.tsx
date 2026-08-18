export function MarqueeSection() {
  const words = [
    'CURATED', '·', 'CHECKED', '·', 'AUTHENTIC', '·', 'PRE-LOVED', '·',
    'KENYA', '·', 'PREMIUM', '·', 'ONE OF ONE', '·', 'SUSTAINABLE', '·',
    'CURATED', '·', 'CHECKED', '·', 'AUTHENTIC', '·', 'PRE-LOVED', '·',
    'KENYA', '·', 'PREMIUM', '·', 'ONE OF ONE', '·', 'SUSTAINABLE', '·',
  ]

  return (
    <div className="bg-[#0A0A0A] py-5 overflow-hidden border-t border-white/5" aria-hidden="true">
      <div className="marquee-wrapper">
        <div className="marquee-track">
          {words.map((word, i) => (
            <span
              key={i}
              className={`font-display text-lg tracking-[0.15em] uppercase mx-4 ${
                word === '·' ? 'text-[#C9A84C]' : 'text-white/20'
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
