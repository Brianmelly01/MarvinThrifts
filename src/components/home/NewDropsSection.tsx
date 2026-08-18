import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ui/ProductCard'

async function getNewDrops() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, sold: false },
      orderBy: [{ newArrival: 'desc' }, { createdAt: 'desc' }],
      take: 8,
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
    <section className="section-padding bg-[#F5F4F0]" aria-labelledby="new-drops-heading">
      <div className="container-brand">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-2">
              Just Landed
            </div>
            <h2
              id="new-drops-heading"
              className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-[#0A0A0A]"
            >
              NEW DROPS
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="hidden sm:flex items-center gap-2 text-[0.75rem] font-semibold tracking-[0.1em] uppercase text-[#0A0A0A] hover:text-[#C9A84C] transition-colors group"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 sm:hidden text-center">
          <Link href="/shop?sort=newest" className="btn btn-outline btn-lg w-full">
            View All New Drops
          </Link>
        </div>
      </div>
    </section>
  )
}
