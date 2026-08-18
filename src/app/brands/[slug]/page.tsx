import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const brand = await prisma.brand.findUnique({
    where: { slug },
  })

  if (!brand) return { title: 'Brand Not Found' }

  return {
    title: `${brand.name} Sneakers & Footwear — Marvin Thrifts`,
    description: `Shop authentic pre-loved ${brand.name} sneakers and shoes. Quality checked and verified in Nairobi, Kenya.`,
  }
}

export default async function BrandSlugPage({ params }: Props) {
  const { slug } = await params
  const brand = await prisma.brand.findUnique({
    where: { slug },
  })

  if (!brand) notFound()

  // Redirect directly to the shop filtered by this brand
  redirect(`/shop?brand=${brand.slug}`)
}
