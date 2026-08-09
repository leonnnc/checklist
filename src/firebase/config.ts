import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCD2ghDCVV1cyWr6zBT2dtL4qy9jP_pYM0",
  authDomain: "depa804-d7c90.firebaseapp.com",
  projectId: "depa804-d7c90",
  storageBucket: "depa804-d7c90.firebasestorage.app",
  messagingSenderId: "647429660414",
  appId: "1:647429660414:web:930e79eb1dc3332d23cfaf",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
