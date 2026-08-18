import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Brands — Curated Authentic Footwear',
  description: 'Explore our collection of authentic pre-loved sneakers and boots by brand. Nike, Jordan, Adidas, New Balance, Converse, and more.',
}

async function getBrandsWithCounts() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true, sold: false },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    })
    return brands
  } catch {
    return []
  }
}

export default async function BrandsPage() {
  const brands = await getBrandsWithCounts()

  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px]">
      {/* Header */}
      <div className="bg-[#0A0A0A] py-16 sm:py-24">
        <div className="container-brand">
          <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3">
            Curated Directory
          </div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] text-white leading-none">
            BRANDS
          </h1>
          <p className="text-white/50 text-base max-w-lg mt-4">
            Discover authenticated, high-grade pre-loved footwear from the world&apos;s leading streetwear and athletic labels.
          </p>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="container-brand py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/shop?brand=${brand.slug}`}
              className="group bg-white border border-[#E5E5E5] p-8 hover:border-[#0A0A0A] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-3xl sm:text-4xl text-[#0A0A0A] group-hover:text-[#C9A84C] transition-colors">
                    {brand.name}
                  </h2>
                  <span className="text-[0.68rem] font-semibold tracking-[0.1em] px-2.5 py-1 bg-[#F5F4F0] text-[#525252]">
                    {brand._count.products} {brand._count.products === 1 ? 'PAIR' : 'PAIRS'}
                  </span>
                </div>
                {brand.description && (
                  <p className="text-sm text-[#737373] leading-relaxed mb-6">
                    {brand.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#0A0A0A] group-hover:text-[#C9A84C] transition-colors pt-4 border-t border-[#F2F2F2]">
                Shop {brand.name}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
