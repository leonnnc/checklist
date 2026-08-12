"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Grupo, Usuario } from "@/lib/types";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, UserCheck, UserX } from "lucide-react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);

  // Modal crear
  const [modalCrear, setModalCrear] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingCrear, setLoadingCrear] = useState(false);

  // Modal asignar grupo
  const [modalGrupo, setModalGrupo] = useState<Usuario | null>(null);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState("");
  const [loadingGrupo, setLoadingGrupo] = useState(false);

  useEffect(() => {
    const u1 = onSnapshot(collection(db, "usuarios"), s =>
      setUsuarios(
        s.docs
          .map(d => ({ id: d.id, ...d.data() } as Usuario))
          .filter(u => u.rol !== "admin")
      )
    );
    const u2 = onSnapshot(collection(db, "grupos"), s =>
      setGrupos(s.docs.map(d => ({ id: d.id, ...d.data() } as Grupo)))
    );
    return () => { u1(); u2(); };
  }, []);

  // ── Crear usuario ──────────────────────────────────────────────────────────
  function abrirCrear() {
    setNombre(""); setEmail(""); setPassword(""); setModalCrear(true);
  }

  async function crearNuevo() {
    if (!nombre.trim())       return toast.error("El nombre es requerido");
    if (!email.trim())        return toast.error("El correo es requerido");
    if (password.length < 6)  return toast.error("La contraseña debe tener mínimo 6 caracteres");
    setLoadingCrear(true);
    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre.trim(), email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Usuario creado. Ahora asígnale un grupo.");
      setModalCrear(false);
    } catch (e: any) {
      toast.error(e.message);
    } finally { setLoadingCrear(false); }
  }

  // ── Asignar / cambiar grupo ────────────────────────────────────────────────
  function abrirAsignarGrupo(u: Usuario) {
    setModalGrupo(u);
    setGrupoSeleccionado(u.grupoId || "");
  }

  async function guardarGrupo() {
    if (!modalGrupo) return;
    setLoadingGrupo(true);
    try {
      await updateDoc(doc(db, "usuarios", modalGrupo.id), { grupoId: grupoSeleccionado });
      toast.success("Grupo asignado");
      setModalGrupo(null);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoadingGrupo(false); }
  }

  // ── Otras acciones ─────────────────────────────────────────────────────────
  async function toggleActivo(u: Usuario) {
    await updateDoc(doc(db, "usuarios", u.id), { activo: !u.activo });
    toast.success(u.activo ? "Usuario desactivado" : "Usuario activado");
  }

  async function eliminar(u: Usuario) {
    if (!confirm(`¿Eliminar a "${u.nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      const res = await fetch(`/api/usuarios?uid=${u.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Usuario eliminado");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  const grupoMap = Object.fromEntries(grupos.map(g => [g.id, g]));

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-500 text-sm mt-1">Crea usuarios y asígnales un grupo de servicio</p>
        </div>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          <Plus size={16} /> Nuevo usuario
        </button>
      </div>

      {/* Lista vacía */}
      {usuarios.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <span className="text-5xl">👤</span>
          <p className="text-gray-500 mt-3 font-medium">No hay usuarios aún</p>
          <p className="text-gray-400 text-sm mt-1">Crea el primero con el botón de arriba</p>
        </div>
      )}

      {/* Tabla */}
      {usuarios.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {usuarios.map((u, i) => {
            const grupo = grupoMap[u.grupoId];
            return (
              <div
                key={u.id}
                className={`flex items-center px-5 py-4 gap-4 ${i < usuarios.length - 1 ? "border-b border-gray-50" : ""}`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-900 font-bold text-sm">
                    {u.nombre.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{u.nombre}</p>
                    {!u.activo && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        Inactivo
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{u.email}</p>
                </div>

                {/* Grupo — clic para cambiar */}
                <button
                  onClick={() => abrirAsignarGrupo(u)}
                  className="flex-shrink-0"
                  title="Cambiar grupo"
                >
                  {grupo ? (
                    <span
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white hover:opacity-80 transition"
                      style={{ backgroundColor: grupo.color || "#1a237e" }}
                    >
                      {grupo.nombre}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition">
                      + Asignar grupo
                    </span>
                  )}
                </button>

                {/* Acciones */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleActivo(u)}
                    title={u.activo ? "Desactivar" : "Activar"}
                    className={`p-2 rounded-lg transition ${u.activo ? "text-green-500 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"}`}
                  >
                    {u.activo ? <UserCheck size={16} /> : <UserX size={16} />}
                  </button>
                  <button
                    onClick={() => eliminar(u)}
                    title="Eliminar"
                    className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal: Crear usuario ─────────────────────────────────────────────── */}
      {modalCrear && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Nuevo usuario</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  autoFocus
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="correo@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalCrear(false)}
                className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={crearNuevo}
                disabled={loadingCrear}
                className="flex-1 bg-blue-900 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50"
              >
                {loadingCrear ? "Creando..." : "Crear usuario"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Asignar grupo ─────────────────────────────────────────────── */}
      {modalGrupo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Asignar grupo</h2>
            <p className="text-sm text-gray-500 mb-5">{modalGrupo.nombre}</p>

            <div className="space-y-2">
              {grupos.map(g => (
                <button
                  key={g.id}
                  onClick={() => setGrupoSeleccionado(g.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition text-left ${
                    grupoSeleccionado === g.id
                      ? "border-blue-900 bg-blue-50"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{g.nombre}</p>
                    {g.descripcion && <p className="text-xs text-gray-400">{g.descripcion}</p>}
                  </div>
                  {grupoSeleccionado === g.id && (
                    <span className="ml-auto text-blue-900 text-lg">✓</span>
                  )}
                </button>
              ))}
              {grupos.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  No hay grupos. Crea uno primero en la sección Grupos.
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalGrupo(null)}
                className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={guardarGrupo}
                disabled={loadingGrupo || !grupoSeleccionado}
                className="flex-1 bg-blue-900 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50"
              >
                {loadingGrupo ? "Guardando..." : "Asignar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
