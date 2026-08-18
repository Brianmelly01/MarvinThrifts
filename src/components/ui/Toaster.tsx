'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/cn'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
}

// Simple event emitter for toasts
type ToastListener = (toast: Toast) => void
const listeners: ToastListener[] = []

export function toast(message: string, type: ToastType = 'success') {
  const toastObj: Toast = { id: Date.now().toString(), type, message }
  listeners.forEach((fn) => fn(toastObj))
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener: ToastListener = (t) => {
      setToasts((prev) => [...prev, t])
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== t.id))
      }, 3500)
    }
    listeners.push(listener)
    return () => {
      const idx = listeners.indexOf(listener)
      if (idx > -1) listeners.splice(idx, 1)
    }
  }, [])

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[500] flex flex-col gap-2 items-center pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-center gap-3 px-4 py-3 shadow-modal text-sm font-medium pointer-events-auto animate-fade-up',
            t.type === 'success' && 'bg-[#0A0A0A] text-white',
            t.type === 'error' && 'bg-[#DC2626] text-white',
            t.type === 'info' && 'bg-[#2563EB] text-white'
          )}
        >
          {t.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
          {t.type === 'error' && <XCircle className="w-4 h-4 shrink-0" />}
          {t.type === 'info' && <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{t.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
            className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
