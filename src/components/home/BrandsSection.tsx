import Link from 'next/link'
import { prisma } from '@/lib/prisma'

const brandColors: Record<string, string> = {
  Nike: 'hover:text-[#FF6B35]',
  Adidas: 'hover:text-[#0A0A0A]',
  Jordan: 'hover:text-[#DC2626]',
  'New Balance': 'hover:text-[#C9A84C]',
  Converse: 'hover:text-[#0A0A0A]',
  Vans: 'hover:text-[#E31837]',
  Puma: 'hover:text-[#FFC107]',
  Reebok: 'hover:text-[#DC2626]',
  ASICS: 'hover:text-[#1A6EBF]',
  Timberland: 'hover:text-[#8B6914]',
  'Dr. Martens': 'hover:text-[#FFD700]',
}

async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      where: { products: { some: { isActive: true, sold: false } } },
      include: { _count: { select: { products: { where: { isActive: true, sold: false } } } } },
      orderBy: { name: 'asc' },
      take: 12,
    })
    return brands
  } catch {
    return []
  }
}

export async function BrandsSection() {
  const brands = await getBrands()

  const defaultBrands = [
    'Nike', 'Adidas', 'Jordan', 'New Balance', 'Converse',
    'Vans', 'Puma', 'Reebok', 'ASICS', 'Timberland',
  ]

  const displayBrands = brands.length > 0
    ? brands.map((b) => ({ name: b.name, slug: b.slug, count: b._count.products }))
    : defaultBrands.map((name) => ({ name, slug: name.toLowerCase().replace(/\s+/g, '-'), count: 0 }))

  return (
    <section className="bg-[#0A0A0A] py-16 sm:py-20" aria-labelledby="brands-heading">
      <div className="container-brand">
        <div className="mb-10 text-center">
          <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3">
            What We Carry
          </div>
          <h2 id="brands-heading" className="font-display text-[clamp(2rem,4vw,3.5rem)] text-white leading-none">
            SHOP BY BRAND
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {displayBrands.map(({ name, slug, count }) => (
            <Link
              key={slug}
              href={`/brands/${slug}`}
              className={`group flex items-center gap-2 px-5 py-3 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#C9A84C]/40 transition-all duration-200 text-white ${brandColors[name] ?? 'hover:text-white'}`}
            >
              <span className="text-sm font-semibold tracking-wide">{name}</span>
              {count > 0 && (
                <span className="text-[0.6rem] text-white/30 group-hover:text-white/50 transition-colors">
                  ({count})
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/brands"
            className="btn btn-outline-white"
          >
            View All Brands
          </Link>
        </div>
      </div>
    </section>
  )
}
