'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, ArrowRight, ShoppingBag, MessageCircle } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, getSubtotal, getItemCount } = useCartStore()
  const subtotal = getSubtotal()
  const count = getItemCount()
  const freeThreshold = 5000
  const deliveryFee = subtotal >= freeThreshold ? 0 : 200

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F4F0] pt-[88px] flex items-center justify-center">
        <div className="text-center py-20 px-4">
          <ShoppingBag className="w-14 h-14 text-[#D4D4D4] mx-auto mb-5" />
          <h1 className="font-display text-4xl text-[#0A0A0A] mb-3">YOUR BAG IS EMPTY</h1>
          <p className="text-[#737373] mb-8 max-w-sm mx-auto">
            Looks like you haven&apos;t added anything yet. Head to the shop to find your next favourite pair.
          </p>
          <Link href="/shop" className="btn btn-primary btn-lg">Browse All Shoes</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
      <div className="bg-[#0A0A0A] py-10">
        <div className="container-brand">
          <h1 className="font-display text-4xl text-white">YOUR BAG ({count})</h1>
        </div>
      </div>

      <div className="container-brand py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            {/* Free delivery progress */}
            {subtotal < freeThreshold && (
              <div className="bg-white border border-[#E5E5E5] p-4 mb-5">
                <p className="text-sm text-[#525252] mb-2">
                  Add <strong>{formatPrice(freeThreshold - subtotal)}</strong> more for free Nairobi delivery
                </p>
                <div className="h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                  <div
                    className="h-1.5 bg-[#C9A84C] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / freeThreshold) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="bg-white border border-[#E5E5E5] divide-y divide-[#F2F2F2]">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-5 p-5">
                  <Link href={`/shop/${item.slug}`} className="shrink-0">
                    <div className="w-24 h-28 bg-[#F5F5F5] relative overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-[#737373] mb-0.5">
                          {item.brand}
                        </div>
                        <Link href={`/shop/${item.slug}`} className="font-semibold text-sm hover:text-[#C9A84C] transition-colors">
                          {item.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-[#A3A3A3] hover:text-[#DC2626] transition-colors p-1 shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-[0.72rem] text-[#A3A3A3]">
                      <span>EU {item.size}</span>
                      <span>·</span>
                      <span>{item.conditionScore}/10 — {item.conditionLabel}</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold">{formatPrice(item.salePrice ?? item.price)}</span>
                        {item.salePrice && (
                          <span className="text-sm text-[#A3A3A3] line-through">{formatPrice(item.price)}</span>
                        )}
                      </div>
                      <span className="text-[0.65rem] font-semibold text-[#16A34A] uppercase tracking-wide">✓ 1 of 1</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Link href="/shop" className="flex items-center gap-2 text-sm text-[#737373] hover:text-[#0A0A0A] transition-colors">
                ← Continue shopping
              </Link>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#E5E5E5] p-6 sticky top-24">
              <h2 className="font-bold text-sm tracking-[0.08em] uppercase mb-5">Order Summary</h2>

              <div className="space-y-3 mb-4 pb-4 border-b border-[#F2F2F2]">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-[#525252] truncate pr-4 flex-1">{item.brand} {item.name}</span>
                    <span className="font-medium shrink-0">{formatPrice(item.salePrice ?? item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#737373]">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#737373]">Delivery (est.)</span>
                  <span className={deliveryFee === 0 ? 'text-[#16A34A] font-medium' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `from ${formatPrice(deliveryFee)}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-3 border-t border-[#E5E5E5] text-base">
                  <span>Total</span>
                  <span className="text-[#C9A84C]">{formatPrice(subtotal + deliveryFee)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn btn-primary w-full mb-3 gap-2">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full bg-[#25D366] hover:bg-[#20BD5C] text-white gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Order via WhatsApp
              </a>

              {/* Trust signals */}
              <div className="mt-5 space-y-2">
                {['🔒 Secure checkout', '✅ Authenticity guaranteed', '🚚 Delivery across Kenya'].map((line) => (
                  <p key={line} className="text-[0.7rem] text-[#A3A3A3]">{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
