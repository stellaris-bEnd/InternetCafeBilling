// Palet warna statis
const TINT_COLOR = '#007bff'; // Biru primer kita
const DANGER_COLOR = '#e74c3c';
const SUCCESS_COLOR = '#2ecc71';
const WARNING_COLOR = '#f39c12';

// PalET WARNA UNTUK MODE TERANG
export const lightColors = {
  primary: TINT_COLOR,
  secondary: '#6c757d',     // Teks abu-abu
  text: '#212529',          // Teks hitam
  background: '#f4f5f7',    // Latar belakang layar
  card: '#ffffff',          // Latar belakang card
  border: '#dee2e6',         // Warna border
  
  success: SUCCESS_COLOR,
  danger: DANGER_COLOR,
  warning: WARNING_COLOR,
};

// PalET WARNA UNTUK MODE GELAP
export const darkColors = {
  primary: TINT_COLOR,       // Biru tetap menonjol
  secondary: '#adb5bd',     // Teks abu-abu terang
  text: '#f8f9fa',           // Teks putih
  background: '#121212',    // Latar belakang layar (hitam)
  card: '#1e1e1e',          // Latar belakang card (abu-abu gelap)
  border: '#495057',         // Warna border
  
  success: SUCCESS_COLOR,
  danger: DANGER_COLOR,
  warning: WARNING_COLOR,
};

// Kita ekspor tipe datanya agar bisa dipakai di store
export type ColorPalette = typeof lightColors;