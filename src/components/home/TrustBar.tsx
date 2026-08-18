import { Shield, Star, Leaf, Truck } from 'lucide-react'

const trustItems = [
  {
    icon: Shield,
    title: 'Authenticity Checked',
    description: 'Every item is carefully inspected before listing.',
  },
  {
    icon: Star,
    title: 'Quality Guaranteed',
    description: 'We assess every pair so you know exactly what you get.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Choice',
    description: 'Better fashion through conscious reuse.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Nationwide delivery across Kenya.',
  },
]

export function TrustBar() {
  return (
    <section className="bg-white border-y border-[#E5E5E5]" aria-label="Why Marvin Thrifts">
      <div className="container-brand py-8 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-[#E5E5E5]">
        {trustItems.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:px-8 first:pl-0 last:pr-0">
            <div className="w-9 h-9 shrink-0 flex items-center justify-center border border-[#C9A84C]/30 bg-[#C9A84C]/5">
              <Icon className="w-4 h-4 text-[#C9A84C]" />
            </div>
            <div>
              <h2 className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-[#0A0A0A] mb-0.5">{title}</h2>
              <p className="text-[0.72rem] text-[#737373] leading-snug">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
