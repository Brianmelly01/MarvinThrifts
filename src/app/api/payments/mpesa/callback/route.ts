import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseMpesaCallback, type MpesaCallbackBody } from '@/lib/mpesa'

export async function POST(request: NextRequest) {
  try {
    const body: MpesaCallbackBody = await request.json()
    const result = parseMpesaCallback(body)

    console.log('[M-Pesa Callback]', result)

    // Find the payment by CheckoutRequestID
    const payment = await prisma.payment.findFirst({
      where: { reference: result.checkoutRequestId },
      include: { order: true },
    })

    if (!payment) {
      console.warn('[M-Pesa Callback] Payment not found:', result.checkoutRequestId)
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }

    if (result.success) {
      // Payment confirmed — update payment and order
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'PAID',
            mpesaReceiptNo: result.mpesaReceiptNo,
            paidAt: new Date(),
            metadata: JSON.stringify({
              mpesaReceiptNo: result.mpesaReceiptNo,
              amount: result.amount,
              phone: result.phone,
              transactionDate: result.transactionDate,
            }),
          },
        }),
        prisma.order.update({
          where: { id: payment.orderId },
          data: {
            status: 'PAYMENT_CONFIRMED',
            paymentStatus: 'PAID',
          },
        }),
        prisma.orderTimeline.create({
          data: {
            orderId: payment.orderId,
            status: 'PAYMENT_CONFIRMED',
            note: `M-Pesa payment confirmed. Receipt: ${result.mpesaReceiptNo}`,
          },
        }),
      ])

      console.log(`[M-Pesa] Payment confirmed for order ${payment.order.orderNumber}`)
    } else {
      // Payment failed
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'FAILED',
            failureReason: result.resultDesc,
          },
        }),
        prisma.order.update({
          where: { id: payment.orderId },
          data: { paymentStatus: 'FAILED' },
        }),
      ])

      console.log(`[M-Pesa] Payment FAILED for order ${payment.order.orderNumber}: ${result.resultDesc}`)
    }

    // Daraja expects this exact response to acknowledge receipt
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch (error) {
    console.error('[M-Pesa Callback Error]', error)
    // Still return success to Safaricom to prevent retries
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }
}
