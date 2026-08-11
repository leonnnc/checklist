import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, updatePassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCD2ghDCVV1cyWr6zBT2dtL4qy9jP_pYM0",
  authDomain: "depa804-d7c90.firebaseapp.com",
  projectId: "depa804-d7c90",
  storageBucket: "depa804-d7c90.firebasestorage.app",
  messagingSenderId: "647429660414",
  appId: "1:647429660414:web:930e79eb1dc3332d23cfaf",
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

try {
  // Login con la contraseña original del script
  const cred = await signInWithEmailAndPassword(auth, "admin@depa804.com", "Admin123!");
  // Cambiar a la nueva contraseña
  await updatePassword(cred.user, "admindepa804");
  console.log("✅ Contraseña actualizada a: admindepa804");
  process.exit(0);
} catch (e) {
  console.error("❌ Error:", e.message);
  process.exit(1);
}
