import { Star, ShieldCheck, Leaf, Truck } from 'lucide-react'

const trustItems = [
  {
    icon: Star,
    title: 'AUTHENTICITY CHECKED',
    description: 'Every item is verified',
  },
  {
    icon: ShieldCheck,
    title: 'QUALITY GUARANTEED',
    description: 'Carefully inspected',
  },
  {
    icon: Leaf,
    title: 'SUSTAINABLE CHOICE',
    description: 'Better fashion through reuse',
  },
  {
    icon: Truck,
    title: 'FAST DELIVERY',
    description: 'Nationwide across Kenya',
  },
]

export function TrustBar() {
  return (
    <section className="bg-[#FAF7F2] border-y border-[#EAE3DA]" aria-label="Our Guarantees">
      <div className="container-brand py-6 sm:py-7">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-0 lg:divide-x lg:divide-[#E5DDD2]">
          {trustItems.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-center gap-3 sm:gap-4 lg:px-6 first:pl-0 last:pr-0"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center text-[#0A0A0A]">
                <Icon className="w-5 h-5 text-[#0A0A0A]" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-[0.72rem] sm:text-[0.75rem] font-bold tracking-[0.08em] uppercase text-[#0A0A0A] leading-tight">
                  {title}
                </h3>
                <p className="text-[0.68rem] sm:text-[0.72rem] text-[#737373] mt-0.5">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
