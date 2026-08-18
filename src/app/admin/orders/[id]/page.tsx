import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, MapPin, CreditCard, Clock, Phone, Mail } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { AdminOrderStatusUpdater } from './AdminOrderStatusUpdater'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    redirect('/')
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
      user: true,
      timeline: {
        orderBy: { createdAt: 'desc' },
      },
      payments: true,
    },
  })

  if (!order) notFound()

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      {/* Top bar */}
      <div className="bg-[#0A0A0A] h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="font-display text-xl text-white tracking-widest">MARVIN</span>
          <span className="text-[0.6rem] text-[#C9A84C] font-semibold tracking-widest uppercase px-2 py-0.5 border border-[#C9A84C]/30">Admin</span>
        </div>
        <Link href="/" className="text-[0.72rem] text-white/50 hover:text-white transition-colors">View Store ↗</Link>
      </div>

      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs text-[#737373] uppercase tracking-wide mb-1">
              Order Details
            </div>
            <h1 className="text-2xl font-bold text-[#0A0A0A]">
              #{order.orderNumber}
            </h1>
            <p className="text-xs text-[#A3A3A3] mt-1">
              Placed on {new Date(order.createdAt).toLocaleString('en-KE')}
            </p>
          </div>

          {/* Quick interactive status updater */}
          <AdminOrderStatusUpdater
            orderId={order.id}
            initialStatus={order.status}
            initialPaymentStatus={order.paymentStatus}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main order items & timeline */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#E5E5E5] p-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-4">
                Ordered Items ({order.items.length})
              </h2>
              <div className="divide-y divide-[#F2F2F2]">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    <div className="w-16 h-20 bg-[#F5F5F5] relative overflow-hidden shrink-0">
                      {item.product.images[0] && (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[0.65rem] uppercase font-semibold text-[#737373]">
                        {item.product.brand.name}
                      </div>
                      <div className="font-semibold text-sm text-[#0A0A0A]">
                        {item.product.name}
                      </div>
                      <div className="text-xs text-[#A3A3A3] mt-0.5">
                        SKU: {item.product.sku} · Size: EU {item.product.sizeEU || '—'}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-[#0A0A0A]">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-[#E5E5E5] p-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C9A84C]" />
                Event History
              </h2>
              <div className="space-y-3">
                {order.timeline.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#C9A84C] mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-[#0A0A0A] uppercase tracking-wide">
                        {event.status.replace(/_/g, ' ')}
                      </span>
                      {event.note && <p className="text-[#737373] mt-0.5">{event.note}</p>}
                      <span className="text-[0.68rem] text-[#A3A3A3]">
                        {new Date(event.createdAt).toLocaleString('en-KE')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar customer & payment */}
          <div className="space-y-6">
            {/* Customer Details */}
            <div className="bg-white border border-[#E5E5E5] p-6 text-xs space-y-3">
              <h2 className="font-bold uppercase tracking-wider text-[#0A0A0A] mb-3">
                Customer Information
              </h2>
              <div className="space-y-2 text-[#525252]">
                <div className="font-semibold text-sm text-[#0A0A0A]">
                  {order.guestName || order.user?.name || 'Customer'}
                </div>
                {(order.guestEmail || order.user?.email) && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#A3A3A3]" />
                    {order.guestEmail || order.user?.email}
                  </div>
                )}
                {(order.guestPhone || order.address?.phone) && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#A3A3A3]" />
                    {order.guestPhone || order.address?.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            {order.address && (
              <div className="bg-white border border-[#E5E5E5] p-6 text-xs">
                <h2 className="font-bold uppercase tracking-wider text-[#0A0A0A] mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A84C]" />
                  Delivery Address
                </h2>
                <div className="text-[#525252] space-y-1">
                  <p className="font-semibold text-[#0A0A0A]">{order.address.fullName}</p>
                  <p>{order.address.phone}</p>
                  <p>{order.address.town}, {order.address.county}</p>
                  {order.address.estate && <p>Estate: {order.address.estate}</p>}
                  {order.address.buildingName && <p>Building: {order.address.buildingName}</p>}
                  {order.address.instructions && (
                    <p className="mt-2 pt-2 border-t border-[#F2F2F2] text-[#737373] italic">
                      Note: {order.address.instructions}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Financial summary */}
            <div className="bg-white border border-[#E5E5E5] p-6 text-xs">
              <h2 className="font-bold uppercase tracking-wider text-[#0A0A0A] mb-3 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#C9A84C]" />
                Financials
              </h2>
              <div className="space-y-2 border-b border-[#F2F2F2] pb-3 mb-3">
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
                  <span>{formatPrice(order.deliveryFee)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#0A0A0A]">
                <span>Total</span>
                <span className="text-[#C9A84C]">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
