import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ui/ProductCard'

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, sold: false, featured: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: {
        brand: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
    })
    return products.map((p) => ({
      id: p.id, slug: p.slug, name: p.name, brand: p.brand.name,
      price: p.price, salePrice: p.salePrice,
      imageUrl: p.images[0]?.url ?? '/images/placeholder-shoe.jpg',
      sizeEU: p.sizeEU, sizeUK: p.sizeUK,
      conditionScore: p.conditionScore, conditionLabel: p.conditionLabel,
      quantity: p.quantity, sold: p.sold, featured: p.featured,
      newArrival: p.newArrival, verified: p.verified,
    }))
  } catch {
    return []
  }
}

export async function CuratedSection() {
  const products = await getFeaturedProducts()
  if (products.length === 0) return null

  return (
    <section className="section-padding bg-white" aria-labelledby="curated-heading">
      <div className="container-brand">
        <div className="text-center mb-12">
          <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3">
            Handpicked
          </div>
          <h2 id="curated-heading" className="font-display text-[clamp(2rem,4vw,4rem)] leading-none text-[#0A0A0A]">
            CURATED COLLECTION
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/shop" className="btn btn-primary btn-lg">
            Shop Full Collection
          </Link>
        </div>
      </div>
    </section>
  )
}
