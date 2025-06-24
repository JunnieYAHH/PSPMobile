import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./authSlice";
import { Stack, useRouter } from "expo-router";
import LoadingScreen from "../components/LodingScreen";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
function AppWrapper() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { screen, roomId, targetRole } = response.notification.request.content.data || {};

      if (screen === "Chat" && roomId && targetRole) {
        switch (targetRole) {
          case "client":
            router.push(`/components/Client/Chat/Chats?roomId=${roomId}`);
            break;
          case "composter":
            router.push(`/components/Composter/components/Chat/Chats?roomId=${roomId}`);
            break;
          default:
            console.warn("Unknown targetRole in push notification:", targetRole);
        }
      }
    });

    return () => subscription.remove();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ title: "Login", headerShown: false }} />
      <Stack.Screen name="auth/register" options={{ title: "Register", headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ title: "Tabs", headerShown: false }} />
    </Stack>
  );
}

export default AppWrapper;
