export interface Grupo {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  creadoEn: string;
  ambientes: Ambiente[];
}

export interface Ambiente {
  id: string;
  nombre: string;
  icono: string;
  color: string;
  secciones: Seccion[];
}

export interface Seccion {
  id: string;
  nombre: string;
  tareas: Tarea[];
}

export interface Tarea {
  id: string;
  nombre: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  grupoId: string;
  grupoNombre?: string;
  rol: "admin" | "usuario";
  activo: boolean;
  creadoEn: string;
}

export interface ProgresoTarea {
  tareaId: string;
  seccionId: string;
  ambienteId: string;
  grupoId: string;
  usuarioId: string;
  usuarioNombre: string;
  completado: boolean;
  completadoEn?: string;
}

export interface ResumenUsuario {
  usuario: Usuario;
  totalTareas: number;
  completadas: number;
  porcentaje: number;
  ultimaActividad?: string;
}
