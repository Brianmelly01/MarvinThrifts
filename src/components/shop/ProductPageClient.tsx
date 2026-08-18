'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Heart, MessageCircle, ChevronDown, ChevronRight, Shield, Star, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatPrice, getWhatsAppOrderUrl } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { ProductCard } from '@/components/ui/ProductCard'
import { toast } from '@/components/ui/Toaster'

interface ProductData {
  id: string; slug: string; sku: string; name: string; brand: string
  brandSlug: string; category: string; description: string
  price: number; salePrice?: number; images: { url: string; altText: string }[]
  sizeEU: string; sizeUK: string; sizeUS: string; sizeCM: string
  conditionScore: number; conditionLabel: string; conditionNotes: string
  defects: string[]; creasing: string; soleCondition: string
  insoleCondition: string; stains: string; accessories: string
  quantity: number; sold: boolean; verified: boolean; newArrival: boolean; colorMain: string
  reviews: { id: string; userName: string; rating: number; comment: string; verified: boolean; createdAt: string }[]
}

interface RelatedProduct {
  id: string; slug: string; name: string; brand: string; price: number
  salePrice?: number | null; imageUrl: string; sizeEU?: string | null; sizeUK?: string | null
  conditionScore: number; conditionLabel: string; quantity: number; sold: boolean
  featured: boolean; newArrival: boolean; verified: boolean
}

interface ProductPageClientProps {
  product: ProductData
  relatedProducts: RelatedProduct[]
}

function ConditionBar({ score }: { score: number }) {
  const pct = ((score - 6) / 4) * 100
  const color = score >= 9 ? '#16A34A' : score >= 8 ? '#22C55E' : score >= 7 ? '#D97706' : '#DC2626'
  return (
    <div className="h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden w-full">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  )
}

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#E5E5E5]">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold tracking-wide">{title}</span>
        <ChevronDown className={cn('w-4 h-4 text-[#737373] transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && <div className="pb-4 text-sm text-[#525252] leading-relaxed">{children}</div>}
    </div>
  )
}

