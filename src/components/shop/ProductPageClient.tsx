'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ShoppingBag,
  Heart,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Check,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/cn'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { ProductCard } from '@/components/ui/ProductCard'
import { toast } from '@/components/ui/Toaster'

interface ProductData {
  id: string
  slug: string
  sku: string
  name: string
  brand: string
  brandSlug: string
  category: string
  description: string
  price: number
  salePrice?: number
  images: { url: string; altText: string }[]
  sizeEU: string
  sizeUK: string
  sizeUS: string
  sizeCM: string
  conditionScore: number
  conditionLabel: string
  conditionNotes: string
  defects: string[]
  creasing: string
  soleCondition: string
  insoleCondition: string
  stains: string
  accessories: string
  quantity: number
  sold: boolean
  verified: boolean
  newArrival: boolean
  colorMain: string
  reviews: { id: string; userName: string; rating: number; comment: string; verified: boolean; createdAt: string }[]
}

interface RelatedProduct {
  id: string
  slug: string
  name: string
  brand: string
  price: number
  salePrice?: number | null
  imageUrl: string
  sizeEU?: string | null
  sizeUK?: string | null
  conditionScore: number
  conditionLabel: string
  quantity: number
  sold: boolean
  featured: boolean
  newArrival: boolean
  verified: boolean
}

interface ProductPageClientProps {
  product: ProductData
  relatedProducts: RelatedProduct[]
}

