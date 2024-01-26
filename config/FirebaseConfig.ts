import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBXVFAtZaMKE-cveZFwxRNGxHrIx9iteiw",
  authDomain: "fir-rn-app-626c6.firebaseapp.com",
  projectId: "fir-rn-app-626c6",
  storageBucket: "fir-rn-app-626c6.appspot.com",
  messagingSenderId: "234308871359",
  appId: "1:234308871359:web:9c6f795c3023890278520a",
  measurementId: "G-HMJ5VZDY86",
};

const firebaseApp = initializeApp(firebaseConfig);
export const firestoreDB = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
export const firebaseAuth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});
