import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Package, ArrowLeft } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default async function AdminProductsPage() {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) redirect('/')

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { brand: true, images: { where: { isPrimary: true }, take: 1 } },
  })

  const conditionColor = (score: number) =>
    score >= 9 ? 'text-green-600' : score >= 8 ? 'text-emerald-600' : score >= 7 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      <div className="bg-[#0A0A0A] h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="font-display text-xl text-white tracking-widest">MARVIN</span>
          <span className="text-[0.6rem] text-[#C9A84C] font-semibold tracking-widest uppercase px-2 py-0.5 border border-[#C9A84C]/30">Admin</span>
        </div>
        <Link href="/" className="text-[0.72rem] text-white/50 hover:text-white transition-colors">View Store ↗</Link>
      </div>

      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-sm text-[#737373]">{products.length} total · {products.filter(p => !p.sold).length} available</p>
          </div>
          <Link href="/admin/products/new" className="btn btn-primary gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>

        <div className="bg-white border border-[#E5E5E5] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
                <th className="text-left px-4 py-3 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#737373]">Product</th>
                <th className="text-left px-4 py-3 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#737373] hidden md:table-cell">Size</th>
                <th className="text-left px-4 py-3 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#737373] hidden sm:table-cell">Condition</th>
                <th className="text-right px-4 py-3 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#737373]">Price</th>
                <th className="text-left px-4 py-3 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#737373]">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F2F2]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[#F9F9F9] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-[#F5F5F5] shrink-0 overflow-hidden">
                        {product.images[0] && (
                          <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <div className="text-[0.65rem] text-[#737373]">{product.brand.name}</div>
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-[0.65rem] text-[#A3A3A3]">{product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-[#525252]">EU {product.sizeEU || '—'}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`font-semibold ${conditionColor(product.conditionScore)}`}>
                      {product.conditionScore}/10
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold">{formatPrice(product.salePrice ?? product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[0.65rem] font-semibold px-2 py-1 rounded-full ${
                      product.sold ? 'bg-gray-100 text-gray-600' :
                      !product.isActive ? 'bg-red-100 text-red-700' :
                      product.quantity <= 0 ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {product.sold ? 'Sold' : !product.isActive ? 'Inactive' : product.quantity <= 0 ? 'Out of Stock' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${product.id}/edit`} className="inline-flex items-center gap-1.5 text-[0.72rem] font-medium text-[#737373] hover:text-[#0A0A0A] transition-colors">
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-10 h-10 text-[#D4D4D4] mx-auto mb-3" />
              <p className="text-[#737373]">No products yet</p>
              <Link href="/admin/products/new" className="btn btn-primary mt-4">Add First Product</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