export function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const [activeImage, setActiveImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const { addItem, hasItem } = useCartStore()
  const { toggleItem, hasItem: isWishlisted } = useWishlistStore()

  const inCart = hasItem(product.id)
  const inWishlist = isWishlisted(product.id)
  const isSoldOut = product.sold || product.quantity === 0
  const effectivePrice = product.salePrice ?? product.price

  function handleAddToCart() {
    if (isSoldOut || inCart) return
    addItem({
      id: product.id, productId: product.id, name: product.name,
      brand: product.brand, slug: product.slug, price: product.price,
      salePrice: product.salePrice, imageUrl: product.images[0]?.url ?? '',
      size: product.sizeEU || 'One size', conditionScore: product.conditionScore,
      conditionLabel: product.conditionLabel, maxQuantity: 1,
    })
    toast(`${product.brand} ${product.name} added to bag`)
  }

  const whatsappUrl = getWhatsAppOrderUrl({
    productName: product.name, brand: product.brand,
    size: product.sizeEU, price: effectivePrice, slug: product.slug,
  })

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0

  return (
    <div className="container-brand py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[0.72rem] text-[#737373] mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#0A0A0A] transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-[#0A0A0A] transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/brands/${product.brandSlug}`} className="hover:text-[#0A0A0A] transition-colors">{product.brand}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#0A0A0A] truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* LEFT: Image gallery */}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px] scrollbar-thin">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'shrink-0 w-16 h-20 relative border-2 transition-all duration-150 overflow-hidden bg-[#F5F5F5]',
                    activeImage === i ? 'border-[#0A0A0A]' : 'border-transparent hover:border-[#D4D4D4]'
                  )}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image src={img.url} alt={img.altText || `${product.name} angle ${i + 1}`} fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="flex-1 relative">
            <div
              className="relative overflow-hidden bg-[#F5F5F5] cursor-zoom-in aspect-[3/4]"
              onClick={() => setLightboxOpen(true)}
            >
              {product.images.length > 0 ? (
                <Image
                  src={product.images[activeImage]?.url ?? ''}
                  alt={product.images[activeImage]?.altText || `${product.brand} ${product.name}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[#D4D4D4]">No image</div>
              )}
              <button
                className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                aria-label="Zoom image"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              {isSoldOut && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <span className="text-sm font-bold tracking-[0.15em] uppercase text-[#525252] border border-[#525252]/40 px-4 py-2">Sold Out</span>
                </div>
              )}
              {product.newArrival && !isSoldOut && (
                <div className="absolute top-4 left-4">
                  <span className="badge badge-new">New Drop</span>
                </div>
              )}
            </div>

            {/* Mobile: image count indicator */}
            {product.images.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-3 sm:hidden">
                {product.images.map((_, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={cn('w-1.5 h-1.5 rounded-full transition-all', activeImage === i ? 'bg-[#0A0A0A] w-4' : 'bg-[#D4D4D4]')}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Product info */}
        <div className="flex flex-col">
          {/* Brand */}
          <Link href={`/brands/${product.brandSlug}`} className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#C9A84C] hover:text-[#A8892E] transition-colors mb-2">
            {product.brand}
          </Link>

          {/* Name */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A0A0A] mb-3 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={cn('w-4 h-4', s <= Math.round(avgRating) ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-[#E5E5E5]')} />
                ))}
              </div>
              <span className="text-sm text-[#737373]">({product.reviews.length} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-[#0A0A0A]">{formatPrice(effectivePrice)}</span>
            {product.salePrice && (
              <span className="text-lg text-[#A3A3A3] line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.verified && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F0FDF4] border border-[#BBF7D0] text-[0.7rem] font-semibold text-[#16A34A] uppercase tracking-wide">
                <Shield className="w-3.5 h-3.5" /> Authenticity Checked
              </span>
            )}
            {!isSoldOut && (
              <span className="px-3 py-1.5 bg-[#F0FDF4] border border-[#BBF7D0] text-[0.7rem] font-semibold text-[#16A34A] uppercase tracking-wide">
                In Stock — {product.quantity} available
              </span>
            )}
          </div>

          {/* Key specs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {product.sizeEU && (
              <div className="p-3 bg-white border border-[#E5E5E5]">
                <div className="text-[0.65rem] text-[#737373] uppercase tracking-wide mb-0.5">Size (EU)</div>
                <div className="text-sm font-bold">{product.sizeEU}</div>
              </div>
            )}
            {product.sizeUK && (
              <div className="p-3 bg-white border border-[#E5E5E5]">
                <div className="text-[0.65rem] text-[#737373] uppercase tracking-wide mb-0.5">Size (UK)</div>
                <div className="text-sm font-bold">{product.sizeUK}</div>
              </div>
            )}
            <div className="p-3 bg-white border border-[#E5E5E5]">
              <div className="text-[0.65rem] text-[#737373] uppercase tracking-wide mb-1">Condition</div>
              <div className="text-sm font-bold mb-1.5">{product.conditionScore}/10 — {product.conditionLabel}</div>
              <ConditionBar score={product.conditionScore} />
            </div>
            {product.colorMain && (
              <div className="p-3 bg-white border border-[#E5E5E5]">
                <div className="text-[0.65rem] text-[#737373] uppercase tracking-wide mb-0.5">Colorway</div>
                <div className="text-sm font-bold">{product.colorMain}</div>
              </div>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={isSoldOut}
              className={cn(
                'btn btn-lg w-full gap-3',
                isSoldOut ? 'bg-[#E5E5E5] text-[#A3A3A3] cursor-not-allowed' :
                inCart ? 'btn-gold' : 'btn-primary'
              )}
              id="product-add-to-cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {isSoldOut ? 'Sold Out' : inCart ? 'Added to Bag ✓' : 'Add to Bag'}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg w-full gap-3 bg-[#25D366] hover:bg-[#20BD5C] text-white transition-colors"
              id="product-whatsapp-order"
            >
              <MessageCircle className="w-5 h-5" />
              Order via WhatsApp
            </a>

            <button
              onClick={() => { toggleItem(product.id); toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist') }}
              className="btn btn-outline btn-lg w-full gap-3"
              id="product-wishlist"
            >
              <Heart className={cn('w-5 h-5', inWishlist && 'fill-red-500 text-red-500')} />
              {inWishlist ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </button>
          </div>

          {/* Accordions */}
          <div className="border-t border-[#E5E5E5]">
            <AccordionItem title="Condition Details">
              {product.conditionNotes && <p className="mb-3">{product.conditionNotes}</p>}
              <ul className="space-y-1.5">
                {product.creasing && <li className="flex gap-2">• <span><strong>Creasing:</strong> {product.creasing}</span></li>}
                {product.soleCondition && <li className="flex gap-2">• <span><strong>Sole:</strong> {product.soleCondition}</span></li>}
                {product.insoleCondition && <li className="flex gap-2">• <span><strong>Insole:</strong> {product.insoleCondition}</span></li>}
                {product.stains && <li className="flex gap-2">• <span><strong>Stains:</strong> {product.stains}</span></li>}
                {product.accessories && <li className="flex gap-2">• <span><strong>Accessories:</strong> {product.accessories}</span></li>}
                {product.defects.map((d, i) => <li key={i} className="flex gap-2">• {d}</li>)}
              </ul>
            </AccordionItem>

            <AccordionItem title="Shipping & Delivery">
              <p>We offer delivery across Kenya:</p>
              <ul className="mt-2 space-y-1">
                <li>• <strong>Nairobi delivery:</strong> KSh 200 (1–2 days)</li>
                <li>• <strong>Nationwide courier:</strong> KSh 400 (3–5 days)</li>
                <li>• <strong>Free delivery</strong> on orders above KSh 5,000</li>
                <li>• <strong>Pickup available</strong> in Nairobi (free)</li>
              </ul>
            </AccordionItem>

            <AccordionItem title="Returns & Exchange">
              <p>We accept returns within 7 days of delivery if the item was misrepresented. Since all items are pre-loved, we encourage you to review the condition details carefully before purchasing. Exchanges are subject to availability.</p>
            </AccordionItem>

            <AccordionItem title="Authenticity">
              {product.verified
                ? <p>This item has been inspected and verified by our team. We are confident in its authenticity.</p>
                : <p>This item has not been through our full authentication process. Please review the images carefully.</p>
              }
            </AccordionItem>

            <AccordionItem title="Size Guide">
              <div className="overflow-x-auto">
                <table className="text-sm w-full">
                  <thead><tr className="border-b">
                    <th className="py-2 text-left font-semibold">EU</th>
                    <th className="py-2 text-left font-semibold">UK</th>
                    <th className="py-2 text-left font-semibold">US (M)</th>
                    <th className="py-2 text-left font-semibold">CM</th>
                  </tr></thead>
                  <tbody className="divide-y divide-[#F2F2F2]">
                    {[['38','5','6','24'],['39','5.5','6.5','24.5'],['40','6','7','25'],
                      ['41','7','8','25.5'],['42','8','9','26.5'],['43','9','10','27'],
                      ['44','9.5','10.5','27.5'],['45','10','11','28']].map(([eu, uk, us, cm]) => (
                      <tr key={eu} className={product.sizeEU === eu ? 'bg-[#C9A84C]/10 font-semibold' : ''}>
                        <td className="py-1.5">{eu}</td>
                        <td className="py-1.5">{uk}</td>
                        <td className="py-1.5">{us}</td>
                        <td className="py-1.5">{cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionItem>
          </div>

          {/* SKU */}
          <p className="text-[0.65rem] text-[#A3A3A3] mt-4">SKU: {product.sku}</p>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#E5E5E5]" aria-labelledby="reviews-heading">
          <h2 id="reviews-heading" className="font-display text-3xl mb-8">REVIEWS</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.reviews.map((r) => (
              <div key={r.id} className="bg-white p-5 border border-[#E5E5E5]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={cn('w-3.5 h-3.5', s <= r.rating ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-[#E5E5E5]')} />
                    ))}
                  </div>
                  {r.verified && <span className="text-[0.6rem] text-[#16A34A] font-semibold">✓ Verified</span>}
                </div>
                {r.comment && <p className="text-sm text-[#525252] leading-relaxed mb-3">{r.comment}</p>}
                <p className="text-[0.65rem] text-[#A3A3A3]">{r.userName} · {new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#E5E5E5]" aria-labelledby="related-heading">
          <h2 id="related-heading" className="font-display text-3xl mb-8">YOU MAY ALSO LIKE</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxOpen && product.images.length > 0 && (
        <div
          className="fixed inset-0 bg-black/95 z-[600] flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button className="absolute top-4 right-4 text-white/60 hover:text-white p-2" aria-label="Close">✕</button>
          <div className="relative w-full max-w-2xl mx-4 aspect-[3/4]">
            <Image
              src={product.images[activeImage]?.url ?? ''}
              alt={product.images[activeImage]?.altText || product.name}
              fill className="object-contain"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        </div>
      )}
    </div>
  )
}
