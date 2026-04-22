import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB9hEEzihMruI9RvgC8u-lsWvix7IKu5i8",
  authDomain: "painel-assistencia.firebaseapp.com",
  projectId: "painel-assistencia",
  storageBucket: "painel-assistencia.firebasestorage.app",
  messagingSenderId: "218498224475",
  appId: "1:218498224475:web:e6d1e813e5e48a36a84a7e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function test() {
  try {
    await signInWithEmailAndPassword(auth, "deyvisongomo@gmail.com", "Dgs86094966+");
    const clients = await getDocs(query(collection(db, "clients"), limit(5)));
    console.log("Clients count:", clients.size);
    const os = await getDocs(query(collection(db, "service_orders"), limit(5)));
    console.log("OS count:", os.size);
    process.exit(0);
  } catch (err) {
    console.error("Firebase error details:", err.message);
    process.exit(1);
  }
}
test();
