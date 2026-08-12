"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Grupo, Usuario, ProgresoTarea } from "@/lib/types";
import { Users, Layers, CheckSquare, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [progresos, setProgresos] = useState<ProgresoTarea[]>([]);

  useEffect(() => {
    const u1 = onSnapshot(collection(db, "grupos"), s => setGrupos(s.docs.map(d => ({ id: d.id, ...d.data() } as Grupo))));
    const u2 = onSnapshot(query(collection(db, "usuarios")), s =>
      setUsuarios(s.docs.map(d => ({ id: d.id, ...d.data() } as Usuario)).filter(u => u.rol !== "admin"))
    );
    const u3 = onSnapshot(collection(db, "progreso"), s => setProgresos(s.docs.map(d => d.data() as ProgresoTarea)));
    return () => { u1(); u2(); u3(); };
  }, []);

  const totalTareas = progresos.length;
  const completadas = progresos.filter(p => p.completado).length;
  const pct = totalTareas > 0 ? Math.round((completadas / totalTareas) * 100) : 0;

  const stats = [
    { label: "Grupos", value: grupos.length, icon: Layers, color: "bg-indigo-100 text-indigo-700" },
    { label: "Usuarios activos", value: usuarios.filter(u => u.activo).length, icon: Users, color: "bg-blue-100 text-blue-700" },
    { label: "Tareas completadas", value: completadas, icon: CheckSquare, color: "bg-green-100 text-green-700" },
    { label: "Progreso global", value: `${pct}%`, icon: TrendingUp, color: "bg-orange-100 text-orange-700" },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen en tiempo real del Depa 804</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`inline-flex p-2 rounded-xl ${color} mb-3`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Barra global */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between mb-2">
          <span className="font-semibold text-gray-700">Progreso global de limpieza</span>
          <span className="font-bold text-blue-900">{pct}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-3 bg-blue-900 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">{completadas} de {totalTareas} tareas completadas</p>
      </div>

      {/* Progreso por grupo */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-800 mb-5">Progreso por grupo</h2>
        {grupos.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">No hay grupos creados aún</p>
        )}
        <div className="space-y-4">
          {grupos.map(g => {
            const usuariosGrupo = usuarios.filter(u => u.grupoId === g.id);
            const progGrupo = progresos.filter(p => p.grupoId === g.id);
            const compGrupo = progGrupo.filter(p => p.completado).length;
            const totalGrupo = progGrupo.length;
            const pctGrupo = totalGrupo > 0 ? Math.round((compGrupo / totalGrupo) * 100) : 0;

            return (
              <div key={g.id} className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color || "#1a237e" }} />
                    <span className="font-semibold text-gray-800">{g.nombre}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {usuariosGrupo.length} usuario{usuariosGrupo.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <span className="font-bold text-blue-900 text-sm">{pctGrupo}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${pctGrupo}%`, backgroundColor: g.color || "#1a237e" }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{compGrupo} / {totalGrupo} tareas</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
