import React, { useEffect } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { useThemeStore } from './src/store/useThemeStore'; // Import store
import { Appearance } from 'react-native';

// Tema kustom untuk React Navigation
// Kita sesuaikan dengan palet warna kita
const AppLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007bff',
    background: '#f4f5f7',
    card: '#ffffff',
    text: '#212529',
    border: '#dee2e6',
  },
};

const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#007bff',
    background: '#121212',
    card: '#1e1e1e',
    text: '#f8f9fa',
    border: '#495057',
  },
};


export default function App() {
  // Ambil state tema
  const { themeMode, colors, _applyTheme } = useThemeStore();

  // Terapkan tema saat pertama kali load
  useEffect(() => {
    _applyTheme();
  }, [_applyTheme]);

  // Tentukan tema mana yang akan digunakan oleh React Navigation
  const navigationTheme = themeMode === 'system' 
    ? (Appearance.getColorScheme() === 'dark' ? AppDarkTheme : AppLightTheme)
    : (themeMode === 'dark' ? AppDarkTheme : AppLightTheme);
  
  // Tentukan style status bar (terang/gelap)
  const statusBarStyle = navigationTheme.dark ? 'light' : 'dark';

  return (
    // 'navigationTheme' akan mengatur background aplikasi
    <NavigationContainer theme={navigationTheme}> 
      {/* 'statusBarStyle' akan mengatur warna teks jam/baterai */}
      <StatusBar style={statusBarStyle} /> 
      <AppNavigator />
    </NavigationContainer>
  );
}