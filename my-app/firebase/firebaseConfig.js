// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";

// Your config
const firebaseConfig = {
  apiKey: "AIzaSyD6YXdL7l_I-JzzxW75k8Rc5YVUzY8fJIQ",
  authDomain: "pspchat-1c64f.firebaseapp.com",
  projectId: "pspchat-1c64f",
  storageBucket: "pspchat-1c64f.firebasestorage.app",
  messagingSenderId: "194166106125",
  appId: "1:194166106125:web:e89f317c40d752ab628d44",
  measurementId: "G-RZC6600FMN"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// ✅ Initialize Firestore
export const db = getFirestore(app);

// ✅ Firestore Collection References
export const usersRef = collection(db, "users");
export const roomRef = collection(db, "rooms");