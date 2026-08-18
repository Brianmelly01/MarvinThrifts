import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, Package, Eye } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default async function AdminOrdersPage() {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    redirect('/')
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: {
            include: { brand: true },
          },
        },
      },
      address: true,
      user: true,
    },
  })

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAYMENT_CONFIRMED: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    DISPATCHED: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      {/* Admin Top bar */}
      <div className="bg-[#0A0A0A] h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="font-display text-xl text-white tracking-widest">MARVIN</span>
          <span className="text-[0.6rem] text-[#C9A84C] font-semibold tracking-widest uppercase px-2 py-0.5 border border-[#C9A84C]/30">Admin</span>
        </div>
        <Link href="/" className="text-[0.72rem] text-white/50 hover:text-white transition-colors">View Store ↗</Link>
      </div>

      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Orders Management</h1>
            <p className="text-sm text-[#737373]">{orders.length} total customer orders</p>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
                <th className="text-left px-4 py-3 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#737373]">Order #</th>
                <th className="text-left px-4 py-3 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#737373]">Customer</th>
                <th className="text-left px-4 py-3 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#737373] hidden sm:table-cell">Items</th>
                <th className="text-left px-4 py-3 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#737373]">Payment</th>
                <th className="text-left px-4 py-3 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#737373]">Status</th>
                <th className="text-right px-4 py-3 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#737373]">Total</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F2F2]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F9F9F9] transition-colors">
                  <td className="px-4 py-3 font-semibold text-xs">
                    #{order.orderNumber}
                    <div className="text-[0.65rem] text-[#A3A3A3] font-normal">
                      {new Date(order.createdAt).toLocaleDateString('en-KE')}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-xs text-[#0A0A0A]">
                      {order.guestName || order.user?.name || 'Customer'}
                    </div>
                    <div className="text-[0.68rem] text-[#737373]">
                      {order.guestPhone || order.address?.phone || '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-xs text-[#525252]">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-full ${
                      order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                      order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status] || ''}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-xs">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-xs text-[#737373] hover:text-[#0A0A0A]"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-10 h-10 text-[#D4D4D4] mx-auto mb-3" />
              <p className="text-[#737373] text-sm">No orders received yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
