import Link from 'next/link'
import { Lock, RotateCcw, Headphones } from 'lucide-react'
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from '@/components/ui/Icons'

const bottomGuarantees = [
  {
    icon: Lock,
    title: 'SECURE PAYMENTS',
    description: 'M-Pesa, Card & COD',
  },
  {
    icon: RotateCcw,
    title: '7-DAY RETURNS',
    description: 'Return in original condition',
  },
  {
    icon: Headphones,
    title: 'CUSTOMER SUPPORT',
    description: 'We are here to help',
  },
  {
    icon: InstagramIcon,
    title: 'JOIN OUR COMMUNITY',
    description: '@marvinthrifts',
    isSocial: true,
  },
]

const footerLinks = {
  shop: [
    { label: 'All Shoes', href: '/shop' },
    { label: 'New Drops', href: '/shop?sort=newest' },
    { label: 'Brands Directory', href: '/brands' },
    { label: 'Coming Soon', href: '/coming-soon' },
  ],
  help: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Condition Guide', href: '/condition-guide' },
    { label: 'Returns & Exchange', href: '/returns' },
    { label: 'Track Order', href: '/track' },
  ],
  brand: [
    { label: 'About Marvin Thrifts', href: '/about' },
    { label: 'Our Story', href: '/about#story' },
    { label: 'Sustainability', href: '/about#sustainability' },
    { label: 'Contact Us', href: '/contact' },
  ],
}

export function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'

  return (
    <footer className="bg-[#0A0A0A] text-white">
      {/* Top Cream Trust Banner (Mockup match) */}
      <div className="bg-[#F5EFEB] text-[#0A0A0A] border-b border-[#EAE2D8]">
        <div className="container-brand py-6 sm:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-0 lg:divide-x lg:divide-[#E5DDD2]">
            {bottomGuarantees.map(({ icon: Icon, title, description, isSocial }) => (
              <div
                key={title}
                className="flex items-center gap-3 sm:gap-4 lg:px-6 first:pl-0 last:pr-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center text-[#0A0A0A]">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h4 className="text-[0.72rem] sm:text-[0.75rem] font-bold tracking-[0.08em] uppercase text-[#0A0A0A] leading-tight">
                    {title}
                  </h4>
                  <p className="text-[0.68rem] sm:text-[0.72rem] text-[#737373] mt-0.5">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container-brand py-14 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex flex-col leading-none mb-4">
              <span className="font-display text-3xl tracking-widest text-white">MARVIN</span>
              <span className="text-[0.55rem] font-semibold tracking-[0.38em] uppercase text-[#C49E6C] -mt-1">
                THRIFTS
              </span>
            </div>
            <p className="text-white/50 text-xs sm:text-sm leading-relaxed mb-6 max-w-xs">
              Kenya&apos;s premier destination for curated, authenticated pre-loved sneakers and streetwear footwear.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/marvinthrifts'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-[#C49E6C] transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/70 hover:text-[#25D366] hover:border-[#25D366] transition-all"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h5 className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-[#C49E6C] mb-4">
              SHOP
            </h5>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h5 className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-[#C49E6C] mb-4">
              HELP
            </h5>
            <ul className="space-y-2.5">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h5 className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-[#C49E6C] mb-4">
              MARVIN THRIFTS
            </h5>
            <ul className="space-y-2.5">
              {footerLinks.brand.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-brand py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[0.68rem] text-white/40 tracking-wider">
            © 2026 MARVIN THRIFTS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-[0.68rem] text-white/40 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[0.68rem] text-white/40 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/returns" className="text-[0.68rem] text-white/40 hover:text-white transition-colors">
              Returns &amp; Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
