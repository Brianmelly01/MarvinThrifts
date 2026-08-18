'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, Trash2, Loader2, ArrowLeft } from 'lucide-react'

interface Brand {
  id: string
  name: string
  slug: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  sku: string
  slug: string
  brandId: string
  categoryId: string
  price: number
  salePrice: number | null
  description: string | null
  sizeEU: string | null
  sizeUK: string | null
  sizeUS: string | null
  sizeCM: string | null
  conditionScore: number
  conditionLabel: string
  conditionNotes: string | null
  creasing: string | null
  soleCondition: string | null
  insoleCondition: string | null
  stains: string | null
  accessories: string | null
  defects: string | null
  colorMain: string | null
  colorSecondary: string | null
  featured: boolean
  newArrival: boolean
  verified: boolean
  isActive: boolean
  sold: boolean
  quantity: number
}

interface Props {
  product: Product
  brands: Brand[]
  categories: Category[]
}

const CONDITION_LABELS = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent', 'Like New', 'Brand New']

export function EditProductForm({ product, brands, categories }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: product.name || '',
    sku: product.sku || '',
    brandId: product.brandId || '',
    categoryId: product.categoryId || '',
    price: String(product.price || ''),
    salePrice: product.salePrice ? String(product.salePrice) : '',
    description: product.description || '',
    sizeEU: product.sizeEU || '',
    sizeUK: product.sizeUK || '',
    sizeUS: product.sizeUS || '',
    sizeCM: product.sizeCM || '',
    conditionScore: String(product.conditionScore || 8),
    conditionLabel: product.conditionLabel || 'Very Good',
    conditionNotes: product.conditionNotes || '',
    creasing: product.creasing || '',
    soleCondition: product.soleCondition || '',
    insoleCondition: product.insoleCondition || '',
    stains: product.stains || '',
    accessories: product.accessories || '',
    defects: product.defects || '',
    colorMain: product.colorMain || '',
    colorSecondary: product.colorSecondary || '',
    featured: product.featured || false,
    newArrival: product.newArrival || false,
    verified: product.verified || false,
    isActive: product.isActive !== undefined ? product.isActive : true,
    sold: product.sold || false,
    quantity: String(product.quantity ?? 1),
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          salePrice: form.salePrice ? Number(form.salePrice) : null,
          conditionScore: Number(form.conditionScore),
          quantity: Number(form.quantity),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update product')

      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Are you sure you want to permanently delete "${product.name}"?`)) {
      return
    }

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/admin/products')
      } else {
        alert('Failed to delete product')
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm">
          ✓ Product updated successfully!
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-4">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-[#737373]">
              Basic Details
            </h2>

            <div>
              <label htmlFor="edit-name" className="input-label">Product Name *</label>
              <input
                id="edit-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-brandId" className="input-label">Brand *</label>
                <select
                  id="edit-brandId"
                  required
                  value={form.brandId}
                  onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                  className="input"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="edit-categoryId" className="input-label">Category *</label>
                <select
                  id="edit-categoryId"
                  required
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="input"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="edit-sku" className="input-label">SKU *</label>
              <input
                id="edit-sku"
                type="text"
                required
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="edit-desc" className="input-label">Description</label>
              <textarea
                id="edit-desc"
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input resize-none h-24 py-2"
              />
            </div>
          </div>

          {/* Pricing & Sizing */}
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-4">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-[#737373]">
              Pricing &amp; Sizing
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-price" className="input-label">Price (KSh) *</label>
                <input
                  id="edit-price"
                  type="number"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="edit-salePrice" className="input-label">Sale Price (KSh)</label>
                <input
                  id="edit-salePrice"
                  type="number"
                  value={form.salePrice}
                  onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                  className="input"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <label htmlFor="edit-sizeEU" className="input-label">EU Size</label>
                <input
                  id="edit-sizeEU"
                  type="text"
                  value={form.sizeEU}
                  onChange={(e) => setForm({ ...form, sizeEU: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="edit-sizeUK" className="input-label">UK Size</label>
                <input
                  id="edit-sizeUK"
                  type="text"
                  value={form.sizeUK}
                  onChange={(e) => setForm({ ...form, sizeUK: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="edit-sizeUS" className="input-label">US Size</label>
                <input
                  id="edit-sizeUS"
                  type="text"
                  value={form.sizeUS}
                  onChange={(e) => setForm({ ...form, sizeUS: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="edit-sizeCM" className="input-label">CM</label>
                <input
                  id="edit-sizeCM"
                  type="text"
                  value={form.sizeCM}
                  onChange={(e) => setForm({ ...form, sizeCM: e.target.value })}
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Condition */}
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-4">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-[#737373]">
              Condition Assessment
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-score" className="input-label">Score (6–10) *</label>
                <input
                  id="edit-score"
                  type="number"
                  step="0.5"
                  min="6"
                  max="10"
                  required
                  value={form.conditionScore}
                  onChange={(e) => setForm({ ...form, conditionScore: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="edit-label" className="input-label">Condition Label *</label>
                <select
                  id="edit-label"
                  value={form.conditionLabel}
                  onChange={(e) => setForm({ ...form, conditionLabel: e.target.value })}
                  className="input"
                >
                  {CONDITION_LABELS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="edit-notes" className="input-label">Condition Notes</label>
              <textarea
                id="edit-notes"
                rows={2}
                value={form.conditionNotes}
                onChange={(e) => setForm({ ...form, conditionNotes: e.target.value })}
                className="input resize-none h-16 py-2"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-3">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-[#737373] mb-4">
              Status &amp; Availability
            </h2>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.sold}
                onChange={(e) => setForm({ ...form, sold: e.target.checked })}
                className="w-4 h-4 accent-[#DC2626]"
              />
              <span className={`text-sm font-semibold ${form.sold ? 'text-red-600' : 'text-[#0A0A0A]'}`}>
                {form.sold ? 'Marked as Sold' : 'Available for purchase'}
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 accent-[#0A0A0A]"
              />
              <span className="text-sm text-[#525252]">Active (Visible in Catalog)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 accent-[#0A0A0A]"
              />
              <span className="text-sm text-[#525252]">Featured on Homepage</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.newArrival}
                onChange={(e) => setForm({ ...form, newArrival: e.target.checked })}
                className="w-4 h-4 accent-[#0A0A0A]"
              />
              <span className="text-sm text-[#525252]">New Arrival Badge</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.verified}
                onChange={(e) => setForm({ ...form, verified: e.target.checked })}
                className="w-4 h-4 accent-[#0A0A0A]"
              />
              <span className="text-sm text-[#525252]">Authenticity Verified</span>
            </label>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>

            <Link href="/admin/products" className="btn btn-outline w-full text-center text-xs">
              Cancel &amp; Return
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="btn w-full text-red-600 bg-red-50 hover:bg-red-100 text-xs border border-red-200 gap-2 mt-4"
            >
              {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
