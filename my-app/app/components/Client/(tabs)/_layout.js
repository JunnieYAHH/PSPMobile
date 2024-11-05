import { Tabs, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { FontAwesome } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useEffect } from "react";

export default function RootLayout() {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{
        headerShown: false, title: 'Home', tabBarIcon: ({ color }) => (
          <FontAwesome name='home' color={color} size={28} />
        )
      }} />
      <Tabs.Screen name="training" options={{
        headerShown: false, title: 'Training', tabBarIcon: ({ color }) => (
          <Ionicons name="barbell-sharp" size={24} color="black" />)
      }} />
      <Tabs.Screen name="programs" options={{
        headerShown: false, title: 'Programs', tabBarIcon: ({ color }) => (
          <AntDesign name="dropbox" size={24} color="black" />)
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
