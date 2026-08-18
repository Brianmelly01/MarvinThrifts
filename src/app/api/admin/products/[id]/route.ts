import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true, brand: true, category: true },
  })

  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ product })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const {
      name,
      sku,
      brandId,
      categoryId,
      price,
      salePrice,
      description,
      sizeEU,
      sizeUK,
      sizeUS,
      sizeCM,
      conditionScore,
      conditionLabel,
      conditionNotes,
      defects,
      creasing,
      soleCondition,
      insoleCondition,
      stains,
      accessories,
      colorMain,
      colorSecondary,
      featured,
      newArrival,
      verified,
      isActive,
      sold,
      quantity,
    } = body

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(sku !== undefined && { sku }),
        ...(brandId !== undefined && { brandId }),
        ...(categoryId !== undefined && { categoryId }),
        ...(price !== undefined && { price: Number(price) }),
        ...(salePrice !== undefined && { salePrice: salePrice ? Number(salePrice) : null }),
        ...(description !== undefined && { description }),
        ...(sizeEU !== undefined && { sizeEU }),
        ...(sizeUK !== undefined && { sizeUK }),
        ...(sizeUS !== undefined && { sizeUS }),
        ...(sizeCM !== undefined && { sizeCM }),
        ...(conditionScore !== undefined && { conditionScore: Number(conditionScore) }),
        ...(conditionLabel !== undefined && { conditionLabel }),
        ...(conditionNotes !== undefined && { conditionNotes }),
        ...(defects !== undefined && { defects }),
        ...(creasing !== undefined && { creasing }),
        ...(soleCondition !== undefined && { soleCondition }),
        ...(insoleCondition !== undefined && { insoleCondition }),
        ...(stains !== undefined && { stains }),
        ...(accessories !== undefined && { accessories }),
        ...(colorMain !== undefined && { colorMain }),
        ...(colorSecondary !== undefined && { colorSecondary }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(newArrival !== undefined && { newArrival: Boolean(newArrival) }),
        ...(verified !== undefined && { verified: Boolean(verified) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(sold !== undefined && { sold: Boolean(sold) }),
        ...(quantity !== undefined && { quantity: Number(quantity) }),
      },
    })

    return NextResponse.json({ product })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Update failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Delete failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
