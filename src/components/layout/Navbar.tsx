'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { cn } from '@/lib/cn'
import { MobileNav } from './MobileNav'
import { SearchModal } from '@/components/ui/SearchModal'

const navLinks = [
  { label: 'HOME', href: '/' },
  { label: 'SHOP', href: '/shop' },
  { label: 'NEW DROPS', href: '/shop?sort=newest' },
  { label: 'BRANDS', href: '/brands' },
  { label: 'ABOUT', href: '/about' },
  { label: 'CONDITION GUIDE', href: '/condition-guide' },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const { getItemCount, toggleCart } = useCartStore()
  const { getCount: getWishlistCount } = useWishlistStore()

  const cartCount = getItemCount()
  const wishlistCount = getWishlistCount()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] bg-[#0A0A0A] text-white">
        {/* Top Announcement Bar */}
        <div className="bg-[#000000] border-b border-white/10 text-center py-2 text-[0.68rem] font-medium tracking-[0.18em] uppercase text-white/80">
          FREE DELIVERY IN NAIROBI FOR ORDERS ABOVE KSH 5,000
        </div>

        {/* Main Nav Bar */}
        <nav className="container-brand flex items-center justify-between h-16 sm:h-20 border-b border-white/10">
          {/* Left: Mobile hamburger (Mobile only) */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 text-white/90 hover:text-white"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex flex-col items-center lg:items-start leading-none group">
            <span className="font-display text-2xl sm:text-3xl tracking-widest text-white">
              MARVIN
            </span>
            <span className="text-[0.55rem] font-semibold tracking-[0.38em] uppercase text-[#C49E6C] -mt-1">
              THRIFTS
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-[0.75rem] font-bold tracking-[0.14em] uppercase transition-colors duration-150 relative py-1',
                      isActive ? 'text-white' : 'text-white/70 hover:text-white'
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C49E6C]" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Right Icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-white/80 hover:text-white transition-colors"
              aria-label="Search sneakers"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Account (Desktop) */}
            <Link
              href="/account"
              className="hidden sm:block p-2 text-white/80 hover:text-white transition-colors"
              aria-label="My Account"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            {/* Wishlist (Desktop) */}
            <Link
              href="/account/wishlist"
              className="hidden sm:block p-2 text-white/80 hover:text-white transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C49E6C] text-black text-[0.55rem] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="p-2 text-white/80 hover:text-white transition-colors relative"
              aria-label={`Shopping Bag (${cartCount} items)`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C49E6C] text-[#0A0A0A] text-[0.6rem] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={navLinks}
      />

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
