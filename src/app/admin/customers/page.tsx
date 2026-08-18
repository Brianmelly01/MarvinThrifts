import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, Users, Mail, Phone } from 'lucide-react'

export default async function AdminCustomersPage() {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    redirect('/')
  }

  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { orders: true, reviews: true, wishlist: true },
      },
    },
  })

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      {/* Top bar */}
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

      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Registered Customers</h1>
            <p className="text-sm text-[#737373]">{customers.length} total customer accounts</p>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9]">
                <th className="text-left px-4 py-3 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#737373]">Customer</th>
                <th className="text-left px-4 py-3 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#737373]">Contact</th>
                <th className="text-center px-4 py-3 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#737373]">Orders</th>
                <th className="text-center px-4 py-3 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#737373] hidden sm:table-cell">Wishlist</th>
                <th className="text-right px-4 py-3 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#737373]">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F2F2]">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-[#F9F9F9] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {(c.name || c.email || 'C')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-[#0A0A0A]">{c.name || 'Unnamed'}</div>
                        <div className="text-[0.65rem] text-[#A3A3A3]">ID: {c.id.slice(-8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#525252]">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-[#A3A3A3]" /> {c.email}
                    </div>
                    {c.phone && (
                      <div className="flex items-center gap-1.5 mt-0.5 text-[0.68rem] text-[#737373]">
                        <Phone className="w-3 h-3 text-[#A3A3A3]" /> {c.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-xs">
                    {c._count.orders}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-[#737373] hidden sm:table-cell">
                    {c._count.wishlist}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-[#737373]">
                    {new Date(c.createdAt).toLocaleDateString('en-KE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {customers.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-10 h-10 text-[#D4D4D4] mx-auto mb-3" />
              <p className="text-[#737373] text-sm">No registered customers yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
