import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import slugify from 'slugify'

function requireAdmin() {
  // Helper checked at route level
}

export async function GET() {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { brand: true, category: true, images: { where: { isPrimary: true }, take: 1 } },
  })

  return NextResponse.json({ products })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      name, sku, brandId, categoryId, price, salePrice,
      description, sizeEU, sizeUK, sizeUS, sizeCM,
      conditionScore, conditionLabel, conditionNotes,
      defects, creasing, soleCondition, insoleCondition, stains, accessories,
      colorMain, colorSecondary, featured, newArrival, verified, isActive, images,
    } = body

    // Generate slug
    const baseSlug = slugify(`${name}-${sizeEU || ''}`, { lower: true, strict: true })
    let slug = baseSlug
    let counter = 1
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku,
        brandId,
        categoryId,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        description: description || null,
        sizeEU: sizeEU || null,
        sizeUK: sizeUK || null,
        sizeUS: sizeUS || null,
        sizeCM: sizeCM || null,
        conditionScore: Number(conditionScore),
        conditionLabel,
        conditionNotes: conditionNotes || null,
        defects: defects || null,
        creasing: creasing || null,
        soleCondition: soleCondition || null,
        insoleCondition: insoleCondition || null,
        stains: stains || null,
        accessories: accessories || null,
        colorMain: colorMain || null,
        colorSecondary: colorSecondary || null,
        featured: Boolean(featured),
        newArrival: Boolean(newArrival),
        verified: Boolean(verified),
        isActive: Boolean(isActive),
        quantity: 1,
        images: images?.length > 0 ? {
          create: images.map((img: { url: string; isPrimary: boolean; altText?: string }, i: number) => ({
            url: img.url,
            isPrimary: img.isPrimary ?? i === 0,
            altText: img.altText || `${name} image ${i + 1}`,
            sortOrder: i,
          })),
        } : undefined,
      },
      include: { brand: true, images: true },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to create product'
    console.error('Admin product create error:', error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
