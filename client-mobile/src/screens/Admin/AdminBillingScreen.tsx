import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Computer, ComputerStatus } from '../../types/entities';
import { billingService } from '../../services/billingService';
import { adminService } from '../../services/adminService';
import { useThemeStore } from '../../store/useThemeStore'; // 1. Import store tema
import { ColorPalette } from '../../constants/colors'; // Import tipe palet

// --- Fungsi Helper Warna ---
// Kita ubah agar menerima 'colors'
const getStatusColor = (status: ComputerStatus, colors: ColorPalette) => {
  switch (status) {
    case 'available':
      return colors.success;
    case 'occupied':
      return colors.danger;
    case 'maintenance':
      return colors.warning;
    default:
      return colors.secondary;
  }
};

const AdminBillingScreen = () => {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { colors } = useThemeStore(); // 2. Ambil palet warna

  // (Fungsi fetchComputers, useEffect, onRefresh, handleForceLogout tidak berubah)
  const fetchComputers = async () => {
    if (!isRefreshing) setIsLoading(true);
    try {
      const response = await billingService.getComputers();
      setComputers(response.data);
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil data komputer');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComputers();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchComputers();
  };

  const handleForceLogout = (computer: Computer) => {
    Alert.alert(
      'Konfirmasi Logout',
      `Anda yakin ingin memaksa logout ${computer.name} (User: ${computer.username || 'N/A'})?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await adminService.forceLogoutPC(computer.id);
              Alert.alert('Sukses (Dummy)', response.data.message);
              fetchComputers();
            } catch (err) {
              Alert.alert('Error', 'Gagal melakukan force logout');
            }
          },
        },
      ]
    );
  };

  // 3. Terapkan warna tema di JSX
  const renderComputerCard = ({ item }: { item: Computer }) => (
    <View 
      style={[
        styles.card, 
        { 
          backgroundColor: colors.card,
          borderLeftColor: getStatusColor(item.status, colors) 
        }
      ]}
    >
      <View style={styles.cardInfo}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.cardStatus, { color: colors.secondary }]}>
          {item.status.toUpperCase()}
        </Text>
        {item.status === 'occupied' && (
          <Text style={[styles.cardUser, { color: colors.secondary }]}>
            Used by: {item.username || '...'}
          </Text>
        )}
      </View>

      {item.status === 'occupied' && (
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.danger }]} // Terapkan warna
          onPress={() => handleForceLogout(item)}
        >
          <Text style={styles.logoutButtonText}>Force Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Komponen Empty State
  const renderEmptyState = () => (
    <View style={styles.centered}>
      <Text style={[styles.emptyText, { color: colors.secondary }]}>
        Tidak ada komputer terdaftar.
      </Text>
    </View>
  );

  if (isLoading && !isRefreshing) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={computers}
        renderItem={renderComputerCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={onRefresh} 
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <Text style={[styles.header, { color: colors.text }]}>
            PC Monitor (Admin)
          </Text>
        }
      />
    </View>
  );
};

// 4. Hapus warna hardcode dari StyleSheet
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderLeftWidth: 6,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardStatus: { fontSize: 14, fontWeight: '500', marginTop: 4 },
  cardUser: { fontSize: 12, fontStyle: 'italic', marginTop: 4 },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: 'white', // Teks tombol logout selalu putih
    fontWeight: 'bold',
  },
});

export default AdminBillingScreen;