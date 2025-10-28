import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MemberTabParamList } from './types';
import HomeScreen from '../screens/Member/HomeScreen';
import BillingScreen from '../screens/Member/BillingScreen';
import MenuScreen from '../screens/Member/MenuScreen';

// 1. Import Ikon
import { Ionicons } from '@expo/vector-icons';
// 2. IMPORT STORE TEMA (Bukan 'COLORS' lagi)
import { useThemeStore } from '../store/useThemeStore';

const Tab = createBottomTabNavigator<MemberTabParamList>();

const MemberNavigator = () => {
  // 3. AMBIL PALET WARNA AKTIF DARI STORE
  const { colors } = useThemeStore();

  return (
    <Tab.Navigator
      // 4. Terapkan styling dinamis menggunakan palet 'colors'
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.card }, // Header
        headerTitleStyle: { fontWeight: 'bold', color: colors.text }, // Teks header
        
        tabBarActiveTintColor: colors.primary, // Ikon aktif
        tabBarInactiveTintColor: colors.secondary, // Ikon tidak aktif
        tabBarStyle: { 
          backgroundColor: colors.card, // Background tab bar
          borderTopColor: colors.border, // Border atas
        },

        // 5. Fungsi untuk menampilkan ikon (tidak berubah)
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'];

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Billing') {
            iconName = focused ? 'desktop' : 'desktop-outline';
          } else if (route.name === 'Menu') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else {
            iconName = 'alert-circle'; // Fallback
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Beranda' }} />
      <Tab.Screen name="Billing" component={BillingScreen} options={{ title: 'Billing PC' }} />
      <Tab.Screen name="Menu" component={MenuScreen} options={{ title: 'Daftar Harga' }} />
    </Tab.Navigator>
  );
};

export default MemberNavigator;