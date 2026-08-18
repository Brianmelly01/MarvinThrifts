'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/cn'
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
  const [imageError, setImageError] = useState(false)
  const { toggleItem, hasItem: isWishlisted } = useWishlistStore()

  const inWishlist = isWishlisted(product.id)
  const isLowStock = !product.sold && product.quantity === 1
  const isSoldOut = product.sold || product.quantity === 0
  const effectivePrice = product.salePrice ?? product.price

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(product.id)
    toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <article className="group relative flex flex-col bg-white border border-[#EFEFEF] hover:border-[#D4D4D4] transition-all duration-200">
      <Link href={`/shop/${product.slug}`} className="flex flex-col flex-1">
        {/* Sneaker Image Container */}
        <div className="relative overflow-hidden bg-[#F7F7F7] aspect-[4/3] sm:aspect-square flex items-center justify-center p-3 sm:p-4">
          <Image
            src={imageError ? '/images/placeholder-shoe.jpg' : product.imageUrl}
            alt={`${product.brand} ${product.name}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={cn(
              'object-contain p-2 transition-transform duration-500 ease-out',
              !isSoldOut && 'group-hover:scale-105'
            )}
            priority={priority}
            onError={() => setImageError(true)}
          />

          {/* Sold Out Overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
              <span className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#525252] border border-[#525252]/40 px-2.5 py-1">
                SOLD OUT
              </span>
            </div>
          )}

          {/* Top Left Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {product.newArrival && !isSoldOut && (
              <span className="text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#0A0A0A] text-white">
                NEW
              </span>
            )}
            {isLowStock && !product.newArrival && !isSoldOut && (
              <span className="text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#FFF4EB] text-[#D97706] border border-[#FED7AA]">
                ONLY 1 LEFT
              </span>
            )}
            {product.featured && !product.newArrival && !isLowStock && !isSoldOut && (
              <span className="text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#F4EFEA] text-[#8C6D44] border border-[#E8DFC8]">
                POPULAR
              </span>
            )}
          </div>

          {/* Top Right Wishlist Heart Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/90 hover:bg-white border border-[#E5E5E5] rounded-full transition-all duration-150 z-10 shadow-sm"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={cn(
                'w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors',
                inWishlist ? 'fill-red-500 text-red-500' : 'text-[#737373] hover:text-[#0A0A0A]'
              )}
            />
          </button>
        </div>

        {/* Product Info Block */}
        <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between bg-white">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-[#0A0A0A] leading-snug line-clamp-1 group-hover:text-[#C49E6C] transition-colors">
              {product.name}
            </h3>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-[#0A0A0A]">
                KSH {effectivePrice.toLocaleString()}
              </span>
              {product.salePrice && (
                <span className="text-[0.65rem] sm:text-xs text-[#A3A3A3] line-through">
                  KSH {product.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="mt-1.5 text-[0.68rem] sm:text-[0.72rem] text-[#737373]">
            {product.sizeEU ? `EU ${product.sizeEU}` : 'One size'} • {product.conditionScore}/10
          </div>
        </div>
      </Link>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-[#EFEFEF]">
      <div className="skeleton aspect-square" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3.5 w-3/4" />
        <div className="skeleton h-3.5 w-1/2" />
        <div className="skeleton h-3 w-1/3" />
      </div>
    </div>
  )
}
