import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1a237e',
        tabBarInactiveTintColor: '#90a4ae',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#e0e0e0' },
        headerStyle: { backgroundColor: '#1a237e' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Depa 804',
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="almacen"
        options={{
          title: 'Almacén General',
          tabBarLabel: 'Almacén',
          tabBarIcon: ({ color, size }) => <Ionicons name="archive-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
