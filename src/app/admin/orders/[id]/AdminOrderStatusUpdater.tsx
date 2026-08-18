'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'

const ORDER_STATUSES = [
  'PENDING',
  'PAYMENT_CONFIRMED',
  'PROCESSING',
  'PACKED',
  'DISPATCHED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
]

const PAYMENT_STATUSES = ['UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED']

interface Props {
  orderId: string
  initialStatus: string
  initialPaymentStatus: string
}

export function AdminOrderStatusUpdater({
  orderId,
  initialStatus,
  initialPaymentStatus,
}: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setLoading(true)
    setSaved(false)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus }),
      })
      if (res.ok) {
        setSaved(true)
        router.refresh()
        setTimeout(() => setSaved(false), 3000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white border border-[#E5E5E5] p-3">
      <div>
        <label htmlFor="admin-order-status" className="text-[0.65rem] font-bold uppercase text-[#737373] block mb-1">
          Order Status
        </label>
        <select
          id="admin-order-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-xs border border-[#D4D4D4] px-2.5 py-1.5 bg-white font-medium outline-none focus:border-[#0A0A0A]"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="admin-order-payment" className="text-[0.65rem] font-bold uppercase text-[#737373] block mb-1">
          Payment
        </label>
        <select
          id="admin-order-payment"
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="text-xs border border-[#D4D4D4] px-2.5 py-1.5 bg-white font-medium outline-none focus:border-[#0A0A0A]"
        >
          {PAYMENT_STATUSES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="self-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn btn-primary text-xs h-8 px-4 gap-1.5"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : saved ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" /> Saved
            </>
          ) : (
            'Update Status'
          )}
        </button>
      </div>
    </div>
  )
}
