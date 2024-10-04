import { Stack } from "expo-router";
import queryClient from "./(services)/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import store from "./(redux)/store";
import { Provider } from "react-redux";
import AppWrapper from "./(redux)/AppWrapper";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppWrapper />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </Provider>
  );
}