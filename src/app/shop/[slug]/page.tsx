import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ProductPageClient } from '@/components/shop/ProductPageClient'
import { formatPrice, parseDefects } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { brand: true, images: { where: { isPrimary: true }, take: 1 } },
  })
  if (!product) return { title: 'Product Not Found' }

  return {
    title: `${product.brand.name} ${product.name} — ${formatPrice(product.price)}`,
    description: product.description ||
      `${product.brand.name} ${product.name} in EU size ${product.sizeEU}. Condition: ${product.conditionScore}/10 — ${product.conditionLabel}. ${formatPrice(product.price)}.`,
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0].url, width: 800, height: 1067 }] : [],
    },
  }
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
      reviews: {
        where: { status: 'APPROVED' },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })
}

async function getRelatedProducts(brandId: string, currentId: string) {
  const products = await prisma.product.findMany({
    where: { brandId, id: { not: currentId }, isActive: true, sold: false },
    include: { brand: true, images: { where: { isPrimary: true }, take: 1 } },
    take: 4,
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
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const relatedProducts = await getRelatedProducts(product.brandId, product.id)

  const productData = {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    brand: product.brand.name,
    brandSlug: product.brand.slug,
    category: product.category.name,
    description: product.description ?? '',
    price: product.price,
    salePrice: product.salePrice ?? undefined,
    images: product.images.map((img) => ({ url: img.url, altText: img.altText ?? '' })),
    sizeEU: product.sizeEU ?? '',
    sizeUK: product.sizeUK ?? '',
    sizeUS: product.sizeUS ?? '',
    sizeCM: product.sizeCM ?? '',
    conditionScore: product.conditionScore,
    conditionLabel: product.conditionLabel,
    conditionNotes: product.conditionNotes ?? '',
    defects: parseDefects(product.defects),
    creasing: product.creasing ?? '',
    soleCondition: product.soleCondition ?? '',
    insoleCondition: product.insoleCondition ?? '',
    stains: product.stains ?? '',
    accessories: product.accessories ?? '',
    quantity: product.quantity,
    sold: product.sold,
    verified: product.verified,
    newArrival: product.newArrival,
    colorMain: product.colorMain ?? '',
    reviews: product.reviews.map((r) => ({
      id: r.id,
      userName: r.user.name ?? 'Anonymous',
      rating: r.rating,
      comment: r.comment ?? '',
      verified: r.verified,
      createdAt: r.createdAt.toISOString(),
    })),
  }

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.brand.name} ${product.name}`,
    description: product.description ?? '',
    image: product.images[0]?.url,
    offers: {
      '@type': 'Offer',
      price: (product.salePrice ?? product.price).toString(),
      priceCurrency: 'KES',
      availability: product.sold ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Marvin Thrifts' },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
        <ProductPageClient product={productData} relatedProducts={relatedProducts} />
      </div>
    </>
  )
}
