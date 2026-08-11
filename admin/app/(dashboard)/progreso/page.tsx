"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Grupo, Usuario, ProgresoTarea } from "@/lib/types";
import { CheckCircle, Clock, User } from "lucide-react";

export default function ProgresoPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [progresos, setProgresos] = useState<ProgresoTarea[]>([]);
  const [grupoFiltro, setGrupoFiltro] = useState("todos");
  const [usuarioFiltro, setUsuarioFiltro] = useState("todos");

  useEffect(() => {
    const u1 = onSnapshot(collection(db, "grupos"), s => setGrupos(s.docs.map(d => ({ id: d.id, ...d.data() } as Grupo))));
    const u2 = onSnapshot(collection(db, "usuarios"), s =>
      setUsuarios(s.docs.map(d => ({ id: d.id, ...d.data() } as Usuario)).filter(u => u.rol !== "admin"))
    );
    const u3 = onSnapshot(collection(db, "progreso"), s => setProgresos(s.docs.map(d => d.data() as ProgresoTarea)));
    return () => { u1(); u2(); u3(); };
  }, []);

  const usuariosFiltrados = usuarios.filter(u =>
    (grupoFiltro === "todos" || u.grupoId === grupoFiltro) && u.activo
  );

  function getProgresoUsuario(uid: string) {
    const prog = progresos.filter(p => p.usuarioId === uid);
    const completadas = prog.filter(p => p.completado).length;
    return { total: prog.length, completadas, pct: prog.length > 0 ? Math.round((completadas / prog.length) * 100) : 0 };
  }

  function getUltimaActividad(uid: string) {
    const completadas = progresos.filter(p => p.usuarioId === uid && p.completado && p.completadoEn);
    if (!completadas.length) return null;
    const ultima = completadas.sort((a, b) =>
      new Date(b.completadoEn!).getTime() - new Date(a.completadoEn!).getTime()
    )[0];
    return ultima.completadoEn;
  }

  function getTareasCompletadasUsuario(uid: string, grupoId: string) {
    const grupo = grupos.find(g => g.id === grupoId);
    if (!grupo) return [];
    const prog = progresos.filter(p => p.usuarioId === uid && p.completado);
    return prog.map(p => {
      for (const amb of grupo.ambientes || []) {
        for (const sec of amb.secciones || []) {
          const tarea = (sec.tareas || []).find(t => t.id === p.tareaId);
          if (tarea) return { ambienteNombre: amb.nombre, seccionNombre: sec.nombre, tareaNombre: tarea.nombre, completadoEn: p.completadoEn };
        }
      }
      return null;
    }).filter(Boolean);
  }

  const [usuarioDetalle, setUsuarioDetalle] = useState<string | null>(null);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Progreso en tiempo real</h1>
        <p className="text-gray-500 text-sm mt-1">Monitorea el avance de cada usuario</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-6">
        <select value={grupoFiltro} onChange={e => { setGrupoFiltro(e.target.value); setUsuarioFiltro("todos"); }}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white">
          <option value="todos">Todos los grupos</option>
          {grupos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
        </select>
        <select value={usuarioFiltro} onChange={e => setUsuarioFiltro(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white">
          <option value="todos">Todos los usuarios</option>
          {usuariosFiltrados.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
        </select>
      </div>

      {/* Cards de usuarios */}
      <div className="grid gap-4 lg:grid-cols-2">
        {usuariosFiltrados
          .filter(u => usuarioFiltro === "todos" || u.id === usuarioFiltro)
          .map(u => {
            const { total, completadas, pct } = getProgresoUsuario(u.id);
            const ultimaAct = getUltimaActividad(u.id);
            const grupo = grupos.find(g => g.id === u.grupoId);
            const isOpen = usuarioDetalle === u.id;
            const tareasDetalle = getTareasCompletadasUsuario(u.id, u.grupoId);

            return (
              <div key={u.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: grupo?.color + "22" || "#e8eaf6" }}>
                      <User size={18} style={{ color: grupo?.color || "#1a237e" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900">{u.nombre}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {grupo && (
                          <span className="text-xs px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: grupo.color || "#1a237e" }}>
                            {grupo.nombre}
                          </span>
                        )}
                        {ultimaAct && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(ultimaAct).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold" style={{ color: grupo?.color || "#1a237e" }}>{pct}%</p>
                      <p className="text-xs text-gray-400">{completadas}/{total}</p>
                    </div>
                  </div>

                  {/* Barra */}
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                    <div className="h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: grupo?.color || "#1a237e" }} />
                  </div>

                  <button onClick={() => setUsuarioDetalle(isOpen ? null : u.id)}
                    className="text-xs text-blue-900 hover:text-blue-700 font-medium">
                    {isOpen ? "Ocultar detalle" : `Ver ${completadas} tarea${completadas !== 1 ? "s" : ""} completada${completadas !== 1 ? "s" : ""}`}
                  </button>
                </div>

                {/* Detalle tareas */}
                {isOpen && (
                  <div className="border-t border-gray-50 px-5 py-3 max-h-64 overflow-y-auto">
                    {tareasDetalle.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-3">Sin tareas completadas aún</p>
                    )}
                    <div className="space-y-2">
                      {tareasDetalle.map((t: any, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-800 font-medium truncate">{t.tareaNombre}</p>
                            <p className="text-gray-400 text-xs">{t.ambienteNombre} › {t.seccionNombre}</p>
                          </div>
                          {t.completadoEn && (
                            <span className="text-gray-400 text-xs flex-shrink-0">
                              {new Date(t.completadoEn).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        {usuariosFiltrados.length === 0 && (
          <div className="lg:col-span-2 bg-white rounded-2xl p-12 text-center border border-gray-100">
            <span className="text-5xl">📊</span>
            <p className="text-gray-500 mt-3">No hay usuarios en este grupo</p>
          </div>
        )}
      </div>
    </div>
  );
}
