import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import AuthNavigator from './AuthNavigator';
import MemberNavigator from './MemberNavigator';
import AdminNavigator from './AdminNavigator'; // <-- IMPORT BARU
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const AppNavigator = () => {
  // Ambil 'user' dan 'role' dari store
  const { user, token, isAuthLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // Cek auth state saat app pertama kali load
  }, [checkAuth]);

  if (isAuthLoading) {
    // Tampilkan loading screen
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Cek apakah ada token
  if (!token || !user) {
    return <AuthNavigator />;
  }

  // --- LOGIKA BARU: Pilih Navigator berdasarkan Role ---
  if (user.role === 'admin') {
    return <AdminNavigator />;
  } else {
    return <MemberNavigator />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;