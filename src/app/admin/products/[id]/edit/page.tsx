import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { EditProductForm } from './EditProductForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminEditProductPage({ params }: Props) {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    redirect('/')
  }

  const { id } = await params

  const [product, brands, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: true },
    }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!product) notFound()

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      {/* Top bar */}
      <div className="bg-[#0A0A0A] h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="font-display text-xl text-white tracking-widest">MARVIN</span>
          <span className="text-[0.6rem] text-[#C9A84C] font-semibold tracking-widest uppercase px-2 py-0.5 border border-[#C9A84C]/30">Admin</span>
        </div>
        <Link href="/" className="text-[0.72rem] text-white/50 hover:text-white transition-colors">View Store ↗</Link>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs text-[#737373] uppercase tracking-wide">Edit Item</div>
            <h1 className="text-2xl font-bold text-[#0A0A0A]">{product.name}</h1>
          </div>
          <Link
            href={`/shop/${product.slug}`}
            target="_blank"
            className="btn btn-outline text-xs h-9 px-4"
          >
            View Live Listing ↗
          </Link>
        </div>

        <EditProductForm
          product={product}
          brands={brands}
          categories={categories}
        />
      </div>
    </div>
  )
}
