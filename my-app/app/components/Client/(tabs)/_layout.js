import { Tabs, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { FontAwesome } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect } from "react";

export default function RootLayout() {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  
  useEffect(() => {
    if (!user) {
      router.replace("/");
      return;
    }

    const role = user.user?.role || user.role;
    switch (role) {
      case 'user':
        router.replace("/(tabs)");
        break;
      case 'client':
        router.replace("/components/Client/(tabs)");
        break;
      case 'coach':
        router.replace("/components/Coach/(tabs)");
        break;
      default:
        break;
    }
  }, [user, router]);
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
