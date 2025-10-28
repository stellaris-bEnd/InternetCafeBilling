import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useMenuStore } from '../../store/useMenuStore';
import { PriceList, PackagePrice, ProductPrice, UpgradePrice } from '../../types/entities';
import { useThemeStore } from '../../store/useThemeStore'; // 1. Import store tema
import { ColorPalette } from '../../constants/colors'; // Import tipe palet

// Komponen Card kecil
// Kita tambahkan 'colors' sebagai prop
const PriceCard = ({
  title,
  data,
  colors, // <-- TAMBAHAN
}: {
  title: string;
  data: (PackagePrice | ProductPrice | UpgradePrice)[];
  colors: ColorPalette; // <-- TAMBAHAN
}) => (
  // Terapkan warna card
  <View style={[styles.card, { backgroundColor: colors.card }]}>
    {/* Terapkan warna text dan border */}
    <Text style={[styles.cardTitle, { color: colors.text, borderBottomColor: colors.border }]}>
      {title}
    </Text>
    {data.map((item) => (
      <View style={styles.itemRow} key={item.name}>
        <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.itemPrice, { color: colors.primary }]}>
          Rp {item.price.toLocaleString('id-ID')}
        </Text>
      </View>
    ))}
  </View>
);

const MenuScreen = () => {
  // 2. Ambil state dari kedua store
  const { prices, isLoading, error, fetchPrices } = useMenuStore();
  const { colors } = useThemeStore(); // <-- Ambil palet warna

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // 3. Render Loading (dengan warna tema)
  if (isLoading && !prices) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 10 }}>Memuat Daftar Harga...</Text>
      </View>
    );
  }

  // 4. Render Error (dengan warna tema)
  if (error && !prices) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.danger }]}>Oops! {error}</Text>
        <Text style={{ color: colors.secondary }}>Tarik untuk mencoba lagi</Text>
      </View>
    );
  }

  // 5. Render Empty State (dengan warna tema)
  if (!prices || (prices.packages.length === 0 && prices.products.length === 0)) {
    return (
      <ScrollView
        contentContainerStyle={[styles.centered, { backgroundColor: colors.background }]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchPrices}
            tintColor={colors.primary}
          />
        }
      >
        <Text style={[styles.emptyText, { color: colors.secondary }]}>
          Daftar Harga Belum Tersedia
        </Text>
        <Text style={{ color: colors.secondary }}>Tarik ke bawah untuk memuat ulang.</Text>
      </ScrollView>
    );
  }

  // 6. RENDER KONTEN UTAMA (dengan warna tema)
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={fetchPrices}
          tintColor={colors.primary}
        />
      }
    >
      <Text style={[styles.header, { color: colors.text }]}>Daftar Harga</Text>
      {/* Kirim 'colors' ke komponen card */}
      <PriceCard title="Paket Billing" data={prices.packages} colors={colors} />
      <PriceCard title="Makanan & Minuman" data={prices.products} colors={colors} />
      <PriceCard title="Upgrade Member" data={prices.upgrades} colors={colors} />
    </ScrollView>
  );
};

// 7. Hapus warna hardcode dari StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    marginBottom: 16,
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
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  itemName: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  }
});

export default MenuScreen;