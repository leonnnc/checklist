import {
  doc, getDoc, collection, query, where,
  onSnapshot, setDoc, updateDoc, deleteDoc, serverTimestamp
} from "firebase/firestore";
import { db } from "./config";
import type { Grupo, ProgresoTarea } from "../types/firebase";

// ── USUARIO ──────────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string) {
  const snap = await getDoc(doc(db, "usuarios", uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// ── GRUPO ─────────────────────────────────────────────────────────────────────

export async function getGrupo(grupoId: string): Promise<Grupo | null> {
  const snap = await getDoc(doc(db, "grupos", grupoId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Grupo;
}

// ── PROGRESO ──────────────────────────────────────────────────────────────────

// Clave única por progreso: usuarioId_ambienteId_seccionId_tareaId
function progresoId(uid: string, ambienteId: string, seccionId: string, tareaId: string) {
  return `${uid}_${ambienteId}_${seccionId}_${tareaId}`;
}

export async function marcarTarea(
  uid: string,
  usuarioNombre: string,
  grupoId: string,
  ambienteId: string,
  seccionId: string,
  tareaId: string,
  completado: boolean
) {
  const id = progresoId(uid, ambienteId, seccionId, tareaId);
  await setDoc(doc(db, "progreso", id), {
    tareaId,
    seccionId,
    ambienteId,
    grupoId,
    usuarioId: uid,
    usuarioNombre,
    completado,
    completadoEn: completado ? new Date().toISOString() : null,
  });
}

export function suscribirProgresoUsuario(
  uid: string,
  grupoId: string,
  callback: (progresos: ProgresoTarea[]) => void
) {
  const q = query(
    collection(db, "progreso"),
    where("usuarioId", "==", uid),
    where("grupoId", "==", grupoId)
  );
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => d.data() as ProgresoTarea));
  });
}

export async function resetProgresoUsuario(uid: string, grupoId: string) {
  const q = query(
    collection(db, "progreso"),
    where("usuarioId", "==", uid),
    where("grupoId", "==", grupoId)
  );
  const { getDocs } = await import("firebase/firestore");
  const snap = await getDocs(q);
  const batch = snap.docs.map(d => updateDoc(doc(db, "progreso", d.id), {
    completado: false,
    completadoEn: null,
  }));
  await Promise.all(batch);
}
