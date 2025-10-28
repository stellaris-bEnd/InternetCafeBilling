import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { adminService } from '../../services/adminService';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore'; // 1. Import store tema

const AdminDashboardScreen = () => {
  const { clearAuth } = useAuthStore();
  const { colors } = useThemeStore(); // 2. Ambil palet warna
  
  // State (tidak berubah)
  const [userIdToChange, setUserIdToChange] = useState('');
  const [newRole, setNewRole] = useState('vip');
  const [itemName, setItemName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // Handler (tidak berubah)
  const handleChangeRole = async () => {
    const userIdNum = parseInt(userIdToChange);
    if (isNaN(userIdNum) || userIdNum <= 0) {
      Alert.alert('Error', 'User ID harus berupa angka yang valid.');
      return;
    }
    if (newRole !== 'vip' && newRole !== 'vvip') {
      Alert.alert('Error', 'Role baru harus "vip" atau "vvip".');
      return;
    }
    try {
      const response = await adminService.changeRole(userIdNum, newRole);
      Alert.alert('Sukses (Dummy)', response.data.message);
      setUserIdToChange('');
      setNewRole('vip');
    } catch (error) {
      Alert.alert('Error', 'Gagal mengubah role');
    }
  };

  const handleUpdatePrice = async () => {
    const newPriceNum = parseInt(newPrice);
    if (itemName.trim() === '') {
      Alert.alert('Error', 'Nama item tidak boleh kosong.');
      return;
    }
    if (isNaN(newPriceNum) || newPriceNum < 0) {
      Alert.alert('Error', 'Harga baru harus berupa angka yang valid.');
      return;
    }
    try {
      const response = await adminService.updatePrice(itemName, newPriceNum);
      Alert.alert('Sukses (Dummy)', response.data.message);
      setItemName('');
      setNewPrice('');
    } catch (error) {
      Alert.alert('Error', 'Gagal mengubah harga');
    }
  };

  // 3. Terapkan warna tema di JSX
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Admin Panel (Dummy)</Text>

      {/* --- Fitur 3: Ubah Role --- */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Ubah Role Member</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="User ID (cth: 1, 2, 3)"
          placeholderTextColor={colors.secondary} // Warna placeholder
          keyboardType="numeric"
          value={userIdToChange}
          onChangeText={setUserIdToChange}
        />
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Role Baru (vip / vvip)"
          placeholderTextColor={colors.secondary} // Warna placeholder
          value={newRole}
          onChangeText={(text) => setNewRole(text.toLowerCase())}
          autoCapitalize="none"
        />
        <Button title="Ubah Role" onPress={handleChangeRole} color={colors.primary} />
      </View>

      {/* --- Fitur 4: Ubah Harga --- */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Ubah Harga Item</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Nama Item (cth: Paket 1 Jam)"
          placeholderTextColor={colors.secondary} // Warna placeholder
          value={itemName}
          onChangeText={setItemName}
        />
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Harga Baru (cth: 6000)"
          placeholderTextColor={colors.secondary} // Warna placeholder
          keyboardType="numeric"
          value={newPrice}
          onChangeText={setNewPrice}
        />
        <Button title="Update Harga" onPress={handleUpdatePrice} color={colors.primary} />
      </View>

      <View style={{ marginTop: 50, marginBottom: 50 }}>
        <Button title="Logout" onPress={clearAuth} color={colors.danger} />
      </View>
    </ScrollView>
  );
};

// 4. Hapus warna hardcode dari StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 44, // Sedikit lebih tinggi untuk sentuhan
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12, // Padding horizontal
    borderRadius: 6, // Border radius lebih baik
  },
});

export default AdminDashboardScreen;