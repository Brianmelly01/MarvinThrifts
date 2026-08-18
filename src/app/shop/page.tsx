import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ShopClient } from '@/components/shop/ShopClient'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Shop — All Shoes',
  description: 'Browse our full collection of premium pre-loved sneakers, boots, and shoes. Carefully curated, quality checked, and ready for a second life.',
}

interface ShopPageProps {
  searchParams: Promise<{
    q?: string
    brand?: string | string[]
    size?: string | string[]
    condition?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    page?: string
    category?: string
  }>
}

async function getFilterData() {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({
      where: { products: { some: { isActive: true } } },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
    prisma.category.findMany({
      where: { products: { some: { isActive: true } } },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
  ])
  return { brands, categories }
}

async function getProducts(searchParams: Awaited<ShopPageProps['searchParams']>) {
  const {
    q, brand, size, condition, minPrice, maxPrice,
    sort = 'newest', page = '1', category
  } = searchParams

  const PAGE_SIZE = 20
  const skip = (Number(page) - 1) * PAGE_SIZE

  const brandArray = brand ? (Array.isArray(brand) ? brand : [brand]) : []
  const sizeArray = size ? (Array.isArray(size) ? size : [size]) : []

  const conditionRange = condition
    ? { '9-10': [9, 10], '8-9': [8, 8.9], '7-8': [7, 7.9], '6-7': [6, 6.9] }[condition]
    : null

  const where: NonNullable<Parameters<typeof prisma.product.findMany>[0]>['where'] = {
    isActive: true,
    ...(q && {
      OR: [
        { name: { contains: q } },
        { brand: { name: { contains: q } } },
        { description: { contains: q } },
        { sku: { contains: q } },
      ],
    }),
    ...(brandArray.length > 0 && { brand: { slug: { in: brandArray } } }),
    ...(category && { category: { slug: category } }),
    ...(sizeArray.length > 0 && { sizeEU: { in: sizeArray } }),
    ...(conditionRange && {
      conditionScore: { gte: conditionRange[0], lte: conditionRange[1] },
    }),
    ...(minPrice && { price: { gte: Number(minPrice) } }),
    ...(maxPrice && { price: { lte: Number(maxPrice) } }),
  }

  const orderBy: NonNullable<Parameters<typeof prisma.product.findMany>[0]>['orderBy'] = (() => {
    switch (sort) {
      case 'price-asc': return { price: 'asc' as const }
      case 'price-desc': return { price: 'desc' as const }
      case 'newest': return { createdAt: 'desc' as const }
      case 'oldest': return { createdAt: 'asc' as const }
      case 'featured': return { featured: 'desc' as const }
      default: return { createdAt: 'desc' as const }
    }
  })()

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: PAGE_SIZE,
      include: {
        brand: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
    }),
    prisma.product.count({ where }),
  ])

  return {
    products: products.map((p) => ({
      id: p.id, slug: p.slug, name: p.name, brand: p.brand.name,
      price: p.price, salePrice: p.salePrice,
      imageUrl: p.images[0]?.url ?? '/images/placeholder-shoe.jpg',
      sizeEU: p.sizeEU, sizeUK: p.sizeUK,
      conditionScore: p.conditionScore, conditionLabel: p.conditionLabel,
      quantity: p.quantity, sold: p.sold, featured: p.featured,
      newArrival: p.newArrival, verified: p.verified,
    })),
    total,
    pages: Math.ceil(total / PAGE_SIZE),
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams
  const [{ brands, categories }, { products, total, pages }] = await Promise.all([
    getFilterData(),
    getProducts(resolvedParams),
  ])

  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
      {/* Shop header */}
      <div className="bg-[#0A0A0A] py-12 sm:py-16">
        <div className="container-brand">
          <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3">
            Marvin Thrifts
          </div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none text-white">
            {resolvedParams.q ? `SEARCH: "${resolvedParams.q}"` :
             resolvedParams.brand ? resolvedParams.brand.toString().toUpperCase() :
             'ALL SHOES'}
          </h1>
          <p className="text-white/40 text-sm mt-2">
            {total} {total === 1 ? 'pair' : 'pairs'} available
          </p>
        </div>
      </div>

      <ShopClient
        initialProducts={products}
        brands={brands}
        categories={categories}
        total={total}
        pages={pages}
        searchParams={resolvedParams}
      />
    </div>
  )
}
