import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./authSlice"; // Adjust this path as needed
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
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
      <Stack.Screen name="auth/login" options={{ title: "Login", headerShown: false }} />
      <Stack.Screen name="auth/register" options={{ title: "Register", headerShown: false }} />
      <Stack.Screen name="components/Exercise/ExerciseDetails" options={{ title: "ExerciseDetails", headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ title: "Tabs", headerShown: false }} />
    </Stack>
  );
}

export default AppWrapper;