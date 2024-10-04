import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./authSlice";
import { Stack } from "expo-router";

function AppWrapper() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen name="auth/login" options={{ title: "Login", headerShown: false }} />
      <Stack.Screen name="auth/register" options={{ title: "Register", headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ title: "Tabs", headerShown: false }} />
      <Stack.Screen name="components/Exercise/ExerciseDetails" options={{ title: "ExerciseDetails", headerShown: false }} />
      <Stack.Screen name="components/User/EditUserProfile" options={{ title: "EditUserProfile", headerShown: false }} />
      <Stack.Screen name="components/User/ResetUserPassword" options={{ title: "ResetUserPassword", headerShown: false }} />
      <Stack.Screen name="components/Application/About" options={{ title: "AboutApplication", headerShown: false }} />
    </Stack>
  );
}

export default AppWrapper;