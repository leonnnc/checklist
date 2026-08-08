// ─────────────────────────────────────────────
//  TIPOS GLOBALES - Depa 804
// ─────────────────────────────────────────────

export type ItemEstado = 'pendiente' | 'en_progreso' | 'completado';

// Un ítem individual de limpieza dentro de una sección
export interface TareaLimpieza {
  id: string;
  nombre: string;
  descripcion?: string;
  estado: ItemEstado;
  completadoEn?: string; // ISO date
}

// Una sección de limpieza dentro de un ambiente (ej: "Sofá", "Mesa de centro")
export interface SeccionLimpieza {
  id: string;
  nombre: string;
  tareas: TareaLimpieza[];
}

// Un ítem de inventario
export interface ItemInventario {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: string;         // piezas, kg, litros, etc.
  minimo?: number;        // cantidad mínima deseada
  notas?: string;
  categoria?: string;
}

// Una sección de inventario (ej: "Electrodomésticos", "Despensa")
export interface SeccionInventario {
  id: string;
  nombre: string;
  items: ItemInventario[];
}

// Un ambiente del departamento (ej: Sala, Cocina, Habitación)
export interface Ambiente {
  id: string;
  nombre: string;
  icono: string;          // nombre del icono de @expo/vector-icons (Ionicons)
  color: string;          // color hex
  seccionesLimpieza: SeccionLimpieza[];
  seccionesInventario: SeccionInventario[];
}

// El almacén general
export interface Almacen {
  secciones: SeccionInventario[];
}

// Estado global de la app
export interface AppData {
  ambientes: Ambiente[];
  almacen: Almacen;
  ultimaActualizacion: string;
}
