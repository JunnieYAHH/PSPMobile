import { Tabs } from "expo-router";
import { useSelector } from "react-redux";
import { FontAwesome } from '@expo/vector-icons';
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function RootLayout() {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/"); // Redirect to the home screen if user is not authenticated
    }
  }, [user, router]);

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{
        headerShown: false, title: 'Home', tabBarIcon: ({ color }) => (
          <FontAwesome name='home' color={color} size={28} />
        )
      }} />
      <Tabs.Screen name="profile" options={{
        headerShown: false, title: 'Profile', tabBarIcon: ({ color }) => (
          <FontAwesome name='user' color={color} size={28} />
        )
      }} />
      <Tabs.Screen name="settings" options={{
        headerShown: false, title: 'Settings', tabBarIcon: ({ color }) => (
          <FontAwesome name='cog' color={color} size={28} />
        )
      }} />
    </Tabs>
  );
}
