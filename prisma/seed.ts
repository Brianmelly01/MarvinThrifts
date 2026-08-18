import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // ── Brands ──────────────────────────────────────────────────────────────
  const brands = await Promise.all([
    prisma.brand.upsert({ where: { slug: 'nike' }, update: {}, create: { name: 'Nike', slug: 'nike', featured: true } }),
    prisma.brand.upsert({ where: { slug: 'adidas' }, update: {}, create: { name: 'Adidas', slug: 'adidas', featured: true } }),
    prisma.brand.upsert({ where: { slug: 'jordan' }, update: {}, create: { name: 'Jordan', slug: 'jordan', featured: true } }),
    prisma.brand.upsert({ where: { slug: 'new-balance' }, update: {}, create: { name: 'New Balance', slug: 'new-balance', featured: true } }),
    prisma.brand.upsert({ where: { slug: 'converse' }, update: {}, create: { name: 'Converse', slug: 'converse' } }),
    prisma.brand.upsert({ where: { slug: 'vans' }, update: {}, create: { name: 'Vans', slug: 'vans' } }),
    prisma.brand.upsert({ where: { slug: 'puma' }, update: {}, create: { name: 'Puma', slug: 'puma' } }),
    prisma.brand.upsert({ where: { slug: 'reebok' }, update: {}, create: { name: 'Reebok', slug: 'reebok' } }),
  ])

  const [nike, adidas, jordan, newBalance, converse] = brands
  console.log(`✅ ${brands.length} brands seeded`)

  // ── Categories ──────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'sneakers' }, update: {}, create: { name: 'Sneakers', slug: 'sneakers', sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: 'boots' }, update: {}, create: { name: 'Boots', slug: 'boots', sortOrder: 2 } }),
    prisma.category.upsert({ where: { slug: 'casual' }, update: {}, create: { name: 'Casual', slug: 'casual', sortOrder: 3 } }),
    prisma.category.upsert({ where: { slug: 'running' }, update: {}, create: { name: 'Running', slug: 'running', sortOrder: 4 } }),
    prisma.category.upsert({ where: { slug: 'basketball' }, update: {}, create: { name: 'Basketball', slug: 'basketball', sortOrder: 5 } }),
  ])

  const [sneakers, , casual, , basketball] = categories
  console.log(`✅ ${categories.length} categories seeded`)

  // ── Admin user ───────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!@#', 12)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@marvinthrifts.co.ke'
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Marvin Admin',
      email: adminEmail,
      passwordHash: adminPassword,
      role: 'SUPER_ADMIN',
    },
  })
  console.log(`✅ Admin user seeded (${adminEmail})`)

  // ── Sample products ─────────────────────────────────────────────────────
  const productDefs = [
    {
      name: "Air Force 1 Low '07",
      slug: 'nike-air-force-1-low-07-eu42',
      sku: 'NIKE-AF1-WHT-42',
      brandId: nike.id,
      categoryId: sneakers.id,
      price: 4500,
      description: 'The classic Nike Air Force 1 in clean triple white. A timeless silhouette that goes with everything.',
      sizeEU: '42', sizeUK: '8', sizeUS: '9', sizeCM: '26.5',
      conditionScore: 9, conditionLabel: 'Excellent',
      conditionNotes: 'Very lightly worn — perhaps 3-4 times. Uppers are immaculate.',
      creasing: 'Very slight toe box creasing',
      soleCondition: 'Minimal wear on outsole, crisp white midsole',
      insoleCondition: 'Clean, no odour',
      stains: 'None visible',
      accessories: 'Original laces included',
      colorMain: 'White',
      featured: true, newArrival: true, verified: true,
      imageUrl: '/images/product-af1-white.png',
    },
    {
      name: "Air Jordan 1 Retro High OG 'Chicago'",
      slug: 'jordan-1-retro-high-og-chicago-eu41',
      sku: 'JD1-CHI-RED-41',
      brandId: jordan.id,
      categoryId: basketball.id,
      price: 12000,
      salePrice: 9500,
      description: 'The iconic Chicago colorway. Red, black, and white. This is the one everyone wants.',
      sizeEU: '41', sizeUK: '7', sizeUS: '8', sizeCM: '25.5',
      conditionScore: 8.5, conditionLabel: 'Very Good',
      conditionNotes: 'Been worn but well maintained. Great overall condition.',
      creasing: 'Moderate toe box creasing — natural with wear',
      soleCondition: 'Good, solid grip remaining',
      insoleCondition: 'Slight discolouration, no odour',
      stains: 'Tiny mark on inner collar, barely visible',
      accessories: 'No original box',
      colorMain: 'University Red/Black/White',
      featured: true, newArrival: true, verified: true,
      imageUrl: '/images/product-jordan1-red.png',
    },
    {
      name: "New Balance 550 'White/Green'",
      slug: 'new-balance-550-white-green-eu40',
      sku: 'NB-550-WHTGRN-40',
      brandId: newBalance.id,
      categoryId: sneakers.id,
      price: 5500,
      description: 'The NB550 has taken the world by storm. Clean white with subtle green hits — incredibly versatile.',
      sizeEU: '40', sizeUK: '6.5', sizeUS: '7.5', sizeCM: '25',
      conditionScore: 9.5, conditionLabel: 'Like New',
      conditionNotes: 'Essentially brand new. Worn once on a short walk.',
      creasing: 'None', soleCondition: 'Clean, almost no wear',
      insoleCondition: 'Perfect', stains: 'None',
      accessories: 'Original laces',
      colorMain: 'White/Green',
      featured: true, newArrival: true, verified: true,
      imageUrl: '/images/product-nb550.png',
    },
    {
      name: "Adidas Campus 00s 'Core Black'",
      slug: 'adidas-campus-00s-core-black-eu43',
      sku: 'ADI-CAMP-BLK-43',
      brandId: adidas.id,
      categoryId: sneakers.id,
      price: 4800,
      description: "The retro Campus silhouette is back. This all-black colourway is clean and versatile.",
      sizeEU: '43', sizeUK: '9', sizeUS: '9.5', sizeCM: '27',
      conditionScore: 8, conditionLabel: 'Very Good',
      conditionNotes: 'Regular wear but kept well.',
      creasing: 'Noticeable toe box creasing consistent with wear',
      soleCondition: 'Some sole wear but strong grip',
      insoleCondition: 'Clean', stains: 'Minor scuff on heel, matches shoe colour',
      colorMain: 'Core Black/White',
      featured: false, newArrival: true, verified: false,
      imageUrl: '/images/product-adidas-campus.png',
    },
    {
      name: "Converse Chuck 70 High 'Parchment'",
      slug: 'converse-chuck-70-high-parchment-eu39',
      sku: 'CONV-CK70-PRCH-39',
      brandId: converse.id,
      categoryId: casual.id,
      price: 3200,
      description: 'The premium Chuck 70 in vintage parchment. Better materials than the standard Chuck Taylor.',
      sizeEU: '39', sizeUK: '6', sizeUS: '7', sizeCM: '24.5',
      conditionScore: 9, conditionLabel: 'Excellent',
      conditionNotes: 'Gently worn a handful of times.',
      creasing: 'Minimal at toe flex area',
      soleCondition: 'Clean vulcanised sole with light use',
      insoleCondition: 'Very clean', stains: 'None',
      accessories: 'Extra black laces included',
      colorMain: 'Parchment/Natural',
      featured: false, newArrival: false, verified: true,
      imageUrl: '/images/product-converse-chuck70.png',
    },
    {
      name: "Jordan 1 Retro High OG 'Royal Reimagined'",
      slug: 'jordan-1-retro-high-og-royal-reimagined-eu44',
      sku: 'JD1-ROYAL-44',
      brandId: jordan.id,
      categoryId: basketball.id,
      price: 11000,
      description: 'Royal blue and black in a modern take on a classic AJ1 colorway.',
      sizeEU: '44', sizeUK: '9.5', sizeUS: '10.5', sizeCM: '28',
      conditionScore: 9, conditionLabel: 'Excellent',
      conditionNotes: 'Light wear only. Creases barely there.',
      creasing: 'Very slight creasing',
      soleCondition: 'Like new', insoleCondition: 'Perfect', stains: 'None',
      colorMain: 'Royal/Black/White',
      featured: true, newArrival: false, verified: true,
      imageUrl: '/images/hero-jordan1.png',
    },
  ]

  let created = 0
  for (const { imageUrl, ...data } of productDefs) {
    const existing = await prisma.product.findUnique({ where: { slug: data.slug } })
    if (!existing) {
      await prisma.product.create({
        data: {
          ...data,
          gender: 'UNISEX',
          quantity: 1,
          isActive: true,
          sold: false,
          images: {
            create: [{ url: imageUrl, isPrimary: true, altText: `${data.name} — Marvin Thrifts`, sortOrder: 0 }],
          },
        },
      })
      created++
    }
  }
  console.log(`✅ ${created} products seeded`)

  // ── Welcome coupon ───────────────────────────────────────────────────────
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      type: 'PERCENTAGE',
      value: 10,
      description: '10% off your first order',
      minOrderValue: 2000,
      isActive: true,
    },
  })
  console.log('✅ Welcome coupon seeded (WELCOME10)')

  console.log('\n🎉 Database seeded successfully!')
  console.log(`   Admin login: ${adminEmail} / ${process.env.ADMIN_PASSWORD || 'Admin123!@#'}`)
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
