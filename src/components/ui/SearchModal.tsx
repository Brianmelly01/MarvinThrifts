'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Search, ArrowRight, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface SearchResult {
  id: string
  slug: string
  name: string
  brand: string
  price: number
  imageUrl: string
  sizeEU?: string | null
}

const trendingSearches = [
  'Nike Air Force 1',
  'Jordan 1',
  'New Balance 550',
  'Adidas Campus',
  'Converse',
  'Vans Old Skool',
]

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      setQuery('')
      setResults([])
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Search with debounce
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([])
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`, {
          signal: controller.signal,
        })
        if (res.ok) {
          const data = await res.json()
          setResults(data.products || [])
        }
      } catch {
        // Ignore abort errors
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  function handleEscape(e: React.KeyboardEvent) {
    if (e.key === 'Escape') onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="absolute top-0 left-0 right-0 bg-white animate-fade-down"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <form
          onSubmit={handleSubmit}
          className="container-brand flex items-center gap-4 h-20"
        >
          <Search className="w-5 h-5 text-[#A3A3A3] shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleEscape}
            placeholder="Search for shoes, brands, styles..."
            className="flex-1 h-full text-lg text-[#0A0A0A] placeholder-[#A3A3A3] outline-none bg-transparent"
            aria-label="Search products"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); inputRef.current?.focus() }}
              className="p-2 text-[#A3A3A3] hover:text-[#0A0A0A] transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#737373] hover:text-[#0A0A0A] transition-colors ml-2"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Results panel */}
        <div className="border-t border-[#F2F2F2] max-h-[70vh] overflow-y-auto">
          <div className="container-brand py-6">
            {/* Loading */}
            {loading && (
              <div className="flex items-center gap-3 py-4">
                <div className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-[#737373]">Searching...</span>
              </div>
            )}

            {/* Search results */}
            {!loading && results.length > 0 && (
              <div>
                <div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#A3A3A3] mb-4">
                  Products
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-3 hover:bg-[#F9F9F9] transition-colors group"
                    >
                      <div className="w-14 h-16 bg-[#F5F5F5] relative shrink-0 overflow-hidden">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[0.65rem] text-[#737373] uppercase tracking-wide font-semibold">{product.brand}</div>
                        <div className="text-sm font-semibold leading-snug group-hover:text-[#C9A84C] transition-colors truncate">{product.name}</div>
                        <div className="text-sm font-bold mt-0.5">{formatPrice(product.price)}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#A3A3A3] group-hover:text-[#0A0A0A] shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
                <button
                  onClick={() => { router.push(`/shop?q=${encodeURIComponent(query)}`); onClose() }}
                  className="text-sm font-semibold text-[#C9A84C] hover:text-[#A8892E] flex items-center gap-1 transition-colors"
                >
                  View all results for "{query}"
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* No results */}
            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="py-4">
                <p className="text-sm text-[#737373]">No results found for "<strong>{query}</strong>"</p>
                <p className="text-sm text-[#A3A3A3] mt-1">Try searching for a brand name or shoe style</p>
              </div>
            )}

            {/* Trending (shown when no query) */}
            {!query && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-[#A3A3A3]" />
                  <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#A3A3A3]">
                    Popular searches
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 text-sm font-medium border border-[#E5E5E5] hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
