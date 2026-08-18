import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] pt-[88px] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="not-found-number select-none">404</div>
        <div className="relative -mt-8 sm:-mt-12">
          <div className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase text-[#C9A84C] mb-4">Lost in the sole</div>
          <h1 className="font-display text-4xl sm:text-5xl text-[#0A0A0A] mb-4">PAGE NOT FOUND.</h1>
          <p className="text-[#737373] text-sm max-w-sm mx-auto mb-8">
            The page you&apos;re looking for has been laced up and walked away.
            Head back to the shop to find your next pair.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="btn btn-primary">Browse Collection</Link>
            <Link href="/" className="btn btn-outline">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
