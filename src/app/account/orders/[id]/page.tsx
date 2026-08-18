import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, MapPin, Package, Clock, CheckCircle2, Truck } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Order Details — Marvin Thrifts',
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  PAYMENT_CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  PROCESSING: 'bg-purple-50 text-purple-700 border-purple-200',
  DISPATCHED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  DELIVERED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
}

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth()
  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/account/orders')
  }

  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
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
      timeline: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!order) notFound()

  // Ensure user owns this order or is admin
  const isOwner = order.userId === session.user.id
  const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN'
  if (!isOwner && !isAdmin) {
    redirect('/account')
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
      <div className="bg-[#0A0A0A] py-10">
        <div className="container-brand">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white uppercase mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to orders
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-1">
                Order Record
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-white">
                #{order.orderNumber}
              </h1>
            </div>
            <span
              className={`self-start sm:self-auto text-xs font-bold px-3 py-1.5 border uppercase tracking-wider ${
                statusColors[order.status] || 'bg-gray-100 text-gray-700 border-gray-300'
              }`}
            >
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="container-brand py-12 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main items & timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products */}
            <div className="bg-white border border-[#E5E5E5] p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A] mb-4">
                Items in this Order
              </h2>
              <div className="divide-y divide-[#F2F2F2]">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    <div className="w-20 h-24 bg-[#F5F5F5] relative overflow-hidden shrink-0">
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#A3A3A3]">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="text-[0.65rem] uppercase font-semibold text-[#737373] tracking-wide">
                          {item.product.brand.name}
                        </div>
                        <Link
                          href={`/shop/${item.product.slug}`}
                          className="font-semibold text-sm hover:text-[#C9A84C] transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <div className="text-xs text-[#A3A3A3] mt-1">
                          EU {item.product.sizeEU || '—'} · Score: {item.product.conditionScore}/10
                        </div>
                      </div>
                      <div className="text-sm font-bold text-[#0A0A0A]">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            {order.timeline.length > 0 && (
              <div className="bg-white border border-[#E5E5E5] p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A] mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C9A84C]" />
                  Order Activity Timeline
                </h2>
                <div className="space-y-4">
                  {order.timeline.map((entry, index) => (
                    <div key={entry.id} className="flex items-start gap-3 relative">
                      {index < order.timeline.length - 1 && (
                        <div className="absolute left-2.5 top-6 bottom-0 w-px bg-[#E5E5E5]" />
                      )}
                      <div className="w-5 h-5 rounded-full bg-[#C9A84C] text-white flex items-center justify-center shrink-0 text-xs">
                        ✓
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-[#0A0A0A] uppercase tracking-wide">
                          {entry.status.replace(/_/g, ' ')}
                        </div>
                        {entry.note && (
                          <p className="text-xs text-[#737373] mt-0.5">{entry.note}</p>
                        )}
                        <span className="text-[0.68rem] text-[#A3A3A3]">
                          {new Date(entry.createdAt).toLocaleString('en-KE')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar summary */}
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E5E5] p-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-4">
                Summary
              </h2>
              <div className="space-y-2 text-xs border-b border-[#F2F2F2] pb-4 mb-4">
                <div className="flex justify-between text-[#737373]">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.couponDiscount > 0 && (
                  <div className="flex justify-between text-[#16A34A]">
                    <span>Discount</span>
                    <span>-{formatPrice(order.couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#737373]">
                  <span>Delivery ({order.deliveryMethod})</span>
                  <span>{order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#0A0A0A]">
                <span>Total</span>
                <span className="text-[#C9A84C]">{formatPrice(order.total)}</span>
              </div>
            </div>

            {order.address && (
              <div className="bg-white border border-[#E5E5E5] p-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A84C]" />
                  Delivery Destination
                </h2>
                <div className="text-xs text-[#525252] space-y-1">
                  <p className="font-semibold text-[#0A0A0A]">{order.address.fullName}</p>
                  <p>{order.address.phone}</p>
                  <p>{order.address.town}, {order.address.county}</p>
                  {order.address.buildingName && <p>{order.address.buildingName}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
