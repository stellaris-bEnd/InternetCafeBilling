import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AdminTabParamList } from './types'; // Kita akan buat file types ini

// 1. Import layar-layar Admin
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import AdminBillingScreen from '../screens/Admin/AdminBillingScreen';

// 2. Import Ikon dan Store Tema
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';

const Tab = createBottomTabNavigator<AdminTabParamList>();

const AdminNavigator = () => {
  // 3. Ambil palet warna aktif dari store
  const { colors } = useThemeStore();

  return (
    <Tab.Navigator
      // 4. Terapkan styling dinamis
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.card },
        headerTitleStyle: { fontWeight: 'bold', color: colors.text },
        
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },

        // 5. Fungsi untuk menampilkan ikon
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'];

          if (route.name === 'Dashboard') {
            iconName = focused ? 'cog' : 'cog-outline';
          } else if (route.name === 'PCMonitor') {
            iconName = focused ? 'tv' : 'tv-outline';
          } else {
            iconName = 'alert-circle'; // Fallback
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Tab 1: Dashboard */}
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{ title: 'Admin Dashboard' }}
      />

      {/* Tab 2: PC Monitor */}
      <Tab.Screen
        name="PCMonitor"
        component={AdminBillingScreen}
        options={{ title: 'PC Monitor' }}
      />
    </Tab.Navigator>
  );
};

export default AdminNavigator;