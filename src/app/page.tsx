import { Suspense } from 'react'
import { HeroSection } from '@/components/home/HeroSection'
import { TrustBar } from '@/components/home/TrustBar'
import { NewDropsSection } from '@/components/home/NewDropsSection'
import { BrandsSection } from '@/components/home/BrandsSection'
import { EditorialSection } from '@/components/home/EditorialSection'
import { CuratedSection } from '@/components/home/CuratedSection'
import { ComingSoonSection } from '@/components/home/ComingSoonSection'
import { MarqueeSection } from '@/components/home/MarqueeSection'
import { ProductCardSkeleton } from '@/components/ui/ProductCard'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <Suspense fallback={
        <section className="section-padding bg-[#F5F4F0]">
          <div className="container-brand">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          </div>
        </section>
      }>
        <NewDropsSection />
      </Suspense>
      <BrandsSection />
      <EditorialSection />
      <Suspense fallback={null}>
        <CuratedSection />
      </Suspense>
      <ComingSoonSection />
      <MarqueeSection />
    </>
  )
}
