import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { generateOrderNumber, getDeliveryFee } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()

    const {
      items,            // [{ productId, price }]
      deliveryMethod,   // 'NAIROBI' | 'NATIONWIDE' | 'PICKUP'
      address,          // { fullName, phone, county, town, estate, buildingName, instructions }
      guestName,
      guestEmail,
      guestPhone,
      couponCode,
      paymentMethod,    // 'MPESA' | 'CASH_ON_DELIVERY'
      notes,
    } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 })
    }

    // ── Validate inventory in a transaction ──────────────────────────
    const result = await prisma.$transaction(async (tx) => {
      // Lock and validate each product
      const productIds = items.map((i: { productId: string }) => i.productId)
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, isActive: true },
      })

      const unavailable: string[] = []
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId)
        if (!product || product.sold || product.quantity < 1) {
          unavailable.push(item.productId)
        }
      }

      if (unavailable.length > 0) {
        throw new Error(`UNAVAILABLE:${unavailable.join(',')}`)
      }

      // Validate coupon
      let couponDiscount = 0
      let couponId: string | null = null
      if (couponCode) {
        const coupon = await tx.coupon.findFirst({
          where: {
            code: couponCode.toUpperCase(),
            isActive: true,
            AND: [
              { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
            ],
          },
        })
        if (coupon && (coupon.maxUses === null || coupon.usedCount < coupon.maxUses)) {
          const subtotal = items.reduce((s: number, i: { price: number }) => s + i.price, 0)
          if (!coupon.minOrderValue || subtotal >= coupon.minOrderValue) {
            couponId = coupon.id
            couponDiscount = coupon.type === 'PERCENTAGE'
              ? Math.floor(subtotal * (coupon.value / 100))
              : coupon.value
          }
        }
      }

      // Calculate totals
      const subtotal = items.reduce((s: number, i: { price: number }) => s + i.price, 0)
      const deliveryFee = getDeliveryFee(deliveryMethod)
      const total = Math.max(0, subtotal - couponDiscount + deliveryFee)

      // Create or resolve address
      let addressId: string | null = null
      if (address && deliveryMethod !== 'PICKUP') {
        const addr = await tx.address.create({
          data: {
            userId: session?.user?.id ?? null,
            fullName: address.fullName,
            phone: address.phone,
            county: address.county,
            town: address.town,
            estate: address.estate ?? null,
            buildingName: address.buildingName ?? null,
            instructions: address.instructions ?? null,
          },
        })
        addressId = addr.id
      }

      // Create order
      const order = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session?.user?.id ?? null,
          addressId,
          status: 'PENDING',
          paymentStatus: 'UNPAID',
          deliveryMethod,
          deliveryFee,
          subtotal,
          total,
          couponId,
          couponDiscount,
          guestName: guestName ?? null,
          guestEmail: guestEmail ?? null,
          guestPhone: guestPhone ?? null,
          notes: notes ?? null,
          items: {
            create: items.map((i: { productId: string; price: number }) => ({
              productId: i.productId,
              price: i.price,
              quantity: 1,
            })),
          },
          timeline: {
            create: { status: 'PENDING', note: 'Order placed' },
          },
        },
        include: { items: true },
      })

      // Decrement inventory
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: { decrement: 1 },
            sold: true, // thrift items are always 1-of-1
          },
        })
      }

      // Increment coupon usage
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        })
      }

      return order
    })

    return NextResponse.json({ order: { id: result.id, orderNumber: result.orderNumber } }, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to create order'
    if (msg.startsWith('UNAVAILABLE:')) {
      return NextResponse.json({ error: 'Some items are no longer available', unavailable: msg.split(':')[1].split(',') }, { status: 409 })
    }
    console.error('Order creation error:', error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const orderNumber = searchParams.get('orderNumber')
  const phone = searchParams.get('phone')

  try {
    const where = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN'
      ? (orderNumber ? { orderNumber } : {})
      : { userId: session.user.id, ...(orderNumber ? { orderNumber } : {}) }

    if (orderNumber && phone && !session.user.id) {
      // Guest order tracking
      const order = await prisma.order.findFirst({
        where: { orderNumber, OR: [{ guestPhone: phone }, { address: { phone } }] },
        include: { items: { include: { product: { include: { brand: true, images: { where: { isPrimary: true }, take: 1 } } } } }, timeline: { orderBy: { createdAt: 'asc' } }, address: true },
      })
      return NextResponse.json({ order })
    }

    const orders = await prisma.order.findMany({
      where,
      include: { items: { include: { product: { include: { brand: true, images: { where: { isPrimary: true }, take: 1 } } } } }, timeline: { orderBy: { createdAt: 'asc' } }, address: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Orders GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
