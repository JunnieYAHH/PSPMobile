import { Tabs } from "expo-router";
import { useSelector } from "react-redux";
import { FontAwesome } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{
        headerShown: false, title: 'Dashboard', tabBarIcon: ({ color }) => (
          <FontAwesome name='home' color={color} size={28} />
        )
      }} />
      <Tabs.Screen name="scanner" options={{
        headerShown: false, title: 'Scanner', tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="camera-iris" size={30} color={color} />
        )
      }} />
      <Tabs.Screen name="training-sessions" options={{
        headerShown: false, title: 'Sessions', tabBarIcon: ({ color }) => (
          <FontAwesome name='users' color={color} size={28} />
        )
      }} />
      <Tabs.Screen name="profile" options={{
        headerShown: false, title: 'Profile', tabBarIcon: ({ color }) => (
          <FontAwesome name='user' color={color} size={28} />
        )
      }} />
      {/* <Tabs.Screen name="settings" options={{
        headerShown: false, title: 'Settings', tabBarIcon: ({ color }) => (
          <FontAwesome name='cog' color={color} size={28} />
        )
      }} /> */}
    </Tabs>
  );
}
