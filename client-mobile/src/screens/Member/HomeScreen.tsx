import React from 'react';
import { View, Text, Button, StyleSheet, Pressable } from 'react-native'; // Import Pressable
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore, ThemeMode } from '../../store/useThemeStore'; // Import ThemeMode dan store

// Helper untuk format waktu (sisa billing)
const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours} jam ${minutes} menit`;
};

// --- Komponen Tombol Pengganti Tema ---
const ThemeSwitcher = () => {
  const { themeMode, setThemeMode, colors } = useThemeStore();

  const options: ThemeMode[] = ['light', 'dark', 'system'];

  return (
    <View style={styles.themeContainer}>
      <Text style={[styles.themeTitle, { color: colors.text }]}>Ganti Tema:</Text>
      <View style={styles.themeOptions}>
        {options.map((mode) => (
          <Pressable
            key={mode}
            // Style dinamis berdasarkan tema yang aktif
            style={[
              styles.themeButton,
              { backgroundColor: themeMode === mode ? colors.primary : colors.card },
              { borderColor: colors.border }
            ]}
            onPress={() => setThemeMode(mode)} // Panggil fungsi dari store
          >
            <Text 
              style={{ 
                color: themeMode === mode ? colors.card : colors.text,
                fontWeight: 'bold'
              }}
            >
              {/* Membuat huruf pertama kapital: "system" -> "System" */}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};
// --- Akhir dari Komponen ThemeSwitcher ---


// --- Komponen Utama HomeScreen ---
const HomeScreen = () => {
  const { user, clearAuth } = useAuthStore();
  const { colors } = useThemeStore(); // Ambil palet warna aktif

  return (
    // Terapkan warna background dinamis
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Selamat Datang, {user?.username}!
      </Text>
      <Text style={[styles.email, { color: colors.secondary }]}>
        {user?.email}
      </Text>

      {/* Box Info Billing */}
      <View style={[styles.billingBox, { backgroundColor: colors.card }]}>
        <Text style={[styles.billingTitle, { color: colors.secondary }]}>
          Sisa Billing Anda:
        </Text>
        <Text style={[styles.billingTime, { color: colors.text }]}>
          {formatTime(user?.remainingTimeSeconds || 0)}
        </Text>
        <Text style={[styles.status, { color: colors.primary }]}>
          Status: {user?.memberStatus?.toUpperCase()}
        </Text>
      </View>

      {/* Tambahkan Komponen ThemeSwitcher */}
      <ThemeSwitcher />

      {/* Spacer untuk mendorong tombol Logout ke bawah */}
      <View style={styles.spacer} />
      
      {/* Tombol Logout dengan warna tema */}
      <Button title="Logout" onPress={clearAuth} color={colors.danger} />
    </View>
  );
};

// --- StyleSheet ---
// Semua warna hardcode (kecuali shadow) dihilangkan
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
  },
  billingBox: {
    width: '90%',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginTop: 30,
    elevation: 2,
    shadowColor: '#000', // Shadow tetap hitam
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  billingTitle: {
    fontSize: 16,
  },
  billingTime: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  status: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  spacer: {
    flex: 1, // Ini akan mengisi sisa ruang
  },
  // Style untuk Theme Switcher
  themeContainer: {
    width: '90%',
    marginTop: 30,
    alignItems: 'center',
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Beri jarak antar tombol
    width: '100%',
  },
  themeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
});

export default HomeScreen;