function Accordion({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-[#E5E5E5] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left font-bold text-xs sm:text-sm tracking-[0.08em] uppercase text-[#0A0A0A]"
        aria-expanded={open}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn('w-4 h-4 text-[#737373] transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      {open && <div className="pb-5 text-xs sm:text-sm text-[#525252] leading-relaxed">{children}</div>}
    </div>
  )
}

export function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const router = useRouter()
  const [activeImage, setActiveImage] = useState(0)
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'

  const { addItem, hasItem, openCart } = useCartStore()
  const { toggleItem, hasItem: isWishlisted } = useWishlistStore()

  const inCart = hasItem(product.id)
  const inWishlist = isWishlisted(product.id)
  const isSoldOut = product.sold || product.quantity === 0
  const effectivePrice = product.salePrice ?? product.price

  function handleAddToCart() {
    if (isSoldOut) return
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      brand: product.brand,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      imageUrl: product.images[0]?.url ?? '/images/placeholder-shoe.jpg',
      size: product.sizeEU || 'One size',
      conditionScore: product.conditionScore,
      conditionLabel: product.conditionLabel,
      maxQuantity: 1,
    })
    toast(`${product.brand} ${product.name} added to bag`)
    openCart()
  }

  function handleBuyNow() {
    if (isSoldOut) return
    if (!inCart) {
      addItem({
        id: product.id,
        productId: product.id,
        name: product.name,
        brand: product.brand,
        slug: product.slug,
        price: product.price,
        salePrice: product.salePrice,
        imageUrl: product.images[0]?.url ?? '/images/placeholder-shoe.jpg',
        size: product.sizeEU || 'One size',
        conditionScore: product.conditionScore,
        conditionLabel: product.conditionLabel,
        maxQuantity: 1,
      })
    }
    router.push('/checkout')
  }

  function handleWishlist() {
    toggleItem(product.id)
    toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const whatsappMessage = encodeURIComponent(
    `Hi Marvin Thrifts! I want to order the ${product.brand} ${product.name} (Size EU ${product.sizeEU || 'N/A'}, KSH ${effectivePrice.toLocaleString()}). Is it still available? https://marvinthrifts.co.ke/shop/${product.slug}`
  )

  // Condition checklist points
  const conditionPoints = [
    product.creasing || 'Light creasing on upper',
    product.insoleCondition || 'Clean interior',
    product.soleCondition || 'Minimal outsole wear',
    product.stains || 'No major flaws',
  ]

  return (
    <div className="bg-[#FFFFFF] min-h-screen pt-24 sm:pt-28 pb-16">
      <div className="container-brand">
        {/* Breadcrumb matching mockup */}
        <nav className="flex items-center gap-2 text-xs text-[#737373] mb-6 sm:mb-8" aria-label="Breadcrumbs">
          <Link href="/" className="hover:text-[#0A0A0A] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#0A0A0A] transition-colors">Sneakers</Link>
          <span>/</span>
          <span className="text-[#0A0A0A] font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT: Thumbnail Column + Main Image (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
            {/* Thumbnail Strip */}
            {product.images.length > 0 && (
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto shrink-0">
                {product.images.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      'w-16 h-16 sm:w-18 sm:h-18 relative bg-[#F7F7F7] border transition-all duration-150 overflow-hidden shrink-0',
                      activeImage === i ? 'border-[#0A0A0A]' : 'border-[#E5E5E5] hover:border-[#A3A3A3]'
                    )}
                    aria-label={`Select angle ${i + 1}`}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || `${product.name} thumb ${i + 1}`}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </button>
                ))}

                {/* Additional image count indicator */}
                {product.images.length > 4 && (
                  <div className="w-16 h-16 sm:w-18 sm:h-18 bg-[#0A0A0A] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    +{product.images.length - 4}
                  </div>
                )}
              </div>
            )}

            {/* Large Main Sneaker Photo */}
            <div className="flex-1 relative aspect-[4/3] sm:aspect-square bg-[#F7F7F7] border border-[#EFEFEF] overflow-hidden">
              {product.images.length > 0 ? (
                <Image
                  src={product.images[activeImage]?.url ?? '/images/placeholder-shoe.jpg'}
                  alt={product.images[activeImage]?.altText || `${product.brand} ${product.name}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain p-4 sm:p-6 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#A3A3A3]">
                  No photo available
                </div>
              )}

              {isSoldOut && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#525252] border border-[#525252]/40 px-4 py-2">
                    SOLD OUT
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Product Info & Actions (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Top Row: Badge & Wishlist Heart */}
            <div className="flex items-center justify-between mb-3">
              <div>
                {product.newArrival ? (
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-1 bg-[#F4EFEA] text-[#8C6D44] border border-[#E8DFC8]">
                    NEW
                  </span>
                ) : (
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#737373]">
                    {product.brand}
                  </span>
                )}
              </div>

              <button
                onClick={handleWishlist}
                className="w-9 h-9 flex items-center justify-center border border-[#E5E5E5] hover:border-[#0A0A0A] rounded-full transition-colors"
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  className={cn(
                    'w-4 h-4 transition-colors',
                    inWishlist ? 'fill-red-500 text-red-500' : 'text-[#525252]'
                  )}
                />
              </button>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A] leading-tight mb-2">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-xl sm:text-2xl font-bold text-[#0A0A0A]">
                KSH {effectivePrice.toLocaleString()}
              </span>
              {product.salePrice && (
                <span className="text-sm text-[#A3A3A3] line-through">
                  KSH {product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Sizing & Condition Summary */}
            <div className="text-xs sm:text-sm text-[#737373] mb-5">
              {product.sizeEU ? `EU ${product.sizeEU}` : 'One Size'} &nbsp;•&nbsp;{' '}
              {product.conditionScore}/10 ({product.conditionLabel})
            </div>

            {/* 2 Trust Badges Side-by-Side */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 p-2.5 border border-[#EBEBEB] bg-[#FAFAFA]">
                <ShieldCheck className="w-4 h-4 text-[#0A0A0A] shrink-0" />
                <span className="text-[0.65rem] sm:text-[0.7rem] font-bold tracking-wider uppercase text-[#0A0A0A]">
                  AUTHENTICITY CHECKED
                </span>
              </div>
              <div className="flex items-center gap-2 p-2.5 border border-[#EBEBEB] bg-[#FAFAFA]">
                <CheckCircle2 className="w-4 h-4 text-[#0A0A0A] shrink-0" />
                <span className="text-[0.65rem] sm:text-[0.7rem] font-bold tracking-wider uppercase text-[#0A0A0A]">
                  QUALITY GUARANTEED
                </span>
              </div>
            </div>

            {/* Stock Availability Indicator */}
            <div className="flex items-center gap-2 text-xs text-[#16A34A] font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              {isSoldOut ? 'Sold out' : `Only ${product.quantity} pair available`}
            </div>

            {/* Stacked CTA Buttons */}
            <div className="space-y-2.5 mb-8">
              {/* Button 1: Add to Bag (Tan / Caramel Gold) */}
              <button
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className={cn(
                  'w-full h-12 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.12em] transition-colors',
                  isSoldOut
                    ? 'bg-[#E5E5E5] text-[#A3A3A3] cursor-not-allowed'
                    : inCart
                    ? 'bg-[#A8824E] text-white'
                    : 'bg-[#C49E6C] hover:bg-[#B38D5B] text-white'
                )}
              >
                <ShoppingBag className="w-4 h-4" />
                {isSoldOut ? 'SOLD OUT' : inCart ? 'IN YOUR BAG' : 'ADD TO BAG'}
              </button>

              {/* Button 2: Buy Now (Solid Black) */}
              <button
                onClick={handleBuyNow}
                disabled={isSoldOut}
                className={cn(
                  'w-full h-12 flex items-center justify-center text-xs sm:text-sm font-bold uppercase tracking-[0.12em] transition-colors',
                  isSoldOut
                    ? 'bg-[#F2F2F2] text-[#A3A3A3] cursor-not-allowed'
                    : 'bg-[#0A0A0A] hover:bg-[#262626] text-white'
                )}
              >
                BUY NOW
              </button>

              {/* Button 3: WhatsApp Button (Outline Green) */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5 text-xs sm:text-sm font-bold uppercase tracking-[0.12em] transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                ORDER VIA WHATSAPP
              </a>
            </div>

            {/* Accordion Blocks */}
            <div className="border-t border-[#E5E5E5]">
              {/* Condition Details (Open by Default) */}
              <Accordion title="CONDITION DETAILS" defaultOpen={true}>
                <p className="text-xs text-[#737373] mb-3 leading-relaxed">
                  {product.conditionNotes ||
                    `Rated ${product.conditionScore}/10 (${product.conditionLabel}). Every pair has been professionally cleaned, disinfected, and inspected.`}
                </p>

                {/* 2-column checklist matching mockup */}
                <div className="grid grid-cols-2 gap-2 text-xs text-[#0A0A0A]">
                  {conditionPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <span className="text-[#16A34A]">✓</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </Accordion>

              {/* Shipping & Delivery */}
              <Accordion title="SHIPPING & DELIVERY">
                <ul className="space-y-1.5 text-xs">
                  <li>• <strong>Nairobi Delivery:</strong> 24–48 hours (Free on orders above KSh 5,000).</li>
                  <li>• <strong>Nationwide Kenya Courier:</strong> 2–4 business days.</li>
                  <li>• <strong>CBD Pickup:</strong> Available upon order confirmation.</li>
                </ul>
              </Accordion>

              {/* Returns & Exchange */}
              <Accordion title="RETURNS & EXCHANGE">
                <p className="text-xs leading-relaxed">
                  We provide a 7-day return window if an item has major undisclosed defects or fails verified authenticity standards.
                </p>
              </Accordion>

              {/* Authenticity */}
              <Accordion title="AUTHENTICITY">
                <p className="text-xs leading-relaxed">
                  100% verified genuine footwear. Every sneaker is physically inspected for stitch density, materials, SKU tags, and box labels.
                </p>
              </Accordion>

              {/* Size Guide */}
              <Accordion title="SIZE GUIDE">
                <div className="text-xs space-y-1">
                  <p>• <strong>EU:</strong> {product.sizeEU || '—'} &nbsp;|&nbsp; <strong>UK:</strong> {product.sizeUK || '—'} &nbsp;|&nbsp; <strong>US:</strong> {product.sizeUS || '—'} &nbsp;|&nbsp; <strong>CM:</strong> {product.sizeCM || '—'}</p>
                </div>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Bottom Related Section: YOU MAY ALSO LIKE */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#EFEFEF]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-base sm:text-lg font-bold tracking-[0.08em] uppercase text-[#0A0A0A]">
                YOU MAY ALSO LIKE
              </h2>
              <div className="flex items-center gap-2 text-sm text-[#737373]">
                <button className="p-1.5 border border-[#E5E5E5] hover:border-[#0A0A0A] transition-colors" aria-label="Previous">
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 border border-[#E5E5E5] hover:border-[#0A0A0A] transition-colors" aria-label="Next">
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.slice(0, 4).map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
