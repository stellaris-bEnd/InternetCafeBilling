import { create } from 'zustand';
import { PriceList } from '../types/entities';
import { menuService } from '../services/menuService';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Definisikan bentuk state (Tidak berubah)
interface MenuState {
  prices: PriceList | null;
  isLoading: boolean;
  error: string | null;
  fetchPrices: () => Promise<void>;
}

// 2. Buat store dengan sintaks ZUSTAND v4
// Perhatikan '()' setelah create<MenuState>
export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      // --- STATE (Data) ---
      prices: null,
      isLoading: false,
      error: null,

      // --- ACTION (Fungsi) ---
      fetchPrices: async () => {
        if (get().isLoading) return;

        set({ isLoading: true, error: null });
        try {
          const response = await menuService.getPrices();
          set({
            prices: response.data,
            isLoading: false,
          });
        } catch (err: any) {
          console.error('Failed to fetch prices:', err);
          set({
            isLoading: false,
            error: 'Gagal memuat daftar harga',
          });
        }
      },
    }),
    {
      // --- KONFIGURASI PERSISTENCE ---
      name: 'menu-storage', 
      storage: createJSONStorage(() => AsyncStorage),
      
      // Baris ini sekarang akan berfungsi karena tipenya sudah benar
      partialize: (state) => ({ prices: state.prices }),
    }
  )
);