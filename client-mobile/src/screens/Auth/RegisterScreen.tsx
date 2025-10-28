import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView, // Gunakan SafeAreaView
  ActivityIndicator, // Gunakan ActivityIndicator
} from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/authService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useThemeStore } from '../../store/useThemeStore'; // 1. Import store tema

type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Register'
>;

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const { colors } = useThemeStore(); // 2. Ambil palet warna

  // (Fungsi handleRegister tidak berubah)
  const handleRegister = async () => {
    if (!email || !password || !username) {
      Alert.alert('Error', 'Semua field tidak boleh kosong');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter');
      return;
    }
    setIsLoading(true);
    try {
      const response = await authService.register({
        username,
        email,
        password,
      });
      const { user, token } = response.data;
      setAuth(user, token);
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error || 'Registrasi gagal, coba lagi.';
      Alert.alert('Registrasi Gagal', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Terapkan warna tema di JSX
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Buat Akun Baru</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text, backgroundColor: colors.card },
          ]}
          placeholder="Username"
          placeholderTextColor={colors.secondary}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
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
          placeholder="Password (min. 6 karakter)"
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
              title="Daftar"
              onPress={handleRegister}
              color={colors.primary}
            />
            <View style={styles.spacer} />
            <Button
              title="Sudah punya akun? Login"
              onPress={() => navigation.navigate('Login')}
              color={colors.secondary}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// 4. Update StyleSheet (gunakan style yang sama dengan Login)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1, // Gunakan flexGrow untuk ScrollView
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    height: 44,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  spacer: {
    height: 16,
  },
});

export default RegisterScreen;