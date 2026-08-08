import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AppData, Ambiente, Almacen, TareaLimpieza, ItemInventario, SeccionLimpieza, SeccionInventario } from '../types';
import { loadData, saveData } from '../storage/storage';
import { INITIAL_DATA } from '../data/initialData';

interface AppContextType {
  data: AppData;
  loading: boolean;
  // Ambientes
  addAmbiente: (nombre: string, icono: string, color: string) => void;
  updateAmbiente: (ambienteId: string, changes: Partial<Pick<Ambiente, 'nombre' | 'icono' | 'color'>>) => void;
  deleteAmbiente: (ambienteId: string) => void;
  // Secciones de limpieza
  addSeccionLimpieza: (ambienteId: string, nombre: string) => void;
  deleteSeccionLimpieza: (ambienteId: string, seccionId: string) => void;
  // Tareas de limpieza
  toggleTarea: (ambienteId: string, seccionId: string, tareaId: string) => void;
  addTarea: (ambienteId: string, seccionId: string, nombre: string) => void;
  deleteTarea: (ambienteId: string, seccionId: string, tareaId: string) => void;
  resetTareas: (ambienteId: string) => void;
  // Inventario ambiente
  addSeccionInventario: (ambienteId: string, nombre: string) => void;
  deleteSeccionInventario: (ambienteId: string, seccionId: string) => void;
  addItemInventario: (ambienteId: string, seccionId: string, item: Omit<ItemInventario, 'id'>) => void;
  updateItemInventario: (ambienteId: string, seccionId: string, itemId: string, changes: Partial<ItemInventario>) => void;
  deleteItemInventario: (ambienteId: string, seccionId: string, itemId: string) => void;
  // Almacén
  addSeccionAlmacen: (nombre: string) => void;
  deleteSeccionAlmacen: (seccionId: string) => void;
  addItemAlmacen: (seccionId: string, item: Omit<ItemInventario, 'id'>) => void;
  updateItemAlmacen: (seccionId: string, itemId: string, changes: Partial<ItemInventario>) => void;
  deleteItemAlmacen: (seccionId: string, itemId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(INITIAL_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const persist = useCallback((newData: AppData) => {
    setData(newData);
    saveData(newData);
  }, []);

  // ── Ambientes ────────────────────────────────────────────────────────────
  const addAmbiente = useCallback((nombre: string, icono: string, color: string) => {
    const nuevo: Ambiente = {
      id: uid(),
      nombre,
      icono,
      color,
      seccionesLimpieza: [],
      seccionesInventario: [],
    };
    persist({ ...data, ambientes: [...data.ambientes, nuevo] });
  }, [data, persist]);

  const updateAmbiente = useCallback((ambienteId: string, changes: Partial<Pick<Ambiente, 'nombre' | 'icono' | 'color'>>) => {
    persist({
      ...data,
      ambientes: data.ambientes.map((a) => a.id === ambienteId ? { ...a, ...changes } : a),
    });
  }, [data, persist]);

  const deleteAmbiente = useCallback((ambienteId: string) => {
    persist({ ...data, ambientes: data.ambientes.filter((a) => a.id !== ambienteId) });
  }, [data, persist]);

  // ── Secciones de Limpieza ────────────────────────────────────────────────
  const addSeccionLimpieza = useCallback((ambienteId: string, nombre: string) => {
    const nueva: SeccionLimpieza = { id: uid(), nombre, tareas: [] };
    persist({
      ...data,
      ambientes: data.ambientes.map((a) =>
        a.id === ambienteId ? { ...a, seccionesLimpieza: [...a.seccionesLimpieza, nueva] } : a
      ),
    });
  }, [data, persist]);

  const deleteSeccionLimpieza = useCallback((ambienteId: string, seccionId: string) => {
    persist({
      ...data,
      ambientes: data.ambientes.map((a) =>
        a.id === ambienteId
          ? { ...a, seccionesLimpieza: a.seccionesLimpieza.filter((s) => s.id !== seccionId) }
          : a
      ),
    });
  }, [data, persist]);

  // ── Tareas ───────────────────────────────────────────────────────────────
  const toggleTarea = useCallback((ambienteId: string, seccionId: string, tareaId: string) => {
    persist({
      ...data,
      ambientes: data.ambientes.map((a) => {
        if (a.id !== ambienteId) return a;
        return {
          ...a,
          seccionesLimpieza: a.seccionesLimpieza.map((s) => {
            if (s.id !== seccionId) return s;
            return {
              ...s,
              tareas: s.tareas.map((t) => {
                if (t.id !== tareaId) return t;
                const completado = t.estado !== 'completado';
                return { ...t, estado: completado ? 'completado' : 'pendiente', completadoEn: completado ? new Date().toISOString() : undefined };
              }),
            };
          }),
        };
      }),
    });
  }, [data, persist]);

  const addTarea = useCallback((ambienteId: string, seccionId: string, nombre: string) => {
    const nueva: TareaLimpieza = { id: uid(), nombre, estado: 'pendiente' };
    persist({
      ...data,
      ambientes: data.ambientes.map((a) => {
        if (a.id !== ambienteId) return a;
        return {
          ...a,
          seccionesLimpieza: a.seccionesLimpieza.map((s) =>
            s.id === seccionId ? { ...s, tareas: [...s.tareas, nueva] } : s
          ),
        };
      }),
    });
  }, [data, persist]);

  const deleteTarea = useCallback((ambienteId: string, seccionId: string, tareaId: string) => {
    persist({
      ...data,
      ambientes: data.ambientes.map((a) => {
        if (a.id !== ambienteId) return a;
        return {
          ...a,
          seccionesLimpieza: a.seccionesLimpieza.map((s) =>
            s.id === seccionId ? { ...s, tareas: s.tareas.filter((t) => t.id !== tareaId) } : s
          ),
        };
      }),
    });
  }, [data, persist]);

  const resetTareas = useCallback((ambienteId: string) => {
    persist({
      ...data,
      ambientes: data.ambientes.map((a) => {
        if (a.id !== ambienteId) return a;
        return {
          ...a,
          seccionesLimpieza: a.seccionesLimpieza.map((s) => ({
            ...s,
            tareas: s.tareas.map((t) => ({ ...t, estado: 'pendiente' as const, completadoEn: undefined })),
          })),
        };
      }),
    });
  }, [data, persist]);

  // ── Inventario de ambiente ───────────────────────────────────────────────
  const addSeccionInventario = useCallback((ambienteId: string, nombre: string) => {
    const nueva: SeccionInventario = { id: uid(), nombre, items: [] };
    persist({
      ...data,
      ambientes: data.ambientes.map((a) =>
        a.id === ambienteId ? { ...a, seccionesInventario: [...a.seccionesInventario, nueva] } : a
      ),
    });
  }, [data, persist]);

  const deleteSeccionInventario = useCallback((ambienteId: string, seccionId: string) => {
    persist({
      ...data,
      ambientes: data.ambientes.map((a) =>
        a.id === ambienteId
          ? { ...a, seccionesInventario: a.seccionesInventario.filter((s) => s.id !== seccionId) }
          : a
      ),
    });
  }, [data, persist]);

  const addItemInventario = useCallback((ambienteId: string, seccionId: string, item: Omit<ItemInventario, 'id'>) => {
    persist({
      ...data,
      ambientes: data.ambientes.map((a) => {
        if (a.id !== ambienteId) return a;
        return {
          ...a,
          seccionesInventario: a.seccionesInventario.map((s) =>
            s.id === seccionId ? { ...s, items: [...s.items, { ...item, id: uid() }] } : s
          ),
        };
      }),
    });
  }, [data, persist]);

  const updateItemInventario = useCallback((ambienteId: string, seccionId: string, itemId: string, changes: Partial<ItemInventario>) => {
    persist({
      ...data,
      ambientes: data.ambientes.map((a) => {
        if (a.id !== ambienteId) return a;
        return {
          ...a,
          seccionesInventario: a.seccionesInventario.map((s) =>
            s.id === seccionId
              ? { ...s, items: s.items.map((i) => (i.id === itemId ? { ...i, ...changes } : i)) }
              : s
          ),
        };
      }),
    });
  }, [data, persist]);

  const deleteItemInventario = useCallback((ambienteId: string, seccionId: string, itemId: string) => {
    persist({
      ...data,
      ambientes: data.ambientes.map((a) => {
        if (a.id !== ambienteId) return a;
        return {
          ...a,
          seccionesInventario: a.seccionesInventario.map((s) =>
            s.id === seccionId ? { ...s, items: s.items.filter((i) => i.id !== itemId) } : s
          ),
        };
      }),
    });
  }, [data, persist]);

  // ── Almacén ──────────────────────────────────────────────────────────────
  const addSeccionAlmacen = useCallback((nombre: string) => {
    const nueva: SeccionInventario = { id: uid(), nombre, items: [] };
    persist({ ...data, almacen: { secciones: [...data.almacen.secciones, nueva] } });
  }, [data, persist]);

  const deleteSeccionAlmacen = useCallback((seccionId: string) => {
    persist({ ...data, almacen: { secciones: data.almacen.secciones.filter((s) => s.id !== seccionId) } });
  }, [data, persist]);

  const addItemAlmacen = useCallback((seccionId: string, item: Omit<ItemInventario, 'id'>) => {
    persist({
      ...data,
      almacen: {
        secciones: data.almacen.secciones.map((s) =>
          s.id === seccionId ? { ...s, items: [...s.items, { ...item, id: uid() }] } : s
        ),
      },
    });
  }, [data, persist]);

  const updateItemAlmacen = useCallback((seccionId: string, itemId: string, changes: Partial<ItemInventario>) => {
    persist({
      ...data,
      almacen: {
        secciones: data.almacen.secciones.map((s) =>
          s.id === seccionId
            ? { ...s, items: s.items.map((i) => (i.id === itemId ? { ...i, ...changes } : i)) }
            : s
        ),
      },
    });
  }, [data, persist]);

  const deleteItemAlmacen = useCallback((seccionId: string, itemId: string) => {
    persist({
      ...data,
      almacen: {
        secciones: data.almacen.secciones.map((s) =>
          s.id === seccionId ? { ...s, items: s.items.filter((i) => i.id !== itemId) } : s
        ),
      },
    });
  }, [data, persist]);

  return (
    <AppContext.Provider value={{
      data, loading,
      addAmbiente, updateAmbiente, deleteAmbiente,
      addSeccionLimpieza, deleteSeccionLimpieza,
      toggleTarea, addTarea, deleteTarea, resetTareas,
      addSeccionInventario, deleteSeccionInventario,
      addItemInventario, updateItemInventario, deleteItemInventario,
      addSeccionAlmacen, deleteSeccionAlmacen,
      addItemAlmacen, updateItemAlmacen, deleteItemAlmacen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
  return ctx;
}
