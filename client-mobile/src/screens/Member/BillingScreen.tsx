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
  Modal,
  Button,
  Image,
} from 'react-native';
import { Computer, ComputerStatus } from '../../types/entities';
import { billingService } from '../../services/billingService';
import { useAuthStore } from '../../store/useAuthStore';
import { bookingService } from '../../services/bookingService';
import { useThemeStore } from '../../store/useThemeStore'; // 1. Import store tema
import { ColorPalette } from '../../constants/colors'; // Import tipe palet

// --- Komponen Modal Booking ---
// Kita tambahkan 'colors' sebagai prop
const BookingModal = ({
  visible,
  onClose,
  computer,
  onSubmit,
  colors, // <-- TAMBAHAN
}: {
  visible: boolean;
  onClose: () => void;
  computer: Computer | null;
  onSubmit: (qrCode: string) => void;
  colors: ColorPalette; // <-- TAMBAHAN
}) => {
  const [hours, setHours] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // (Fungsi handleBooking tidak berubah)
  const handleBooking = async () => {
    if (!computer) return;
    setIsLoading(true);
    try {
      const response = await bookingService.createBooking({
        computerId: computer.id,
        hours: hours,
      });
      onSubmit(response.data.qrCode);
    } catch (error) {
      Alert.alert('Error', 'Booking gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalBackdrop}>
        {/* Terapkan warna card dan text */}
        <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Book {computer?.name}
          </Text>
          <Text style={{ color: colors.text }}>Pilih durasi (jam):</Text>
          <View style={styles.hourSelector}>
            <Button title=" - " onPress={() => setHours(Math.max(1, hours - 1))} color={colors.primary} />
            <Text style={[styles.hourText, { color: colors.text }]}>{hours} Jam</Text>
            <Button title=" + " onPress={() => setHours(hours + 1)} color={colors.primary} />
          </View>
          <Button
            title={isLoading ? 'Loading...' : 'Book & Bayar'}
            onPress={handleBooking}
            disabled={isLoading}
            color={colors.primary} // <-- Terapkan warna
          />
          <View style={{ marginTop: 10 }}>
            <Button title="Batal" onPress={onClose} color={colors.secondary} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- Komponen Modal QR Code ---
// Kita tambahkan 'colors' sebagai prop
const QRModal = ({
  visible,
  onClose,
  qrCode,
  colors, // <-- TAMBAHAN
}: {
  visible: boolean;
  onClose: () => void;
  qrCode: string | null;
  colors: ColorPalette; // <-- TAMBAHAN
}) => (
  <Modal visible={visible} transparent={true} animationType="fade">
    <View style={styles.modalBackdrop}>
      {/* Terapkan warna card dan text */}
      <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.modalTitle, { color: colors.text }]}>
          Scan untuk Membayar
        </Text>
        <Text style={{ color: colors.text }}>Gunakan OVO/DANA</Text>
        {qrCode && (
          <Image
            style={styles.qrImage}
            source={{ uri: `data:image/png;base64,${qrCode}` }}
          />
        )}
        <Button title="Selesai" onPress={onClose} color={colors.primary} />
      </View>
    </View>
  </Modal>
);

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

// --- KOMPONEN UTAMA BillingScreen ---
const BillingScreen = () => {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { user } = useAuthStore(); 
  const { colors } = useThemeStore(); // 2. Ambil palet warna
  
  const [modalVisible, setModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  // (Fungsi fetchComputers, useEffect, onRefresh, handleCardPress, 
  //  handleBookingSubmit, closeQrModal tetap sama)
  const fetchComputers = async () => {
    if (!isRefreshing) setIsLoading(true);
    try {
      const response = await billingService.getComputers();
      setComputers(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal mengambil data komputer');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => { fetchComputers(); }, []);
  const onRefresh = () => { setIsRefreshing(true); fetchComputers(); };
  
  const handleCardPress = (computer: Computer) => {
    if (computer.status !== 'available') {
      Alert.alert('Info', 'Komputer ini sedang tidak tersedia.');
      return;
    }
    if (user?.memberStatus === 'regular') {
      Alert.alert('Info', 'Fitur booking hanya untuk member VIP/VVIP.');
      return;
    }
    setSelectedComputer(computer);
    setModalVisible(true);
  };
  
  const handleBookingSubmit = (qrCode: string) => {
    setModalVisible(false); 
    setQrCode(qrCode); 
    setQrModalVisible(true); 
    fetchComputers(); 
  };
  
  const closeQrModal = () => {
    setQrModalVisible(false);
    setQrCode(null);
  };

  // Komponen untuk render card PC di FlatList
  const renderComputerCard = ({ item }: { item: Computer }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)}>
      {/* Terapkan warna card, text, dan border dinamis */}
      <View 
        style={[
          styles.card, 
          { 
            backgroundColor: colors.card,
            borderLeftColor: getStatusColor(item.status, colors) 
          }
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.cardStatus, { color: colors.secondary }]}>
          {item.status.toUpperCase()}
        </Text>
        {item.status === 'occupied' && (
          <Text style={[styles.cardUser, { color: colors.secondary }]}>
            Used by: {item.username || '...'}
          </Text>
        )}
        {item.status === 'available' && (user?.memberStatus !== 'regular') && (
           <Text style={[styles.bookText, { color: colors.primary }]}>
             Klik untuk Book (VIP/VVIP)
           </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // Komponen untuk "Empty State"
  const renderEmptyState = () => (
    <View style={styles.centered}>
      <Text style={[styles.emptyText, { color: colors.secondary }]}>
        Tidak ada komputer tersedia saat ini.
      </Text>
      <Text style={{ color: colors.secondary }}>Tarik ke bawah untuk memuat ulang.</Text>
    </View>
  );

  // Tampilan loading awal
  if (isLoading && !isRefreshing) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Tampilan utama
  return (
    // Terapkan warna background
    <View style={{flex: 1, backgroundColor: colors.background}}>
      <FlatList
        data={computers}
        renderItem={renderComputerCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={onRefresh} 
            tintColor={colors.primary} // Warna loading refresh
          />
        }
        ListHeaderComponent={
          <Text style={[styles.header, { color: colors.text }]}>
            Status PC (Tarik untuk refresh)
          </Text>
        }
        ListEmptyComponent={renderEmptyState}
      />
      
      {/* Kirim 'colors' ke modal */}
      <BookingModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        computer={selectedComputer}
        onSubmit={handleBookingSubmit}
        colors={colors} 
      />
      <QRModal
        visible={qrModalVisible}
        onClose={closeQrModal}
        qrCode={qrCode}
        colors={colors}
      />
    </View>
  );
};

// --- Styles ---
// Hapus semua warna hardcode dari sini
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardStatus: { fontSize: 14, fontWeight: '500', marginTop: 4 },
  cardUser: { fontSize: 12, fontStyle: 'italic', marginTop: 4 },
  bookText: { fontSize: 12, marginTop: 8, fontWeight: 'bold' },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  hourSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  hourText: { fontSize: 18, marginHorizontal: 16 },
  qrImage: {
    width: 200,
    height: 200,
    marginVertical: 20,
    backgroundColor: '#eee', // Placeholder
  },
});

export default BillingScreen;