export interface UserProfile {
  id: string;
  nombre: string;
  email: string;
  grupoId: string;
  rol: "admin" | "usuario";
  activo: boolean;
}

export interface Tarea {
  id: string;
  nombre: string;
}

export interface Seccion {
  id: string;
  nombre: string;
  tareas: Tarea[];
}

export interface Ambiente {
  id: string;
  nombre: string;
  icono: string;
  color: string;
  secciones: Seccion[];
}

export interface Grupo {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  ambientes: Ambiente[];
}

export interface ProgresoTarea {
  tareaId: string;
  seccionId: string;
  ambienteId: string;
  grupoId: string;
  usuarioId: string;
  usuarioNombre: string;
  completado: boolean;
  completadoEn?: string | null;
}
