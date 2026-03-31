import { create } from 'zustand';
import { Equipment } from '../types';

export interface CartItem {
  equipment: Equipment;
  quantity: number;
  durationDays: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (equipment: Equipment, quantity: number, durationDays: number) => void;
  removeItem: (equipmentId: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (equipment, quantity, durationDays) => {
    set((state) => {
      const existingItem = state.items.find(item => item.equipment.id === equipment.id);
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.equipment.id === equipment.id
              ? { ...item, quantity: item.quantity + quantity, durationDays }
              : item
          )
        };
      }
      return { items: [...state.items, { equipment, quantity, durationDays }] };
    });
  },
  removeItem: (equipmentId) => {
    set((state) => ({
      items: state.items.filter(item => item.equipment.id !== equipmentId)
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    return get().items.reduce((total, item) => {
      const rate = typeof item.equipment.dailyRate === 'string' 
        ? parseFloat(item.equipment.dailyRate) 
        : (item.equipment.dailyRate || 0);
      return total + (rate * item.quantity * item.durationDays);
    }, 0);
  }
}));
