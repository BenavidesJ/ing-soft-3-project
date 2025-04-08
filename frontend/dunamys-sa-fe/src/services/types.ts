// Tipo genérico para las respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Autenticación y usuario
export interface PerfilUsuario {
  idPerfilUsuario: number;
  NombreUsuario: string;
  urlImagenPerfil?: string;
}

export interface Usuario {
  idUsuario: number;
  Nombre: string;
  NombrePila?: string;
  Apellido1: string;
  Apellido2?: string;
  Correo: string;
  Activo: boolean;
  Fecha_creacion?: string;
  Fecha_modificacion?: string;
  Perfil?: PerfilUsuario;
  Access_token?: string;
  Roles?: Rol[];
}

// Estado
export interface Estado {
  idEstado: number;
  NombreEstado: string;
}

// Proyecto
export interface Proyecto {
  idProyecto: number;
  Nombre: string;
  Descripcion: string;
  Objetivo: string;
  FechaInicio: string;
  FechaFin?: string;
  Presupuesto: number;
  Activo: boolean;
  idEstado: number;
  Estado?: Estado;
  Costos?: Costo[];
  Tareas?: Tarea[];
}

// Costo
export interface Costo {
  idCosto: number;
  CostoTotal: number;
  idProyecto: number;
}

// Recurso
export interface Recurso {
  idRecurso: number;
  Nombre: string;
}

export interface ProyectoSummary {
  idProyecto: number;
}

// Tarea
export interface Tarea {
  idTarea: number;
  Nombre: string;
  Descripcion: string;
  FechaInicio: string;
  FechaFin?: string;
  Activo: boolean;
  idEstado: number;
  Estado?: Estado;
  Recursos?: Recurso[];
  Usuarios?: Usuario[];
  Proyectos?: ProyectoSummary[];
  Usuario_Tarea?: { Tarea_idTarea: number; Usuario_idUsuario: number };
}

// Rol
export interface Rol {
  idRol: number;
  NombreRol: string;
  Permisos?: Permiso[];
}

// Permiso
export interface Permiso {
  idPermiso: number;
  NombrePermiso: string;
}
