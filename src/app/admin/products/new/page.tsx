'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/cn'

interface Brand { id: string; name: string; slug: string }
interface Category { id: string; name: string; slug: string }

const CONDITION_LABELS = ['Poor', 'Fair', 'Good', 'Very Good', 'Like New', 'Brand New']

export default function NewProductPage() {
  const router = useRouter()
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>([''])

  const [form, setForm] = useState({
    name: '', sku: '', brandId: '', categoryId: '',
    price: '', salePrice: '', description: '',
    sizeEU: '', sizeUK: '', sizeUS: '', sizeCM: '',
    conditionScore: '8', conditionLabel: 'Very Good', conditionNotes: '',
    defects: '', creasing: '', soleCondition: '', insoleCondition: '', stains: '', accessories: '',
    colorMain: '', colorSecondary: '',
    featured: false, newArrival: true, verified: false, isActive: true,
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/brands').then(r => r.json()),
      fetch('/api/admin/categories').then(r => r.json()),
    ]).then(([b, c]) => {
      setBrands(b.brands || [])
      setCategories(c.categories || [])
      if (b.brands?.[0]) setForm(f => ({ ...f, brandId: b.brands[0].id }))
      if (c.categories?.[0]) setForm(f => ({ ...f, categoryId: c.categories[0].id }))
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          salePrice: form.salePrice ? Number(form.salePrice) : null,
          conditionScore: Number(form.conditionScore),
          images: imageUrls.filter(Boolean).map((url, i) => ({ url, isPrimary: i === 0 })),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create product')

      router.push('/admin/products')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  const field = (
    id: string, label: string, type = 'text',
    placeholder = '', required = false, hint?: string
  ) => (
    <div>
      <label htmlFor={id} className="input-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        placeholder={placeholder}
        value={(form as Record<string, unknown>)[id] as string || ''}
        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
        className="input"
      />
      {hint && <p className="text-[0.7rem] text-[#A3A3A3] mt-1">{hint}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      <div className="bg-[#0A0A0A] h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="font-display text-xl text-white tracking-widest">MARVIN</span>
          <span className="text-[0.6rem] text-[#C9A84C] font-semibold tracking-widest uppercase px-2 py-0.5 border border-[#C9A84C]/30">Admin</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Add New Product</h1>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic info */}
              <div className="bg-white border border-[#E5E5E5] p-6">
                <h2 className="font-semibold mb-5 text-sm uppercase tracking-wide">Basic Information</h2>
                <div className="space-y-4">
                  {field('name', 'Product Name', 'text', 'e.g. Air Force 1 Low \'07', true)}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="brandId" className="input-label">Brand *</label>
                      <select id="brandId" required value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })} className="input">
                        {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="categoryId" className="input-label">Category *</label>
                      <select id="categoryId" required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input">
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  {field('sku', 'SKU', 'text', 'e.g. NIKE-AF1-WHT-41', true)}

                  <div>
                    <label htmlFor="description" className="input-label">Description</label>
                    <textarea id="description" rows={4} value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="input resize-none" placeholder="Describe this product..." />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white border border-[#E5E5E5] p-6">
                <h2 className="font-semibold mb-5 text-sm uppercase tracking-wide">Pricing</h2>
                <div className="grid grid-cols-2 gap-4">
                  {field('price', 'Price (KSh)', 'number', '2500', true)}
                  {field('salePrice', 'Sale Price (KSh)', 'number', 'Optional')}
                </div>
              </div>

              {/* Sizing */}
              <div className="bg-white border border-[#E5E5E5] p-6">
                <h2 className="font-semibold mb-5 text-sm uppercase tracking-wide">Sizing</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {field('sizeEU', 'EU Size', 'text', '42')}
                  {field('sizeUK', 'UK Size', 'text', '8')}
                  {field('sizeUS', 'US Size', 'text', '9')}
                  {field('sizeCM', 'CM', 'text', '26.5')}
                </div>
              </div>

              {/* Condition */}
              <div className="bg-white border border-[#E5E5E5] p-6">
                <h2 className="font-semibold mb-5 text-sm uppercase tracking-wide">Condition</h2>
                <div className="space-y-4">
                  <div>
                    <label className="input-label">Condition Score: <strong>{form.conditionScore}/10</strong></label>
                    <input
                      type="range" min="6" max="10" step="0.5"
                      value={form.conditionScore}
                      onChange={(e) => setForm({ ...form, conditionScore: e.target.value })}
                      className="w-full accent-[#C9A84C] mt-2"
                    />
                    <div className="flex justify-between text-[0.65rem] text-[#A3A3A3] mt-1">
                      <span>6 (Fair)</span><span>8 (Good)</span><span>10 (New)</span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="conditionLabel" className="input-label">Condition Label *</label>
                    <select id="conditionLabel" value={form.conditionLabel} onChange={(e) => setForm({ ...form, conditionLabel: e.target.value })} className="input">
                      {CONDITION_LABELS.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="conditionNotes" className="input-label">Condition Notes</label>
                    <textarea id="conditionNotes" rows={3} value={form.conditionNotes}
                      onChange={(e) => setForm({ ...form, conditionNotes: e.target.value })}
                      className="input resize-none" placeholder="Overall condition description..." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[['creasing', 'Creasing'], ['soleCondition', 'Sole'], ['insoleCondition', 'Insole'], ['stains', 'Stains']].map(([key, label]) => (
                      <div key={key}>
                        <label htmlFor={key} className="input-label">{label}</label>
                        <input id={key} type="text" value={(form as unknown as Record<string, unknown>)[key] as string || ''}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          className="input" placeholder="e.g. Minimal toe box creasing" />
                      </div>
                    ))}
                  </div>

                  {field('accessories', 'Accessories Included', 'text', 'e.g. Original box, extra laces')}
                  {field('defects', 'Defects (comma-separated)', 'text', 'e.g. Small scuff on left toe')}
                </div>
              </div>

              {/* Colors */}
              <div className="bg-white border border-[#E5E5E5] p-6">
                <h2 className="font-semibold mb-5 text-sm uppercase tracking-wide">Colors</h2>
                <div className="grid grid-cols-2 gap-4">
                  {field('colorMain', 'Main Color', 'text', 'e.g. White/Black')}
                  {field('colorSecondary', 'Secondary Color', 'text', 'e.g. Gum')}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-white border border-[#E5E5E5] p-6">
                <h2 className="font-semibold mb-5 text-sm uppercase tracking-wide">Status & Visibility</h2>
                <div className="space-y-3">
                  {([
                    ['isActive', 'Active (visible in shop)'],
                    ['newArrival', 'Mark as New Arrival'],
                    ['featured', 'Featured on homepage'],
                    ['verified', 'Authenticity Verified'],
                  ] as [keyof typeof form, string][]).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={form[key] as boolean}
                        onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                        className="w-4 h-4 accent-[#0A0A0A]" />
                      <span className="text-sm text-[#525252] group-hover:text-[#0A0A0A]">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="bg-white border border-[#E5E5E5] p-6">
                <h2 className="font-semibold mb-5 text-sm uppercase tracking-wide">Images</h2>
                <p className="text-[0.72rem] text-[#737373] mb-4">Enter image URLs. First image will be the primary display image.</p>
                <div className="space-y-3">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                          const next = [...imageUrls]
                          next[i] = e.target.value
                          setImageUrls(next)
                        }}
                        className="input flex-1 text-sm"
                        placeholder={i === 0 ? 'Primary image URL *' : `Image ${i + 1} URL`}
                      />
                      {i > 0 && (
                        <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, j) => j !== i))}
                          className="p-2 text-[#A3A3A3] hover:text-red-500 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setImageUrls([...imageUrls, ''])}
                    className="flex items-center gap-2 text-sm text-[#C9A84C] hover:text-[#A8892E] transition-colors">
                    <Upload className="w-4 h-4" /> Add another image
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg gap-3">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {loading ? 'Saving...' : 'Save Product'}
              </button>

              <Link href="/admin/products" className="btn btn-outline w-full text-center">Cancel</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
