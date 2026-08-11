import {
  collection, doc, getDocs, getDoc, setDoc, addDoc,
  updateDoc, deleteDoc, query, where, onSnapshot,
  serverTimestamp, Timestamp
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "./firebase";
import type { Grupo, Usuario, ProgresoTarea } from "./types";

// ── GRUPOS ──────────────────────────────────────────────────────────────────

export async function getGrupos(): Promise<Grupo[]> {
  const snap = await getDocs(collection(db, "grupos"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Grupo));
}

export async function getGrupo(id: string): Promise<Grupo | null> {
  const snap = await getDoc(doc(db, "grupos", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } as Grupo : null;
}

export async function crearGrupo(data: Omit<Grupo, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "grupos"), {
    ...data,
    creadoEn: new Date().toISOString(),
  });
  return ref.id;
}

export async function actualizarGrupo(id: string, data: Partial<Grupo>): Promise<void> {
  await updateDoc(doc(db, "grupos", id), data);
}

export async function eliminarGrupo(id: string): Promise<void> {
  await deleteDoc(doc(db, "grupos", id));
}

// ── USUARIOS ────────────────────────────────────────────────────────────────

export async function getUsuarios(): Promise<Usuario[]> {
  const snap = await getDocs(collection(db, "usuarios"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Usuario));
}

export async function getUsuario(id: string): Promise<Usuario | null> {
  const snap = await getDoc(doc(db, "usuarios", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } as Usuario : null;
}

export async function crearUsuario(
  email: string,
  password: string,
  nombre: string,
  grupoId: string
): Promise<string> {
  // Crear en Firebase Auth
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;
  // Guardar perfil en Firestore
  await setDoc(doc(db, "usuarios", uid), {
    nombre,
    email,
    grupoId,
    rol: "usuario",
    activo: true,
    creadoEn: new Date().toISOString(),
  });
  return uid;
}

export async function actualizarUsuario(id: string, data: Partial<Usuario>): Promise<void> {
  await updateDoc(doc(db, "usuarios", id), data);
}

export async function eliminarUsuario(id: string): Promise<void> {
  await deleteDoc(doc(db, "usuarios", id));
}

// ── PROGRESO ────────────────────────────────────────────────────────────────

export function suscribirProgreso(
  grupoId: string,
  callback: (progresos: ProgresoTarea[]) => void
) {
  const q = query(collection(db, "progreso"), where("grupoId", "==", grupoId));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ ...d.data() } as ProgresoTarea)));
  });
}

export function suscribirProgresoUsuario(
  usuarioId: string,
  callback: (progresos: ProgresoTarea[]) => void
) {
  const q = query(collection(db, "progreso"), where("usuarioId", "==", usuarioId));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ ...d.data() } as ProgresoTarea)));
  });
}

export function suscribirTodosProgreso(
  callback: (progresos: ProgresoTarea[]) => void
) {
  return onSnapshot(collection(db, "progreso"), snap => {
    callback(snap.docs.map(d => ({ ...d.data() } as ProgresoTarea)));
  });
}
