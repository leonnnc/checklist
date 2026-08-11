/**
 * Script para crear el usuario administrador inicial.
 * Ejecutar UNA sola vez:
 *   node scripts/crear-admin.mjs
 */

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCD2ghDCVV1cyWr6zBT2dtL4qy9jP_pYM0",
  authDomain: "depa804-d7c90.firebaseapp.com",
  projectId: "depa804-d7c90",
  storageBucket: "depa804-d7c90.firebasestorage.app",
  messagingSenderId: "647429660414",
  appId: "1:647429660414:web:930e79eb1dc3332d23cfaf",
};

// ─── CONFIGURA AQUÍ TUS DATOS DE ADMIN ───────────────────────────────────────
const ADMIN_EMAIL    = "admin@depa804.com";   // ← cambia esto
const ADMIN_PASSWORD = "Admin123!";            // ← cambia esto (mín 8 chars)
const ADMIN_NOMBRE   = "Administrador";        // ← cambia esto
// ─────────────────────────────────────────────────────────────────────────────

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

try {
  console.log("Creando usuario admin...");
  const cred = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);

  await setDoc(doc(db, "usuarios", cred.user.uid), {
    nombre: ADMIN_NOMBRE,
    email: ADMIN_EMAIL,
    rol: "admin",
    activo: true,
    creadoEn: new Date().toISOString(),
  });

  console.log("✅ Admin creado correctamente!");
  console.log("   UID:", cred.user.uid);
  console.log("   Email:", ADMIN_EMAIL);
  console.log("   Ya puedes entrar a http://localhost:3000/login");
  process.exit(0);
} catch (e) {
  if (e.code === "auth/email-already-in-use") {
    console.log("⚠️  Este email ya existe. Si ya tienes el admin, no hace falta correr este script.");
  } else {
    console.error("❌ Error:", e.message);
  }
  process.exit(1);
}
