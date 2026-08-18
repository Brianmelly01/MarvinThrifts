'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid, Heart, User, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { cn } from '@/lib/cn'

export function MobileBottomNav() {
  const pathname = usePathname()
  const { getItemCount, toggleCart } = useCartStore()
  const { getCount: getWishlistCount } = useWishlistStore()

  const cartCount = getItemCount()
  const wishlistCount = getWishlistCount()

  // Hide in admin dashboard
  if (pathname.startsWith('/admin')) return null

  const items = [
    { label: 'HOME', href: '/', icon: Home, isAction: false },
    { label: 'SHOP', href: '/shop', icon: Grid, isAction: false },
    { label: 'WISHLIST', href: '/account/wishlist', icon: Heart, badge: wishlistCount, isAction: false },
    { label: 'ACCOUNT', href: '/account', icon: User, isAction: false },
    { label: 'CART', href: '#', icon: ShoppingBag, badge: cartCount, isAction: true },
  ]

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] bg-[#0A0A0A] border-t border-white/10 safe-area-bottom">
      <div className="grid grid-cols-5 h-16">
        {items.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          if (item.isAction) {
            return (
              <button
                key={item.label}
                onClick={toggleCart}
                className="flex flex-col items-center justify-center relative text-white/60 hover:text-white transition-colors"
                aria-label={`Open shopping cart (${cartCount} items)`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4 mb-1" />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-[#C49E6C] text-[#0A0A0A] text-[0.55rem] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[0.6rem] font-bold tracking-[0.1em] uppercase">
                  {item.label}
                </span>
              </button>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center relative transition-colors',
                isActive ? 'text-[#C49E6C]' : 'text-white/60 hover:text-white'
              )}
            >
              <div className="relative">
                <Icon className="w-4 h-4 mb-1" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-[#C49E6C] text-[#0A0A0A] text-[0.55rem] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[0.6rem] font-bold tracking-[0.1em] uppercase">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
