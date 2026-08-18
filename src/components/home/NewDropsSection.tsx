import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ui/ProductCard'

async function getNewDrops() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, sold: false },
      orderBy: [{ newArrival: 'desc' }, { createdAt: 'desc' }],
      take: 10,
      include: {
        brand: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
    })

    return products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand.name,
      price: p.price,
      salePrice: p.salePrice,
      imageUrl: p.images[0]?.url ?? '/images/placeholder-shoe.jpg',
      sizeEU: p.sizeEU,
      sizeUK: p.sizeUK,
      conditionScore: p.conditionScore,
      conditionLabel: p.conditionLabel,
      quantity: p.quantity,
      sold: p.sold,
      featured: p.featured,
      newArrival: p.newArrival,
      verified: p.verified,
    }))
  } catch {
    return []
  }
}

export async function NewDropsSection() {
  const products = await getNewDrops()

  if (products.length === 0) return null

  return (
    <section className="py-12 sm:py-16 bg-[#FFFFFF]" aria-labelledby="new-drops-heading">
      <div className="container-brand">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#F0EBE4]">
          <div className="flex items-center gap-2">
            <span className="text-[#C49E6C] text-sm">✦</span>
            <h2
              id="new-drops-heading"
              className="text-lg sm:text-xl font-bold tracking-[0.08em] uppercase text-[#0A0A0A]"
            >
              NEW DROPS
            </h2>
          </div>

          <Link
            href="/shop?sort=newest"
            className="flex items-center gap-1.5 text-[0.72rem] sm:text-xs font-bold tracking-[0.1em] uppercase text-[#0A0A0A] hover:text-[#C49E6C] transition-colors group"
          >
            VIEW ALL
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 5-column product grid on desktop, 2-column on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {products.slice(0, 5).map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 5} />
          ))}
        </div>
      </div>
    </section>
  )
}
