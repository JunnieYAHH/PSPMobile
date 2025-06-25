import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import axios from 'axios';
import baseURL from '../assets/common/baseUrl';

export const registerForPushNotificationsAsync = async (userId) => {
  let token;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('❌ Permission not granted for notifications.');
    return null;
  }

  if (!Device.isDevice) {
    console.log("❌ Must use physical device for push notifications.");
    return null;
  }

  try {
    const expoToken = (await Notifications.getExpoPushTokenAsync({ userId })).data;
    console.log("📲 Expo Token:", expoToken);
    token = expoToken;

    // Save token to backend
    await axios.put(`${baseURL}/push/update/token`, {
      userId,
      expoPushToken: token,
    });

    console.log('✅ Push token successfully updated.');
  } catch (error) {
    console.error('❌ Failed to register token:', error.message);
  }

  return token;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
