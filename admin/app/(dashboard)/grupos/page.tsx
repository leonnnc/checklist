"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Grupo } from "@/lib/types";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, ChevronRight } from "lucide-react";

const COLORES = ["#1a237e","#e65100","#7b1fa2","#00897b","#f57f17","#546e7a","#c62828","#2e7d32"];

export default function GruposPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Grupo | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [color, setColor] = useState(COLORES[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return onSnapshot(collection(db, "grupos"), s =>
      setGrupos(s.docs.map(d => ({ id: d.id, ...d.data() } as Grupo)))
    );
  }, []);

  function abrirNuevo() {
    setEditando(null); setNombre(""); setDescripcion(""); setColor(COLORES[0]); setModal(true);
  }

  function abrirEditar(g: Grupo) {
    setEditando(g); setNombre(g.nombre); setDescripcion(g.descripcion || ""); setColor(g.color || COLORES[0]); setModal(true);
  }

  async function guardar() {
    if (!nombre.trim()) return toast.error("El nombre es requerido");
    setLoading(true);
    try {
      if (editando) {
        await updateDoc(doc(db, "grupos", editando.id), { nombre, descripcion, color });
        toast.success("Grupo actualizado");
      } else {
        await addDoc(collection(db, "grupos"), {
          nombre, descripcion, color, ambientes: [], creadoEn: new Date().toISOString()
        });
        toast.success("Grupo creado");
      }
      setModal(false);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  async function eliminar(g: Grupo) {
    if (!confirm(`¿Eliminar el grupo "${g.nombre}"? Esta acción no se puede deshacer.`)) return;
    await deleteDoc(doc(db, "grupos", g.id));
    toast.success("Grupo eliminado");
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grupos de Servicio</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona los tipos de servicio de limpieza</p>
        </div>
        <button onClick={abrirNuevo}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition">
          <Plus size={16} /> Nuevo grupo
        </button>
      </div>

      {grupos.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <span className="text-5xl">📋</span>
          <p className="text-gray-500 mt-3">No hay grupos aún. Crea el primero.</p>
        </div>
      )}

      <div className="grid gap-4">
        {grupos.map(g => (
          <div key={g.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-4 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900">{g.nombre}</p>
              {g.descripcion && <p className="text-sm text-gray-500 truncate">{g.descripcion}</p>}
              <p className="text-xs text-gray-400 mt-1">{g.ambientes?.length || 0} ambientes</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/grupos/${g.id}`}
                className="flex items-center gap-1 text-sm text-blue-900 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition">
                Ambientes <ChevronRight size={14} />
              </Link>
              <button onClick={() => abrirEditar(g)}
                className="p-2 text-gray-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition">
                <Pencil size={16} />
              </button>
              <button onClick={() => eliminar(g)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {editando ? "Editar grupo" : "Nuevo grupo"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input value={nombre} onChange={e => setNombre(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="Ej: Limpieza Profunda" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none"
                  placeholder="Descripción del servicio..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORES.map(c => (
                    <button key={c} onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full transition ${color === c ? "ring-2 ring-offset-2 ring-gray-800 scale-110" : ""}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
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
