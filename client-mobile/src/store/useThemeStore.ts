import { create } from 'zustand';
import { Appearance } from 'react-native';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors, ColorPalette } from '../constants/colors';

// Tipe untuk tema: 'light', 'dark', atau 'system' (mengikuti HP)
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  themeMode: ThemeMode;
  colors: ColorPalette;
  setThemeMode: (mode: ThemeMode) => void;
  _applyTheme: () => void;
}

// Menggunakan sintaks Zustand v4: create<T>()(persist(...))
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeMode: 'system', // Defaultnya, ikuti sistem HP
      colors: Appearance.getColorScheme() === 'dark' ? darkColors : lightColors,

      setThemeMode: (mode) => {
        set({ themeMode: mode });
        get()._applyTheme(); // Terapkan palet baru
      },

      _applyTheme: () => {
        const mode = get().themeMode;
        const systemTheme = Appearance.getColorScheme() ?? 'light';
        
        if (mode === 'system') {
          set({ colors: systemTheme === 'dark' ? darkColors : lightColors });
        } else if (mode === 'dark') {
          set({ colors: darkColors });
        } else {
          set({ colors: lightColors });
        }
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ themeMode: state.themeMode }), 
      
      // --- **BLOK INI DIHAPUS** ---
      // onRehydrateStorage: (state) => {
      //   ... (ini menyebabkan error dan tidak diperlukan)
      // },
      // --- **AKHIR DARI BLOK YANG DIHAPUS** ---
    }
  )
);

// Listener ini akan mendeteksi jika user mengganti tema HP-nya
Appearance.addChangeListener((preferences) => {
  const { themeMode, _applyTheme } = useThemeStore.getState();
  if (themeMode === 'system') {
    _applyTheme();
  }
});