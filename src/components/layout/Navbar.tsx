'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { cn } from '@/lib/cn'
import { MobileNav } from './MobileNav'
import { SearchModal } from '@/components/ui/SearchModal'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'New Drops', href: '/shop?sort=newest' },
  { label: 'Brands', href: '/brands' },
  { label: 'About', href: '/about' },
  {
    label: 'More',
    href: '#',
    children: [
      { label: 'Condition Guide', href: '/condition-guide' },
      { label: 'Size Guide', href: '/size-guide' },
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

  const { getItemCount, toggleCart } = useCartStore()
  const { getCount: getWishlistCount } = useWishlistStore()

  const cartCount = getItemCount()
  const wishlistCount = getWishlistCount()

  // Track scroll for nav background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(null)
  }, [pathname])

  // Determine if on hero page (transparent nav)
  const isHeroPage = pathname === '/'
  const isTransparent = isHeroPage && !scrolled && !mobileOpen

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] transition-all duration-500',
          isTransparent
            ? 'bg-transparent'
            : 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/8'
        )}
      >
        {/* Announcement bar */}
        <div className={cn(
          'text-center py-2 text-[0.7rem] font-medium tracking-[0.15em] uppercase transition-all duration-500',
          isTransparent ? 'bg-transparent text-white/70' : 'bg-[#C9A84C]/10 text-[#C9A84C]'
        )}>
          Free delivery in Nairobi for orders above KSh 5,000
        </div>

        <nav className="container-brand flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span className={cn(
              'font-display text-2xl tracking-widest transition-colors duration-300',
              isTransparent ? 'text-white' : 'text-white'
            )}>
              MARVIN
            </span>
            <span className={cn(
              'text-[0.55rem] font-semibold tracking-[0.35em] uppercase transition-colors duration-300 -mt-1',
              isTransparent ? 'text-white/50' : 'text-[#C9A84C]/80'
            )}>
              THRIFTS
            </span>
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              const hasChildren = link.children && link.children.length > 0

              return (
                <li key={link.label} className="relative">
                  {hasChildren ? (
                    <button
                      className={cn(
                        'flex items-center gap-1 text-[0.72rem] font-semibold tracking-[0.12em] uppercase transition-colors duration-200',
                        isTransparent ? 'text-white/80 hover:text-white' : 'text-white/70 hover:text-white'
                      )}
                      onMouseEnter={() => setDropdownOpen(link.label)}
                      onMouseLeave={() => setDropdownOpen(null)}
                    >
                      {link.label}
                      <ChevronDown className={cn('w-3 h-3 transition-transform duration-200', dropdownOpen === link.label && 'rotate-180')} />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={cn(
                        'text-[0.72rem] font-semibold tracking-[0.12em] uppercase transition-colors duration-200 relative',
                        isTransparent ? 'text-white/80 hover:text-white' : 'text-white/70 hover:text-white',
                        isActive && 'text-white'
                      )}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[#C9A84C]" />
                      )}
                    </Link>
                  )}

                  {/* Dropdown menu */}
                  {hasChildren && dropdownOpen === link.label && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50"
                      onMouseEnter={() => setDropdownOpen(link.label)}
                      onMouseLeave={() => setDropdownOpen(null)}
                    >
                      <div className="bg-[#0A0A0A] border border-white/10 py-2 min-w-[180px]">
                        {link.children?.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-5 py-2.5 text-[0.72rem] font-medium tracking-[0.1em] uppercase text-white/60 hover:text-white hover:bg-white/5 transition-all duration-150"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Right-side actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className={cn(
                'w-10 h-10 flex items-center justify-center transition-colors duration-200',
                isTransparent ? 'text-white/70 hover:text-white' : 'text-white/60 hover:text-white'
              )}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account */}
            <Link
              href="/account"
              className={cn(
                'w-10 h-10 hidden sm:flex items-center justify-center transition-colors duration-200',
                isTransparent ? 'text-white/70 hover:text-white' : 'text-white/60 hover:text-white'
              )}
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className={cn(
                'w-10 h-10 hidden sm:flex items-center justify-center relative transition-colors duration-200',
                isTransparent ? 'text-white/70 hover:text-white' : 'text-white/60 hover:text-white'
              )}
              aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ''}`}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#C9A84C] rounded-full text-[0.55rem] font-bold text-white flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className={cn(
                'w-10 h-10 flex items-center justify-center relative transition-colors duration-200',
                isTransparent ? 'text-white/70 hover:text-white' : 'text-white/60 hover:text-white'
              )}
              aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#C9A84C] rounded-full text-[0.55rem] font-bold text-white flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'w-10 h-10 lg:hidden flex items-center justify-center transition-colors duration-200',
                isTransparent ? 'text-white/70 hover:text-white' : 'text-white/60 hover:text-white'
              )}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={navLinks}
      />

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
