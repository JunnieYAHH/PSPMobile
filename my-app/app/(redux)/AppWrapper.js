import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./authSlice";
import { Stack, useRouter } from "expo-router";
import LoadingScreen from "../components/LodingScreen";

function AppWrapper() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/");
      } else if (user.role === 'user') {
        router.replace("/(tabs)");
      } else if (user.role === 'client') {
        router.replace("/components/Client/(tabs)");
      } else if (user.role === 'coach') {
        router.replace("/components/Coach/(tabs)");
      }
    }
  }, [loading, user, router]);

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
