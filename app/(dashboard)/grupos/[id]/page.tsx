"use client";
import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Grupo, Ambiente, Seccion, Tarea } from "@/lib/types";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ChevronLeft, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";

function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2,8)}`; }

export default function GrupoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [expandido, setExpandido] = useState<string[]>([]);

  // Modals
  const [modalAmbiente, setModalAmbiente] = useState(false);
  const [modalSeccion, setModalSeccion] = useState<{ ambienteId: string } | null>(null);
  const [modalTarea, setModalTarea] = useState<{ ambienteId: string; seccionId: string } | null>(null);
  const [nombreInput, setNombreInput] = useState("");
  const [iconoInput, setIconoInput] = useState("home");

  useEffect(() => {
    return onSnapshot(doc(db, "grupos", id), s => {
      if (s.exists()) setGrupo({ id: s.id, ...s.data() } as Grupo);
    });
  }, [id]);

  async function save(ambientes: Ambiente[]) {
    await updateDoc(doc(db, "grupos", id), { ambientes });
  }

  async function agregarAmbiente() {
    if (!nombreInput.trim() || !grupo) return;
    const nuevo: Ambiente = { id: uid(), nombre: nombreInput.trim(), icono: iconoInput, color: "#1a237e", secciones: [] };
    await save([...(grupo.ambientes || []), nuevo]);
    toast.success("Ambiente agregado"); setModalAmbiente(false); setNombreInput("");
  }

  async function eliminarAmbiente(ambId: string) {
    if (!grupo || !confirm("¿Eliminar este ambiente y todas sus tareas?")) return;
    await save(grupo.ambientes.filter(a => a.id !== ambId));
    toast.success("Ambiente eliminado");
  }

  async function agregarSeccion() {
    if (!nombreInput.trim() || !grupo || !modalSeccion) return;
    const nuevaSeccion: Seccion = { id: uid(), nombre: nombreInput.trim(), tareas: [] };
    const ambientes = grupo.ambientes.map(a =>
      a.id === modalSeccion.ambienteId ? { ...a, secciones: [...(a.secciones || []), nuevaSeccion] } : a
    );
    await save(ambientes);
    toast.success("Sección agregada"); setModalSeccion(null); setNombreInput("");
  }

  async function eliminarSeccion(ambId: string, secId: string) {
    if (!grupo || !confirm("¿Eliminar esta sección?")) return;
    const ambientes = grupo.ambientes.map(a =>
      a.id === ambId ? { ...a, secciones: a.secciones.filter(s => s.id !== secId) } : a
    );
    await save(ambientes);
  }

  async function agregarTarea() {
    if (!nombreInput.trim() || !grupo || !modalTarea) return;
    const nuevaTarea: Tarea = { id: uid(), nombre: nombreInput.trim() };
    const ambientes = grupo.ambientes.map(a =>
      a.id === modalTarea.ambienteId
        ? { ...a, secciones: a.secciones.map(s =>
            s.id === modalTarea.seccionId ? { ...s, tareas: [...(s.tareas || []), nuevaTarea] } : s
          )}
        : a
    );
    await save(ambientes);
    toast.success("Tarea agregada"); setModalTarea(null); setNombreInput("");
  }

  async function eliminarTarea(ambId: string, secId: string, tareaId: string) {
    if (!grupo) return;
    const ambientes = grupo.ambientes.map(a =>
      a.id === ambId
        ? { ...a, secciones: a.secciones.map(s =>
            s.id === secId ? { ...s, tareas: s.tareas.filter(t => t.id !== tareaId) } : s
          )}
        : a
    );
    await save(ambientes);
  }

  function toggleExpand(id: string) {
    setExpandido(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  if (!grupo) return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="w-6 h-6 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/grupos" className="text-gray-400 hover:text-gray-600 transition">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{grupo.nombre}</h1>
          <p className="text-gray-500 text-sm">Ambientes y tareas de este grupo</p>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={() => { setNombreInput(""); setModalAmbiente(true); }}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition">
          <Plus size={16} /> Nuevo ambiente
        </button>
      </div>

      {(!grupo.ambientes || grupo.ambientes.length === 0) && (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <span className="text-5xl">🏠</span>
          <p className="text-gray-500 mt-3">Sin ambientes. Agrega el primero.</p>
        </div>
      )}

      <div className="space-y-3">
        {(grupo.ambientes || []).map(amb => {
          const isOpen = expandido.includes(amb.id);
          const totalTareas = (amb.secciones || []).flatMap(s => s.tareas || []).length;
          return (
            <div key={amb.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header ambiente */}
              <div className="flex items-center px-5 py-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleExpand(amb.id)}>
                <div className="w-3 h-3 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: amb.color || "#1a237e" }} />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{amb.nombre}</p>
                  <p className="text-xs text-gray-400">
                    {(amb.secciones || []).length} secciones · {totalTareas} tareas
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={e => { e.stopPropagation(); setNombreInput(""); setModalSeccion({ ambienteId: amb.id }); }}
                    className="text-blue-900 hover:bg-blue-50 p-1.5 rounded-lg text-xs flex items-center gap-1 font-medium">
                    <Plus size={13} /> Sección
                  </button>
                  <button onClick={e => { e.stopPropagation(); eliminarAmbiente(amb.id); }}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition">
                    <Trash2 size={14} />
                  </button>
                  {isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                </div>
              </div>

              {/* Secciones */}
              {isOpen && (
                <div className="border-t border-gray-100 px-5 py-3 space-y-3">
                  {(amb.secciones || []).length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-2">Sin secciones</p>
                  )}
                  {(amb.secciones || []).map(sec => (
                    <div key={sec.id} className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-700">{sec.nombre}</p>
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setNombreInput(""); setModalTarea({ ambienteId: amb.id, seccionId: sec.id }); }}
                            className="text-blue-900 hover:bg-blue-100 p-1 rounded-lg text-xs flex items-center gap-1 font-medium">
                            <Plus size={12} /> Tarea
                          </button>
                          <button onClick={() => eliminarSeccion(amb.id, sec.id)}
                            className="text-red-400 hover:text-red-600 p-1 rounded-lg">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {(sec.tareas || []).map(t => (
                          <div key={t.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                            <span className="text-sm text-gray-700">• {t.nombre}</span>
                            <button onClick={() => eliminarTarea(amb.id, sec.id, t.id)}
                              className="text-gray-300 hover:text-red-500 transition">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                        {(sec.tareas || []).length === 0 && (
                          <p className="text-xs text-gray-400 text-center py-1">Sin tareas</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modales */}
      {[
        { show: modalAmbiente, title: "Nuevo ambiente", onClose: () => setModalAmbiente(false), onSave: agregarAmbiente, placeholder: "Ej: Sala, Cocina..." },
        { show: !!modalSeccion, title: "Nueva sección", onClose: () => setModalSeccion(null), onSave: agregarSeccion, placeholder: "Ej: Sofá, Mesa de centro..." },
        { show: !!modalTarea, title: "Nueva tarea", onClose: () => setModalTarea(null), onSave: agregarTarea, placeholder: "Ej: Limpiar superficie con limpiador..." },
      ].map(({ show, title, onClose, onSave, placeholder }) =>
        show ? (
          <div key={title} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
              <input autoFocus value={nombreInput} onChange={e => setNombreInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && onSave()}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 mb-4"
                placeholder={placeholder} />
              <div className="flex gap-3">
                <button onClick={onClose}
                  className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition">
                  Cancelar
                </button>
                <button onClick={onSave}
                  className="flex-1 bg-blue-900 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-blue-800 transition">
                  Agregar
                </button>
              </div>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
