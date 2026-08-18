import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Package, ShoppingBag, Users, TrendingUp, DollarSign, AlertCircle, Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default async function AdminDashboard() {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    redirect('/')
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  const [
    totalProducts, availableProducts, soldProducts,
    totalOrders, pendingOrders, todayOrders,
    monthRevenue, totalRevenue, totalCustomers,
    recentOrders, lowStock,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true, sold: false, quantity: { gt: 0 } } }),
    prisma.product.count({ where: { sold: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ['PENDING', 'PAYMENT_CONFIRMED', 'PROCESSING'] } } }),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.aggregate({ where: { paymentStatus: 'PAID', createdAt: { gte: thisMonth } }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { total: true } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' }, take: 8,
      include: { items: { take: 1, include: { product: { include: { brand: true } } } }, address: true },
    }),
    prisma.product.findMany({
      where: { isActive: true, sold: false, quantity: { lte: 1 } }, take: 5,
      include: { brand: true, images: { where: { isPrimary: true }, take: 1 } },
    }),
  ])

  const stats = [
    { label: 'Available Products', value: availableProducts, sub: `${soldProducts} sold`, icon: ShoppingBag, href: '/admin/products', color: 'text-blue-600' },
    { label: 'Pending Orders', value: pendingOrders, sub: `${todayOrders} today`, icon: Package, href: '/admin/orders', color: 'text-yellow-600' },
    { label: 'Month Revenue', value: formatPrice(monthRevenue._sum.total ?? 0), sub: `Total: ${formatPrice(totalRevenue._sum.total ?? 0)}`, icon: DollarSign, href: '/admin/orders', color: 'text-green-600' },
    { label: 'Customers', value: totalCustomers, sub: `${totalOrders} total orders`, icon: Users, href: '/admin/customers', color: 'text-purple-600' },
  ]

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
      {/* Admin top bar */}
      <div className="bg-[#0A0A0A] h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <span className="font-display text-xl text-white tracking-widest">MARVIN</span>
          <span className="text-[0.6rem] text-[#C9A84C] font-semibold tracking-widest uppercase px-2 py-0.5 border border-[#C9A84C]/30">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[0.72rem] text-white/50 hover:text-white transition-colors">View Store ↗</Link>
          <span className="text-[0.72rem] text-white/30">{session.user.name || session.user.email}</span>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-52 min-h-screen bg-white border-r border-[#E5E5E5] sticky top-14 self-start pt-6 pb-10">
          <nav className="space-y-1 px-3">
            {[
              { label: 'Dashboard', href: '/admin', icon: TrendingUp },
              { label: 'Products', href: '/admin/products', icon: ShoppingBag },
              { label: 'Orders', href: '/admin/orders', icon: Package },
              { label: 'Customers', href: '/admin/customers', icon: Users },
            ].map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#525252] hover:text-[#0A0A0A] hover:bg-[#F5F4F0] rounded-sm transition-all">
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Link href="/admin/products/new" className="btn btn-primary gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(({ label, value, sub, icon: Icon, href, color }) => (
              <Link key={label} href={href} className="bg-white border border-[#E5E5E5] p-5 hover:border-[#C9A84C] transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#737373]">{label}</span>
                  <Icon className={`w-5 h-5 ${color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                </div>
                <div className="text-2xl font-bold text-[#0A0A0A]">{value}</div>
                <div className="text-[0.72rem] text-[#A3A3A3] mt-1">{sub}</div>
              </Link>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent orders */}
            <div className="lg:col-span-2 bg-white border border-[#E5E5E5]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5]">
                <h2 className="font-semibold text-sm">Recent Orders</h2>
                <Link href="/admin/orders" className="text-[0.72rem] text-[#C9A84C] hover:text-[#A8892E]">View all</Link>
              </div>
              <div className="divide-y divide-[#F2F2F2]">
                {recentOrders.map((order) => (
                  <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-[#F9F9F9] transition-colors">
                    <div>
                      <div className="text-sm font-semibold">#{order.orderNumber}</div>
                      <div className="text-[0.72rem] text-[#737373]">
                        {order.guestName || 'Customer'} · {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      {order.items[0] && (
                        <div className="text-[0.65rem] text-[#A3A3A3]">
                          {order.items[0].product.brand.name} {order.items[0].product.name}
                          {order.items.length > 1 ? ` +${order.items.length - 1}` : ''}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status] || ''}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Low stock alert */}
            <div className="bg-white border border-[#E5E5E5]">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E5E5E5]">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <h2 className="font-semibold text-sm">Low Stock</h2>
              </div>
              {lowStock.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-[#737373]">All products have sufficient stock</div>
              ) : (
                <div className="divide-y divide-[#F2F2F2]">
                  {lowStock.map((product) => (
                    <Link key={product.id} href={`/admin/products/${product.id}/edit`} className="flex items-center gap-3 px-5 py-3 hover:bg-[#F9F9F9] transition-colors">
                      <div className="w-10 h-12 bg-[#F5F5F5] shrink-0 overflow-hidden">
                        {product.images[0] && <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-[#737373]">{product.brand.name}</div>
                        <div className="text-sm font-semibold truncate">{product.name}</div>
                        <div className="text-[0.65rem] text-yellow-600 font-semibold">{product.quantity === 0 ? 'Out of stock' : 'Only 1 left'}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
