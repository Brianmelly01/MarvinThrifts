import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()
  const limit = Math.min(Number(searchParams.get('limit') || '6'), 20)

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [] })
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q } },
          { brand: { name: { contains: q } } },
          { description: { contains: q } },
          { sku: { contains: q } },
          { colorMain: { contains: q } },
        ],
      },
      take: limit,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      include: {
        brand: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
    })

    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        brand: p.brand.name,
        price: p.price,
        salePrice: p.salePrice,
        imageUrl: p.images[0]?.url ?? '/images/placeholder-shoe.jpg',
        sizeEU: p.sizeEU,
        sold: p.sold,
      })),
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ products: [] }, { status: 500 })
  }
}
