'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/cn'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, getSubtotal, getItemCount } = useCartStore()
  const subtotal = getSubtotal()
  const count = getItemCount()
  const freeThreshold = 5000

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300] animate-fade-in"
          onClick={closeCart}
        />
      )}

      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[400] flex flex-col shadow-modal transition-transform duration-350 ease-[cubic-bezier(0.4,0,0.2,1)]',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-sm font-bold tracking-[0.08em] uppercase">Your Bag</h2>
            {count > 0 && (
              <span className="w-5 h-5 bg-[#0A0A0A] text-white text-[0.6rem] font-bold rounded-full flex items-center justify-center">{count}</span>
            )}
          </div>
          <button onClick={closeCart} className="w-9 h-9 flex items-center justify-center text-[#737373] hover:text-[#0A0A0A] transition-colors" aria-label="Close cart">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free delivery bar */}
        {subtotal > 0 && subtotal < freeThreshold && (
          <div className="px-6 py-3 bg-[#F9F9F9] border-b border-[#F2F2F2]">
            <p className="text-[0.72rem] text-[#525252] mb-1.5">
              Add <strong>{formatPrice(freeThreshold - subtotal)}</strong> more for free Nairobi delivery
            </p>
            <div className="h-1 bg-[#E5E5E5] rounded-full overflow-hidden">
              <div
                className="h-1 bg-[#C9A84C] rounded-full transition-all duration-500"
                style={{ width: `${Math.min((subtotal / freeThreshold) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        {subtotal >= freeThreshold && (
          <div className="px-6 py-3 bg-[#F0FDF4] border-b border-[#E5E5E5]">
            <p className="text-[0.72rem] text-[#16A34A] font-medium">🎉 You qualify for free Nairobi delivery!</p>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
              <ShoppingBag className="w-12 h-12 text-[#D4D4D4] mb-4" />
              <h3 className="text-base font-semibold mb-2">Your bag is empty</h3>
              <p className="text-sm text-[#737373] mb-6">Start shopping to add items</p>
              <button onClick={closeCart} className="btn btn-primary px-8">Shop Now</button>
            </div>
          ) : (
            <ul className="divide-y divide-[#F2F2F2]">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 px-6 py-5">
                  <Link href={`/shop/${item.slug}`} onClick={closeCart} className="shrink-0">
                    <div className="w-20 h-24 bg-[#F5F5F5] overflow-hidden relative">
                      <Image src={item.imageUrl} alt={item.name} fill sizes="80px" className="object-cover" />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#737373] mb-0.5">{item.brand}</div>
                    <Link href={`/shop/${item.slug}`} onClick={closeCart} className="text-sm font-semibold leading-snug hover:text-[#C9A84C] transition-colors block line-clamp-2">
                      {item.name}
                    </Link>
                    <div className="flex gap-2 mt-1 text-[0.7rem] text-[#A3A3A3]">
                      <span>EU {item.size}</span>
                      <span>·</span>
                      <span>{item.conditionScore}/10</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold">{formatPrice(item.salePrice ?? item.price)}</span>
                      <button onClick={() => removeItem(item.productId)} className="text-[#A3A3A3] hover:text-[#DC2626] transition-colors p-1" aria-label="Remove item">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E5E5E5] px-6 py-5">
            <div className="flex justify-between mb-1.5">
              <span className="text-sm text-[#525252]">Subtotal</span>
              <span className="text-sm font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-sm text-[#525252]">Delivery</span>
              <span className="text-sm font-semibold">
                {subtotal >= freeThreshold ? <span className="text-[#16A34A]">FREE</span> : 'from KSh 200'}
              </span>
            </div>
            <Link href="/checkout" onClick={closeCart} className="btn btn-primary w-full mb-3">
              Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/cart" onClick={closeCart} className="btn btn-outline w-full text-sm">
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
