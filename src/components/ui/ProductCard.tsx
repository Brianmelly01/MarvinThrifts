'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { toast } from '@/components/ui/Toaster'

interface ProductCardProps {
  product: {
    id: string
    slug: string
    name: string
    brand: string
    price: number
    salePrice?: number | null
    imageUrl: string
    hoverImageUrl?: string | null
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
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  const { addItem, hasItem } = useCartStore()
  const { toggleItem, hasItem: isWishlisted } = useWishlistStore()

  const inCart = hasItem(product.id)
  const inWishlist = isWishlisted(product.id)
  const isLowStock = !product.sold && product.quantity === 1
  const isSoldOut = product.sold || product.quantity === 0
  const effectivePrice = product.salePrice ?? product.price

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    if (isSoldOut || inCart) return
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      brand: product.brand,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice ?? undefined,
      imageUrl: product.imageUrl,
      size: product.sizeEU || product.sizeUK || 'One size',
      conditionScore: product.conditionScore,
      conditionLabel: product.conditionLabel,
      maxQuantity: 1,
    })
    toast(`${product.brand} ${product.name} added to bag`)
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    toggleItem(product.id)
    toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <article
      className="group relative flex flex-col bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/shop/${product.slug}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative overflow-hidden bg-[#F5F5F5] aspect-[3/4]">
          <Image
            src={imageError ? '/images/placeholder-shoe.jpg' : product.imageUrl}
            alt={`${product.brand} ${product.name}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              'object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]',
              isHovered && !isSoldOut && 'scale-[1.06]'
            )}
            priority={priority}
            onError={() => setImageError(true)}
          />

          {isSoldOut && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#525252] border border-[#525252]/40 px-3 py-1.5">
                Sold Out
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.newArrival && !isSoldOut && (
              <span className="badge badge-new">New</span>
            )}
            {isLowStock && !isSoldOut && (
              <span className="badge badge-low-stock">Only 1 left</span>
            )}
            {product.salePrice && !isSoldOut && (
              <span className="badge badge-popular">Sale</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={cn(
              'absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white border transition-all duration-200',
              inWishlist ? 'border-red-200 opacity-100' : 'border-[#E5E5E5] hover:border-[#C9A84C]',
              isHovered || inWishlist ? 'opacity-100' : 'opacity-0 translate-y-1'
            )}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={cn('w-4 h-4 transition-colors', inWishlist ? 'fill-red-500 text-red-500' : 'text-[#525252]')} />
          </button>

          {/* Quick actions */}
          {!isSoldOut && (
            <div className={cn(
              'absolute bottom-0 left-0 right-0 p-3 flex gap-2 transition-all duration-300',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            )}>
              <button
                onClick={handleAddToCart}
                disabled={isSoldOut || inCart}
                className={cn(
                  'flex-1 h-10 flex items-center justify-center gap-2 text-[0.7rem] font-semibold tracking-[0.1em] uppercase transition-all duration-200',
                  inCart ? 'bg-[#C9A84C] text-white' : 'bg-[#0A0A0A] text-white hover:bg-[#2A2A2A]'
                )}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                {inCart ? 'In Bag' : 'Add to Bag'}
              </button>
              <span className="w-10 h-10 flex items-center justify-center bg-white border border-[#E5E5E5] text-[#525252]">
                <Eye className="w-4 h-4" />
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 flex-1">
          <div className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-[#737373] mb-0.5">
            {product.brand}
          </div>
          <h3 className="text-sm font-semibold text-[#0A0A0A] leading-snug mb-2 group-hover:text-[#2A2A2A] transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className={cn('text-sm font-bold', isSoldOut && 'text-[#A3A3A3] line-through')}>
                {formatPrice(effectivePrice)}
              </span>
              {product.salePrice && (
                <span className="text-xs text-[#A3A3A3] line-through">{formatPrice(product.price)}</span>
              )}
            </div>
            {product.verified && (
              <span className="text-[0.6rem] text-[#16A34A] font-semibold tracking-wide">✓ Verified</span>
            )}
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[0.7rem] text-[#A3A3A3]">
              {product.sizeEU ? `EU ${product.sizeEU}` : 'One size'}
            </span>
            <span className="text-[0.7rem] text-[#A3A3A3]">{product.conditionScore}/10</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white">
      <div className="skeleton aspect-[3/4]" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-20" />
      </div>
    </div>
  )
}
