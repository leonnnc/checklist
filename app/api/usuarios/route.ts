import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

// POST /api/usuarios — crea usuario sin afectar la sesión actual
export async function POST(req: NextRequest) {
  try {
    const { nombre, email, password } = await req.json();

    if (!nombre?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "Nombre, email y contraseña son requeridos" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener mínimo 6 caracteres" }, { status: 400 });
    }

    // Crear en Firebase Auth usando Admin SDK (no altera la sesión del admin)
    const userRecord = await adminAuth.createUser({
      email: email.trim().toLowerCase(),
      password,
      displayName: nombre.trim(),
    });

    // Guardar perfil en Firestore
    await adminDb.collection("usuarios").doc(userRecord.uid).set({
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      grupoId: "",
      rol: "usuario",
      activo: true,
      creadoEn: new Date().toISOString(),
    });

    return NextResponse.json({ uid: userRecord.uid, ok: true });
  } catch (e: any) {
    const msg = e.code === "auth/email-already-exists"
      ? "Este correo ya está registrado"
      : e.message || "Error al crear usuario";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

// DELETE /api/usuarios?uid=xxx — elimina usuario
export async function DELETE(req: NextRequest) {
  try {
    const uid = req.nextUrl.searchParams.get("uid");
    if (!uid) return NextResponse.json({ error: "uid requerido" }, { status: 400 });

    await adminAuth.deleteUser(uid);
    await adminDb.collection("usuarios").doc(uid).delete();

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
