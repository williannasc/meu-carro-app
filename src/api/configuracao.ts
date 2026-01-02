import { initializeApp, getApp, getApps } from "firebase/app";
import { 
  initializeAuth, 
  getAuth, 
  // Importamos o tipo Persistence para o TypeScript não reclamar
  type Persistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Aqui é o único lugar que usamos o sub-caminho /react-native
// @ts-ignore - Usamos o ignore aqui porque os tipos do Firebase às vezes falham no SDK 54
import * as firebaseAuth from "firebase/auth";
// @ts-ignore
import { getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// 1. Inicializa o App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Inicializa a Autenticação com persistência local (estilo Mobile)
const autenticacao = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// 3. Inicializa o Firestore
const bancoDados = getFirestore(app);

export { autenticacao, bancoDados };