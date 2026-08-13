/**
 * Format a price from KSh integer to display string
 * e.g. 3500 → "KSh 3,500"
 */
export function formatPrice(amount: number): string {
  return `KSh ${amount.toLocaleString('en-KE')}`
}

/**
 * Generate a unique order number
 * e.g. MT-7F3K9
 */
export function generateOrderNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const random = Array.from({ length: 5 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
  return `MT-${random}`
}

/**
 * Convert condition score to label
 */
export function getConditionLabel(score: number): string {
  if (score >= 10) return 'Brand New'
  if (score >= 9) return 'Excellent'
  if (score >= 8) return 'Very Good'
  if (score >= 7) return 'Good'
  if (score >= 6) return 'Fair'
  return 'Worn'
}

/**
 * Get condition color class based on score
 */
export function getConditionColor(score: number): string {
  if (score >= 9) return 'text-emerald-600'
  if (score >= 8) return 'text-green-600'
  if (score >= 7) return 'text-yellow-600'
  if (score >= 6) return 'text-orange-600'
  return 'text-red-600'
}

/**
 * Slugify a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

/**
 * Truncate a string with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Calculate delivery fee based on method
 */
export function getDeliveryFee(method: string): number {
  switch (method) {
    case 'NAIROBI':
      return parseInt(process.env.DELIVERY_FEE_NAIROBI || '200')
    case 'NATIONWIDE':
      return parseInt(process.env.DELIVERY_FEE_NATIONWIDE || '400')
    case 'PICKUP':
      return 0
    default:
      return 200
  }
}

/**
 * Check if order qualifies for free delivery
 */
export function qualifiesForFreeDelivery(subtotal: number): boolean {
  const threshold = parseInt(process.env.FREE_DELIVERY_THRESHOLD || '5000')
  return subtotal >= threshold
}

/**
 * Generate WhatsApp message for a product
 */
export function generateWhatsAppMessage(params: {
  productName: string
  brand: string
  size?: string
  price: number
  slug: string
}): string {
  const { productName, brand, size, price, slug } = params
  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || 'https://marvinthrifts.co.ke'
  const productUrl = `${storeUrl}/shop/${slug}`

  return encodeURIComponent(
    `Hi Marvin Thrifts! 👟\n\nI'm interested in the *${brand} ${productName}*${size ? ` (Size ${size})` : ''} priced at *${formatPrice(price)}*.\n\nIs it still available?\n\n${productUrl}`
  )
}

/**
 * Get WhatsApp URL for ordering
 */
export function getWhatsAppOrderUrl(params: {
  productName: string
  brand: string
  size?: string
  price: number
  slug: string
}): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254700000000'
  const message = generateWhatsAppMessage(params)
  return `https://wa.me/${phone}?text=${message}`
}

/**
 * Parse defects from JSON string
 */
export function parseDefects(defectsJson: string | null | undefined): string[] {
  if (!defectsJson) return []
  try {
    return JSON.parse(defectsJson)
  } catch {
    return []
  }
}

/**
 * Kenyan counties list
 */
export const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet',
  'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado',
  'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga',
  'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia',
  'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit',
  'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
  'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
  'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga',
  'Wajir', 'West Pokot'
]
