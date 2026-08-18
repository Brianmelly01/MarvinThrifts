import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Package, Heart, User, LogOut, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = { title: 'My Account' }

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login?callbackUrl=/account')

  const [orders, wishlistItems] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        items: {
          include: { product: { include: { brand: true, images: { where: { isPrimary: true }, take: 1 } } } },
          take: 2,
        },
      },
    }),
    prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: { product: { include: { brand: true, images: { where: { isPrimary: true }, take: 1 } } } },
      take: 4,
    }),
  ])

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    PAYMENT_CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
    PROCESSING: 'bg-purple-50 text-purple-700 border-purple-200',
    DISPATCHED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    DELIVERED: 'bg-green-50 text-green-700 border-green-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
      <div className="bg-[#0A0A0A] py-10">
        <div className="container-brand">
          <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-2">Account</div>
          <h1 className="font-display text-4xl text-white">
            WELCOME BACK{session.user.name ? `, ${session.user.name.split(' ')[0].toUpperCase()}` : ''}
          </h1>
        </div>
      </div>

      <div className="container-brand py-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-[#E5E5E5] p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-[#0A0A0A] rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-xl">
                    {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
                  </span>
                </div>
                <div className="font-semibold">{session.user.name || 'Customer'}</div>
                <div className="text-[0.72rem] text-[#737373]">{session.user.email}</div>
              </div>

              <nav className="space-y-1">
                {[
                  { label: 'Dashboard', href: '/account', icon: User },
                  { label: 'My Orders', href: '/account/orders', icon: Package },
                  { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
                ].map(({ label, href, icon: Icon }) => (
                  <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#525252] hover:text-[#0A0A0A] hover:bg-[#F5F4F0] transition-all">
                    <Icon className="w-4 h-4" /> {label}
                  </Link>
                ))}
                <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-4 border-t border-[#F2F2F2] pt-4">
                  <LogOut className="w-4 h-4" /> Sign Out
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Recent orders */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Recent Orders</h2>
                <Link href="/account/orders" className="text-sm text-[#C9A84C] hover:text-[#A8892E] transition-colors">View all</Link>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white border border-[#E5E5E5] p-10 text-center">
                  <ShoppingBag className="w-10 h-10 text-[#D4D4D4] mx-auto mb-3" />
                  <p className="text-[#737373]">You haven&apos;t placed any orders yet</p>
                  <Link href="/shop" className="btn btn-primary mt-4">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white border border-[#E5E5E5] p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-bold text-sm">Order #{order.orderNumber}</div>
                          <div className="text-[0.7rem] text-[#737373]">{new Date(order.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[0.65rem] font-semibold px-2.5 py-1 border uppercase tracking-wide ${statusColors[order.status] || ''}`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                          <span className="font-bold text-sm">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[0.72rem] text-[#737373]">
                        {order.items.slice(0, 2).map((item) => (
                          <span key={item.id}>{item.product.brand.name} {item.product.name}</span>
                        ))}
                        {order.items.length > 2 && <span>+{order.items.length - 2} more</span>}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Link href={`/account/orders/${order.id}`} className="btn btn-outline btn-sm">View Order</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Wishlist preview */}
            {wishlistItems.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg">Wishlist</h2>
                  <Link href="/account/wishlist" className="text-sm text-[#C9A84C] hover:text-[#A8892E] transition-colors">View all</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {wishlistItems.map(({ product }) => (
                    <Link key={product.id} href={`/shop/${product.slug}`} className="bg-white border border-[#E5E5E5] p-3 hover:border-[#C9A84C] transition-all group">
                      <div className="aspect-square bg-[#F5F5F5] mb-2 overflow-hidden">
                        <img src={product.images[0]?.url || '/images/placeholder-shoe.jpg'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="text-[0.65rem] text-[#737373]">{product.brand.name}</div>
                      <div className="text-xs font-semibold truncate">{product.name}</div>
                      <div className="text-sm font-bold mt-1">{formatPrice(product.salePrice ?? product.price)}</div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
