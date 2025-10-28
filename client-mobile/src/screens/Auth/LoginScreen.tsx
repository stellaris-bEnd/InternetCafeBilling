import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  SafeAreaView, // Gunakan SafeAreaView untuk layar auth
  ActivityIndicator, // Gunakan ActivityIndicator
} from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/authService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useThemeStore } from '../../store/useThemeStore'; // 1. Import store tema

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const { colors } = useThemeStore(); // 2. Ambil palet warna

  // (Fungsi handleLogin tidak berubah)
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password tidak boleh kosong');
      return;
    }
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { user, token } = response.data;
      setAuth(user, token);
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error || 'Login gagal, coba lagi.';
      Alert.alert('Login Gagal', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Terapkan warna tema di JSX
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Login</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text, backgroundColor: colors.card },
          ]}
          placeholder="Email"
          placeholderTextColor={colors.secondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text, backgroundColor: colors.card },
          ]}
          placeholder="Password"
          placeholderTextColor={colors.secondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        {/* Tampilkan ActivityIndicator jika loading */}
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.spacer} />
        ) : (
          <>
            <Button
              title="Login"
              onPress={handleLogin}
              color={colors.primary}
            />
            <View style={styles.spacer} />
            <Button
              title="Belum punya akun? Daftar"
              onPress={() => navigation.navigate('Register')}
              color={colors.secondary}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

// 4. Update StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28, // Perbesar judul
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    height: 44,
    borderWidth: 1,
    marginBottom: 16, // Beri jarak lebih
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  spacer: {
    height: 16,
  },
});

export default LoginScreen;