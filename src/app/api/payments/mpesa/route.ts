import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { initiateSTKPush } from '@/lib/mpesa'

export async function POST(request: NextRequest) {
  try {
    const { orderId, phone, amount } = await request.json()

    if (!orderId || !phone || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify order exists
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if M-Pesa credentials are configured
    if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET) {
      return NextResponse.json(
        { error: 'M-Pesa not configured. Please add MPESA credentials to your environment variables.' },
        { status: 503 }
      )
    }

    // Initiate STK push
    const stkResponse = await initiateSTKPush({
      phone: phone.replace(/^(\+254|0)/, '254'),
      amount: Math.ceil(amount),
      orderId,
      orderNumber: order.orderNumber,
      description: `Marvin Thrifts Order ${order.orderNumber}`,
    })

    if (stkResponse.ResponseCode !== '0') {
      return NextResponse.json({ error: 'STK Push failed', details: stkResponse.ResponseDescription }, { status: 400 })
    }

    // Save payment record
    await prisma.payment.create({
      data: {
        orderId,
        method: 'MPESA',
        amount: Math.ceil(amount),
        status: 'PENDING',
        reference: stkResponse.CheckoutRequestID,
        metadata: JSON.stringify({ merchantRequestId: stkResponse.MerchantRequestID }),
      },
    })

    // Update order payment status to PENDING
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'PENDING' },
    })

    return NextResponse.json({
      success: true,
      checkoutRequestId: stkResponse.CheckoutRequestID,
      customerMessage: stkResponse.CustomerMessage,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'STK Push failed'
    console.error('M-Pesa STK Push error:', error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
