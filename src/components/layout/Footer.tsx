import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { InstagramIcon, FacebookIcon } from '@/components/ui/Icons'

const footerLinks = {
  shop: [
    { label: 'All Shoes', href: '/shop' },
    { label: 'New Arrivals', href: '/shop?sort=newest' },
    { label: 'Brands', href: '/brands' },
    { label: 'Coming Soon', href: '/coming-soon' },
  ],
  help: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Condition Guide', href: '/condition-guide' },
    { label: 'Delivery Info', href: '/faq#delivery' },
    { label: 'Returns Policy', href: '/returns' },
  ],
  brand: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Story', href: '/about#story' },
    { label: 'Sustainability', href: '/about#sustainability' },
    { label: 'Track My Order', href: '/track' },
  ],
}

export function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'

  return (
    <footer className="bg-[#0A0A0A] text-white">
      {/* Top CTA bar */}
      <div className="border-b border-white/8">
        <div className="container-brand py-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <div className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3">
              Join the Community
            </div>
            <h2 className="font-display text-4xl lg:text-5xl tracking-wide">STAY IN THE LOOP.</h2>
            <p className="text-white/50 text-sm mt-2 max-w-md">
              New drops, exclusive finds, and behind-the-scenes — straight to your inbox.
            </p>
          </div>
          <form className="flex gap-0 w-full max-w-md">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 h-12 bg-white/8 border border-white/12 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#C9A84C] transition-colors"
              aria-label="Email for newsletter"
            />
            <button
              type="submit"
              className="h-12 px-6 bg-[#C9A84C] text-white text-[0.72rem] font-semibold tracking-[0.1em] uppercase hover:bg-[#A8892E] transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer links */}
      <div className="container-brand py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex flex-col leading-none mb-6">
              <span className="font-display text-3xl tracking-widest">MARVIN</span>
              <span className="text-[0.55rem] font-semibold tracking-[0.35em] uppercase text-[#C9A84C]/70 -mt-1">THRIFTS</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              Premium curated pre-loved footwear. Every pair carefully inspected. Ready for a second life.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/marvinthrifts'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/50 hover:text-[#25D366] hover:border-[#25D366]/30 transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              {process.env.NEXT_PUBLIC_FACEBOOK_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Shop column */}
          <div>
            <h3 className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-5">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help column */}
          <div>
            <h3 className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-5">Help</h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand info column */}
          <div>
            <h3 className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-5">Marvin Thrifts</h3>
            <ul className="space-y-3">
              {footerLinks.brand.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="container-brand py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[0.7rem] text-white/30 tracking-wide">
            © 2026 Marvin Thrifts. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-[0.7rem] text-white/30 hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[0.7rem] text-white/30 hover:text-white/60 transition-colors">Terms of Service</Link>
            <Link href="/returns" className="text-[0.7rem] text-white/30 hover:text-white/60 transition-colors">Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
