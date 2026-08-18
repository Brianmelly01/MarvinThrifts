'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, ChevronRight, MessageCircle } from 'lucide-react'
import { InstagramIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/cn'

interface NavLink {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  navLinks: NavLink[]
}

export function MobileNav({ isOpen, onClose, navLinks }: MobileNavProps) {
  const pathname = usePathname()

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 left-0 bottom-0 w-full max-w-sm bg-[#0A0A0A] z-[95] lg:hidden flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-20 border-b border-white/8">
          <div className="flex flex-col leading-none">
            <span className="font-display text-2xl tracking-widest text-white">MARVIN</span>
            <span className="text-[0.55rem] font-semibold tracking-[0.35em] uppercase text-[#C9A84C]/80 -mt-1">THRIFTS</span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-6 px-6">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.children ? (
                  <div className="space-y-1">
                    <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-white/30 px-0 py-2 mt-4">
                      {link.label}
                    </div>
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'flex items-center justify-between py-3 text-sm font-medium tracking-wide border-b border-white/5 transition-colors duration-150',
                          pathname === child.href ? 'text-[#C9A84C]' : 'text-white/60 hover:text-white'
                        )}
                      >
                        {child.label}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center justify-between py-4 text-base font-semibold tracking-wide border-b border-white/8 transition-colors duration-150',
                      pathname === link.href ? 'text-[#C9A84C]' : 'text-white hover:text-white/80'
                    )}
                  >
                    {link.label}
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-6 py-6 border-t border-white/8">
          <div className="flex items-center gap-4 mb-6">
            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:text-[#25D366] hover:border-[#25D366]/40 transition-all"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
          <p className="text-[0.65rem] text-white/30 uppercase tracking-wider">
            © 2026 Marvin Thrifts. All rights reserved.
          </p>
        </div>
      </div>
    </>
  )
}
