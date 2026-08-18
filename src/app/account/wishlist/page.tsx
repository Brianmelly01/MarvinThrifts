import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = { title: 'My Wishlist' }

export default async function WishlistPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login?callbackUrl=/account/wishlist')

  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        include: {
          brand: true,
          images: { where: { isPrimary: true }, take: 1 },
        },
      },
    },
  })

  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
      <div className="bg-[#0A0A0A] py-10">
        <div className="container-brand">
          <Link href="/account" className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to account
          </Link>
          <h1 className="font-display text-4xl text-white">WISHLIST ({wishlist.length})</h1>
        </div>
      </div>

      <div className="container-brand py-10">
        {wishlist.length === 0 ? (
          <div className="bg-white border border-[#E5E5E5] p-16 text-center max-w-md mx-auto">
            <div className="text-4xl mb-4">🤍</div>
            <h2 className="font-bold text-lg mb-2">Your wishlist is empty</h2>
            <p className="text-[#737373] text-sm mb-6">Save items you love by tapping the heart icon on any product.</p>
            <Link href="/shop" className="btn btn-primary">Browse Collection</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {wishlist.map(({ product, id }) => (
              <Link
                key={id}
                href={`/shop/${product.slug}`}
                className="group bg-white border border-[#E5E5E5] hover:border-[#C9A84C] transition-all"
              >
                <div className="aspect-[3/4] bg-[#F5F5F5] overflow-hidden">
                  {product.images[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#D4D4D4] text-4xl">👟</div>
                  )}
                </div>
                <div className="p-3">
                  {product.sold && (
                    <div className="text-[0.6rem] font-bold text-red-500 uppercase tracking-wide mb-1">Sold Out</div>
                  )}
                  <div className="text-[0.65rem] text-[#737373] font-medium">{product.brand.name}</div>
                  <div className="text-sm font-semibold truncate">{product.name}</div>
                  <div className="text-[0.7rem] text-[#A3A3A3] mt-0.5">EU {product.sizeEU || '—'}</div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-bold">{formatPrice(product.salePrice ?? product.price)}</span>
                    {product.salePrice && (
                      <span className="text-xs text-[#A3A3A3] line-through">{formatPrice(product.price)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
