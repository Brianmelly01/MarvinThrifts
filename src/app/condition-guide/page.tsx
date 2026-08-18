import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Condition Guide — Understanding Our Ratings',
  description: 'Learn how Marvin Thrifts rates the condition of pre-loved footwear with our transparent 10-point scoring system.',
}

const conditions = [
  {
    score: '10 / 10',
    label: 'Brand New / Deadstock',
    color: 'bg-emerald-500',
    description: 'Unworn and in original packaging. Tags still attached. Absolutely perfect in every way.',
    examples: ['Unworn with original box and all accessories', 'Pulled from storage, never laced up', 'Factory defect-free'],
  },
  {
    score: '9 – 9.5',
    label: 'Like New / Excellent',
    color: 'bg-green-500',
    description: 'Worn once or twice on very clean surfaces. No visible defects. Minimal to no creasing.',
    examples: ['Light try-on at home or brief outdoor wear', 'Clean uppers with no stains', 'No meaningful sole wear'],
  },
  {
    score: '8 – 8.5',
    label: 'Very Good',
    color: 'bg-lime-500',
    description: 'Light regular use. May have minor toe box creasing. Uppers are clean with very minor marks.',
    examples: ['10–20 wears', 'Minor toe box creasing', 'Clean midsole with light outsole wear', 'No visible stains'],
  },
  {
    score: '7 – 7.5',
    label: 'Good',
    color: 'bg-yellow-500',
    description: 'Regular use visible but well-maintained. Noticeable creasing and light scuffs possible.',
    examples: ['20–50 wears', 'Noticeable but not severe creasing', 'Some outsole wear', 'Minor marks that don\'t affect appearance from a distance'],
  },
  {
    score: '6 – 6.5',
    label: 'Fair',
    color: 'bg-orange-500',
    description: 'Significant wear. Functional and wearable, but clear signs of use throughout.',
    examples: ['Heavily worn', 'Significant creasing', 'Possible scuffs or stains noted in listing', 'Priced accordingly'],
  },
]

export default function ConditionGuidePage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
      <div className="bg-[#0A0A0A] py-14">
        <div className="container-brand">
          <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3">Transparency</div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-white leading-none">CONDITION GUIDE.</h1>
        </div>
      </div>

      <div className="container-brand py-12">
        <div className="max-w-3xl">
          <div className="bg-white border border-[#E5E5E5] p-8 mb-8">
            <h2 className="font-bold text-lg mb-3">Our Promise</h2>
            <p className="text-[#525252] text-sm leading-relaxed">
              We rate every item personally and honestly. Every condition note you read was written
              by us after holding and inspecting the actual pair. We will always disclose any flaw — however minor —
              so you know exactly what you&apos;re getting before you buy.
            </p>
          </div>

          <div className="space-y-4">
            {conditions.map(({ score, label, color, description, examples }) => (
              <div key={score} className="bg-white border border-[#E5E5E5] overflow-hidden">
                <div className="flex items-center gap-5 p-5 border-b border-[#F2F2F2]">
                  <div className="flex flex-col items-center w-16 shrink-0">
                    <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white font-bold text-xs mb-1.5`}>
                      {score.split(' ')[0]}
                    </div>
                    <div className="condition-bar w-16">
                      <div
                        className={`condition-bar-fill ${color}`}
                        style={{ width: `${(parseFloat(score.split(' ')[0]) / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-base">{label}</div>
                    <div className="text-[0.65rem] text-[#C9A84C] font-semibold tracking-wide">Score: {score}</div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-[#525252] mb-4">{description}</p>
                  <ul className="space-y-1.5">
                    {examples.map((ex) => (
                      <li key={ex} className="flex items-start gap-2 text-sm text-[#737373]">
                        <span className="text-[#C9A84C] mt-0.5">›</span> {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-[#0A0A0A] p-8">
            <h3 className="font-display text-2xl text-white mb-2">WHAT WE ALWAYS DISCLOSE</h3>
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              {['Toe box creasing', 'Sole wear level', 'Any stains or marks', 'Insole condition', 'Missing accessories', 'Any structural defects', 'Heel drag', 'Paint or colour loss'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-white/70 text-sm">
                  <span className="text-[#C9A84C]">✓</span> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#737373] mb-3">Have questions about a specific item&apos;s condition?</p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'}`}
              target="_blank" rel="noopener noreferrer"
              className="btn bg-[#25D366] hover:bg-[#20BD5C] text-white"
            >
              Ask on WhatsApp — we always reply
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
