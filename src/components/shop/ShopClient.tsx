'use client'

import { useState, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Filter, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'
import { ProductCard, ProductCardSkeleton } from '@/components/ui/ProductCard'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string; slug: string; name: string; brand: string
  price: number; salePrice?: number | null; imageUrl: string
  sizeEU?: string | null; sizeUK?: string | null
  conditionScore: number; conditionLabel: string
  quantity: number; sold: boolean; featured: boolean; newArrival: boolean; verified: boolean
}

interface Brand { id: string; name: string; slug: string }
interface Category { id: string; name: string; slug: string }

interface ShopClientProps {
  initialProducts: Product[]
  brands: Brand[]
  categories: Category[]
  total: number
  pages: number
  searchParams: Record<string, string | string[] | undefined>
}

const EU_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
]
const CONDITION_OPTIONS = [
  { value: '9-10', label: '9–10 / 10 (Like New)' },
  { value: '8-9', label: '8–8.9 / 10 (Very Good)' },
  { value: '7-8', label: '7–7.9 / 10 (Good)' },
  { value: '6-7', label: '6–6.9 / 10 (Fair)' },
]

function FilterAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-[#E5E5E5] py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-[0.72rem] font-bold tracking-[0.12em] uppercase text-[#0A0A0A]">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-[#737373]" /> : <ChevronDown className="w-4 h-4 text-[#737373]" />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

export function ShopClient({ initialProducts, brands, categories, total, pages, searchParams }: ShopClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const currentParams = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)

  const updateParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(currentParams.toString())
    if (value === null || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.delete('page') // reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`)
  }, [currentParams, pathname, router])

  const toggleArrayParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(currentParams.toString())
    const existing = params.getAll(key)
    if (existing.includes(value)) {
      params.delete(key)
      existing.filter((v) => v !== value).forEach((v) => params.append(key, v))
    } else {
      params.append(key, value)
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }, [currentParams, pathname, router])

  const currentSort = (searchParams.sort as string) || 'newest'
  const currentBrands = Array.isArray(searchParams.brand) ? searchParams.brand : searchParams.brand ? [searchParams.brand] : []
  const currentSizes = Array.isArray(searchParams.size) ? searchParams.size : searchParams.size ? [searchParams.size] : []
  const currentCondition = searchParams.condition as string || ''

  const activeFiltersCount = currentBrands.length + currentSizes.length + (currentCondition ? 1 : 0)

  const FilterSidebar = () => (
    <div className="w-full">
      {/* Clear all */}
      {activeFiltersCount > 0 && (
        <button
          onClick={() => router.push(pathname)}
          className="flex items-center gap-2 text-[0.72rem] font-semibold text-[#DC2626] hover:text-[#B91C1C] transition-colors mb-4"
        >
          <X className="w-3.5 h-3.5" />
          Clear all filters ({activeFiltersCount})
        </button>
      )}

      <FilterAccordion title="Brand">
        <div className="space-y-2">
          {brands.map((b) => (
            <label key={b.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={currentBrands.includes(b.slug)}
                onChange={() => toggleArrayParam('brand', b.slug)}
                className="w-4 h-4 border-[#D4D4D4] accent-[#0A0A0A]"
              />
              <span className="text-sm text-[#525252] group-hover:text-[#0A0A0A] transition-colors">{b.name}</span>
            </label>
          ))}
        </div>
      </FilterAccordion>

      <FilterAccordion title="EU Size">
        <div className="flex flex-wrap gap-2">
          {EU_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleArrayParam('size', size)}
              className={cn(
                'w-11 h-10 text-sm font-medium border transition-all duration-150',
                currentSizes.includes(size)
                  ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white'
                  : 'border-[#D4D4D4] text-[#525252] hover:border-[#0A0A0A]'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterAccordion>

      <FilterAccordion title="Condition">
        <div className="space-y-2">
          {CONDITION_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="condition"
                checked={currentCondition === opt.value}
                onChange={() => updateParam('condition', currentCondition === opt.value ? null : opt.value)}
                className="w-4 h-4 accent-[#0A0A0A]"
              />
              <span className="text-sm text-[#525252] group-hover:text-[#0A0A0A] transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </FilterAccordion>

      <FilterAccordion title="Price Range">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.minPrice as string || ''}
            onBlur={(e) => updateParam('minPrice', e.target.value || null)}
            className="w-full h-9 px-3 text-sm border border-[#D4D4D4] focus:border-[#0A0A0A] outline-none"
          />
          <span className="text-[#A3A3A3]">—</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.maxPrice as string || ''}
            onBlur={(e) => updateParam('maxPrice', e.target.value || null)}
            className="w-full h-9 px-3 text-sm border border-[#D4D4D4] focus:border-[#0A0A0A] outline-none"
          />
        </div>
        <p className="text-[0.7rem] text-[#A3A3A3] mt-1">Values in KSh</p>
      </FilterAccordion>
    </div>
  )

  return (
    <div className="container-brand py-8">
      {/* Top bar — sort + mobile filter toggle */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          {/* Mobile filter button */}
          <button
            onClick={() => setFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 btn btn-outline btn-sm"
          >
            <Filter className="w-4 h-4" />
            Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          <p className="text-sm text-[#737373] hidden sm:block">
            {total} {total === 1 ? 'result' : 'results'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#737373]" />
          <select
            value={currentSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="text-sm border border-[#D4D4D4] bg-white py-2 px-3 focus:border-[#0A0A0A] outline-none cursor-pointer"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            <div className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-[#0A0A0A] mb-4">
              FILTER
            </div>
            <FilterSidebar />
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1 min-w-0">
          {initialProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl font-display text-[#D4D4D4] mb-3">NO RESULTS</p>
              <p className="text-sm text-[#737373] mb-6">
                Try adjusting your filters or search a different term.
              </p>
              <button onClick={() => router.push(pathname)} className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {initialProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 4} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => {
                const currentPage = Number(searchParams.page || 1)
                return (
                  <button
                    key={p}
                    onClick={() => updateParam('page', String(p))}
                    className={cn(
                      'w-10 h-10 text-sm font-medium border transition-all',
                      currentPage === p
                        ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                        : 'border-[#D4D4D4] text-[#525252] hover:border-[#0A0A0A]'
                    )}
                  >
                    {p}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[300] lg:hidden" onClick={() => setFilterOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-80 bg-white z-[400] lg:hidden flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
              <h2 className="text-sm font-bold tracking-[0.08em] uppercase">Filter</h2>
              <button onClick={() => setFilterOpen(false)} className="p-2 text-[#737373] hover:text-[#0A0A0A]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <FilterSidebar />
            </div>
            <div className="px-6 py-4 border-t border-[#E5E5E5]">
              <button onClick={() => setFilterOpen(false)} className="btn btn-primary w-full">
                Show Results ({total})
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
