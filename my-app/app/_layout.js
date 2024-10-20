import { Stack } from "expo-router";
import queryClient from "./(services)/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import store from "./(redux)/store";
import { Provider } from "react-redux";
import AppWrapper from "./(redux)/AppWrapper";
import { StripeProvider } from '@stripe/stripe-react-native'
// import STRIPE_PUBLISHABLE_KEY from "../assets/common/stripePublishableKey";

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51QBo2uJ7qxKT5t1OZIcx0VidJBOzsFZ42dFk5gRLQNBLvXzRR4JeJTJAmXWjnT4w0L5WKjK0Sxksq784avNSK6JZ00TRahU9n5'

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <AppWrapper />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </StripeProvider>
    </Provider>
  );
}