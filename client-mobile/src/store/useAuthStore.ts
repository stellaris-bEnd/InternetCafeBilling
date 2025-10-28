import { create } from 'zustand';
import { User } from '../types/entities';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthLoading: true, 
  // Mulai dengan loading saat app pertama kali dibuka
  
  
  //  Menyimpan info user dan token ke state dan AsyncStorage.

  setAuth: (user, token) => {
    AsyncStorage.setItem('token', token);
    AsyncStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthLoading: false });
  },

  
  //  Menghapus info user dan token (untuk logout).
  
  clearAuth: () => {
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('user');
    set({ user: null, token: null, isAuthLoading: false });
  },


// Mengecek AsyncStorage saat aplikasi dibuka untuk melihat apakah user sudah login sebelumnya.

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userString = await AsyncStorage.getItem('user');
      if (token && userString) {
        const user = JSON.parse(userString) as User;
        set({ user, token, isAuthLoading: false });
      } else {
        // Tidak ada token, pastikan loading selesai
        set({ isAuthLoading: false });
      }
    } catch (e) {
      // Error membaca storage, anggap saja belum login
      set({ isAuthLoading: false });
    }
  },
}));