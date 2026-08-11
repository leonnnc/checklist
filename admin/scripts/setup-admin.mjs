import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

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
const db   = getFirestore(app);

try {
  console.log("Iniciando sesión...");
  const cred = await signInWithEmailAndPassword(auth, "admin@depa804.com", "Admindepa804");
  const uid  = cred.user.uid;
  console.log("UID:", uid);

  // Verificar si ya existe el documento
  const snap = await getDoc(doc(db, "usuarios", uid));
  if (snap.exists()) {
    console.log("Documento actual:", snap.data());
    // Asegurarse que tenga rol admin
    await setDoc(doc(db, "usuarios", uid), {
      nombre: "Administrador",
      email: "admin@depa804.com",
      rol: "admin",
      activo: true,
      creadoEn: new Date().toISOString(),
    }, { merge: true });
    console.log("✅ Documento actualizado con rol=admin");
  } else {
    // Crear desde cero
    await setDoc(doc(db, "usuarios", uid), {
      nombre: "Administrador",
      email: "admin@depa804.com",
      rol: "admin",
      activo: true,
      creadoEn: new Date().toISOString(),
    });
    console.log("✅ Documento creado con rol=admin");
  }

  console.log("\n🎉 Listo! Recarga http://localhost:3000 y entra con:");
  console.log("   Email:    admin@depa804.com");
  console.log("   Password: Admindepa804");
  process.exit(0);
} catch (e) {
  console.error("❌ Error:", e.message);
  process.exit(1);
}
