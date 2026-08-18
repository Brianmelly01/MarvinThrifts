import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Package, ArrowLeft, ChevronRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = { title: 'My Orders' }

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  PAYMENT_CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  PROCESSING: 'bg-purple-50 text-purple-700 border-purple-200',
  DISPATCHED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  DELIVERED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
}

export default async function AccountOrdersPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login?callbackUrl=/account/orders')

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: {
            include: {
              brand: true,
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
        },
      },
      address: true,
    },
  })

  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
      <div className="bg-[#0A0A0A] py-10">
        <div className="container-brand">
          <Link href="/account" className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to account
          </Link>
          <h1 className="font-display text-4xl text-white">MY ORDERS</h1>
        </div>
      </div>

      <div className="container-brand py-10 max-w-3xl">
        {orders.length === 0 ? (
          <div className="bg-white border border-[#E5E5E5] p-16 text-center">
            <Package className="w-12 h-12 text-[#D4D4D4] mx-auto mb-4" />
            <h2 className="font-bold text-lg mb-2">No orders yet</h2>
            <p className="text-[#737373] text-sm mb-6">When you place an order, it will appear here.</p>
            <Link href="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block bg-white border border-[#E5E5E5] hover:border-[#C9A84C] transition-all group"
              >
                {/* Order header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#F2F2F2]">
                  <div>
                    <div className="font-bold">Order #{order.orderNumber}</div>
                    <div className="text-[0.7rem] text-[#737373]">
                      {new Date(order.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[0.65rem] font-semibold px-2.5 py-1 border uppercase tracking-wide ${statusColors[order.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#A3A3A3] group-hover:text-[#C9A84C] transition-colors" />
                  </div>
                </div>

                {/* Items preview */}
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="w-12 h-14 bg-[#F5F5F5] border-2 border-white overflow-hidden shrink-0">
                          {item.product.images[0] && (
                            <img
                              src={item.product.images[0].url}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-[#525252]">
                      {order.items.slice(0, 2).map((i) => `${i.product.brand.name} ${i.product.name}`).join(' · ')}
                      {order.items.length > 2 && ` +${order.items.length - 2} more`}
                    </div>
                  </div>
                  <div className="font-bold text-[#C9A84C]">{formatPrice(order.total)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
