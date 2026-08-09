"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { crearUsuario } from "@/lib/firestore";
import type { Grupo, Usuario } from "@/lib/types";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, UserCheck, UserX } from "lucide-react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [grupoId, setGrupoId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u1 = onSnapshot(collection(db, "usuarios"), s =>
      setUsuarios(s.docs.map(d => ({ id: d.id, ...d.data() } as Usuario)).filter(u => u.rol !== "admin"))
    );
    const u2 = onSnapshot(collection(db, "grupos"), s =>
      setGrupos(s.docs.map(d => ({ id: d.id, ...d.data() } as Grupo)))
    );
    return () => { u1(); u2(); };
  }, []);

  function abrirNuevo() {
    setEditando(null); setNombre(""); setEmail(""); setPassword(""); setGrupoId(grupos[0]?.id || ""); setModal(true);
  }

  function abrirEditar(u: Usuario) {
    setEditando(u); setNombre(u.nombre); setEmail(u.email); setPassword(""); setGrupoId(u.grupoId); setModal(true);
  }

  async function guardar() {
    if (!nombre.trim() || !grupoId) return toast.error("Nombre y grupo son requeridos");
    if (!editando && (!email.trim() || password.length < 6)) return toast.error("Email y contraseña (mín. 6 chars) requeridos");
    setLoading(true);
    try {
      if (editando) {
        await updateDoc(doc(db, "usuarios", editando.id), { nombre, grupoId });
        toast.success("Usuario actualizado");
      } else {
        await crearUsuario(email, password, nombre, grupoId);
        toast.success("Usuario creado");
      }
      setModal(false);
    } catch (e: any) {
      toast.error(e.message?.includes("email-already-in-use") ? "Este email ya está registrado" : e.message);
    } finally { setLoading(false); }
  }

  async function toggleActivo(u: Usuario) {
    await updateDoc(doc(db, "usuarios", u.id), { activo: !u.activo });
    toast.success(u.activo ? "Usuario desactivado" : "Usuario activado");
  }

  async function eliminar(u: Usuario) {
    if (!confirm(`¿Eliminar a "${u.nombre}"?`)) return;
    await deleteDoc(doc(db, "usuarios", u.id));
    toast.success("Usuario eliminado");
  }

  const grupoMap = Object.fromEntries(grupos.map(g => [g.id, g]));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona los usuarios y sus grupos asignados</p>
        </div>
        <button onClick={abrirNuevo}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition">
          <Plus size={16} /> Nuevo usuario
        </button>
      </div>

      {usuarios.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <span className="text-5xl">👤</span>
          <p className="text-gray-500 mt-3">No hay usuarios. Crea el primero.</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {usuarios.map((u, i) => {
          const grupo = grupoMap[u.grupoId];
          return (
            <div key={u.id}
              className={`flex items-center px-5 py-4 gap-4 ${i < usuarios.length - 1 ? "border-b border-gray-50" : ""}`}>
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-900 font-bold text-sm">{u.nombre.charAt(0).toUpperCase()}</span>
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{u.nombre}</p>
                  {!u.activo && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Inactivo</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
              {/* Grupo badge */}
              {grupo && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white flex-shrink-0"
                  style={{ backgroundColor: grupo.color || "#1a237e" }}>
                  {grupo.nombre}
                </div>
              )}
              {/* Acciones */}
              <div className="flex items-center gap-1">
                <button onClick={() => toggleActivo(u)}
                  className={`p-2 rounded-lg transition ${u.activo ? "text-green-500 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"}`}>
                  {u.activo ? <UserCheck size={16} /> : <UserX size={16} />}
                </button>
                <button onClick={() => abrirEditar(u)}
                  className="p-2 text-gray-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition">
                  <Pencil size={16} />
                </button>
                <button onClick={() => eliminar(u)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {editando ? "Editar usuario" : "Nuevo usuario"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                <input value={nombre} onChange={e => setNombre(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="Nombre del usuario" />
              </div>
              {!editando && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                      placeholder="usuario@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                      placeholder="Mínimo 6 caracteres" />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grupo de servicio *</label>
                <select value={grupoId} onChange={e => setGrupoId(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white">
                  <option value="">Seleccionar grupo...</option>
                  {grupos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button onClick={guardar} disabled={loading}
                className="flex-1 bg-blue-900 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50">
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
