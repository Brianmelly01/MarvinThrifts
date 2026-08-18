import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

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
    const { status, paymentStatus, note } = body

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...updateData,
        timeline: status
          ? {
              create: {
                status,
                note: note || `Status updated to ${status.replace(/_/g, ' ')}`,
              },
            }
          : undefined,
      },
      include: { timeline: true },
    })

    return NextResponse.json({ order })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Update failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
