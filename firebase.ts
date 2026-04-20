
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore, memoryLocalCache } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

// Configurações do Firebase (Projeto: painel-assistencia)
export const firebaseConfig = {
  apiKey: "AIzaSyB9hEEzihMruI9RvgC8u-lsWvix7IKu5i8",
  authDomain: "painel-assistencia.firebaseapp.com",
  projectId: "painel-assistencia",
  storageBucket: "painel-assistencia.firebasestorage.app",
  messagingSenderId: "218498224475",
  appId: "1:218498224475:web:e6d1e813e5e48a36a84a7e",
  measurementId: "G-VRF09WGSE3"
};

// Inicialização robusta
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * CONFIGURAÇÃO DE COMPATIBILIDADE MÁXIMA
 * 
 * experimentalForceLongPolling: true -> Força o uso de HTTP simples em vez de WebSockets (que falham em iframes)
 * localCache: memoryLocalCache() -> Desativa o IndexedDB que pode estar corrompido no navegador
 */
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  localCache: memoryLocalCache(),
});

export const auth = getAuth(app);

console.log("🚀 Firebase Initialized with Long Polling and Memory Cache");

export async function loginAdmin() {
  try {
    await signInWithEmailAndPassword(auth, "deyvisongomo@gmail.com", "Dgs86094966+");
    console.log("✅ Login OK! Carregando painel...");
    window.location.reload(); // recarrega para aplicar login
  } catch (error: any) {
    console.error("❌ Login falhou:", error.message);
  }
}

// Verifica login ao carregar
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("👤 Logado:", user.email);
  } else {
    console.log("🔓 Faça login primeiro");
  }
});

export default app;
