import { Tabs } from "expo-router";
import { useSelector } from "react-redux";
import { FontAwesome } from '@expo/vector-icons';
import { useEffect } from "react";
import { useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function RootLayout() {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  // console.log('This is user', user.user?.role)

  useEffect(() => {
    if (!user) {
      router.replace("/");
      return;
    }

    const role = user.user?.role || user.role;
    const par_Q = user.user?.par_Q || []; 

    switch (role) {
      case 'user':
        router.replace("/(tabs)");
        break;
      case 'client':
        if (par_Q.length === 0) {
          router.replace("/components/Client/Form");
        } else {
          router.replace("/components/Client/(tabs)");
        }
        break;
      case 'coach':
        router.replace("/components/Coach/(tabs)");
        break;
      case 'admin':
        router.replace("/components/Admin/(tabs)");
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
