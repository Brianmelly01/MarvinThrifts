/**
 * Zustand cart store with localStorage persistence
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  brand: string
  slug: string
  price: number
  salePrice?: number
  imageUrl: string
  size: string
  conditionScore: number
  conditionLabel: string
  quantity: number
  maxQuantity: number // always 1 for thrift items
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Computed
  getItemCount: () => number
  getSubtotal: () => number
  hasItem: (productId: string) => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          // Check if item already exists
          const exists = state.items.find((i) => i.productId === item.productId)
          if (exists) return state // Don't add duplicate thrift items

          return {
            items: [...state.items, { ...item, quantity: 1 }],
            isOpen: true, // Auto-open cart
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + (item.salePrice ?? item.price) * item.quantity,
          0
        )
      },

      hasItem: (productId) => {
        return get().items.some((item) => item.productId === productId)
      },
    }),
    {
      name: 'marvin-thrifts-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
