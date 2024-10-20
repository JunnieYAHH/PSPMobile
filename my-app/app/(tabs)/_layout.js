import { Tabs } from "expo-router";
import { useSelector } from "react-redux";
import { FontAwesome } from '@expo/vector-icons';
import { useEffect } from "react";
import { useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function RootLayout() {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    } else if (user.user.role === 'client') {
      // console.log("Redirecting to client index..."); // Debugging line
      router.replace("/components/Client/(tabs)");
    }
  }, [user, router]);

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{
        headerShown: false, title: 'Home', tabBarIcon: ({ color }) => (
          <FontAwesome name='home' color={color} size={28} />
        )
      }} />
      <Tabs.Screen name="programs" options={{
        headerShown: false, title: 'Programs', tabBarIcon: ({ color }) => (
          <Ionicons name="barbell" size={28} color="black" />)
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
