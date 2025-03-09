import { Usuario } from './Usuario.js';
import { BitacoraEventos } from './BitacoraEventos.js';
import { Estado } from './Estado.js';
import { Proyecto } from './Proyecto.js';
import { Costo } from './Costo.js';
import { PerfilUsuario } from './PerfilUsuario.js';
import { Permiso } from './Permiso.js';
import { Tarea } from './Tarea.js';
import { Recurso } from './Recurso.js';
import { Rol } from './Rol.js';

// =========== 1:N / 1:1 ===========

// Usuario -> BitacoraEventos (1:N)
Usuario.hasMany(BitacoraEventos, { foreignKey: 'idUsuario' });
BitacoraEventos.belongsTo(Usuario, { foreignKey: 'idUsuario' });

// Estado -> Tarea (1:N)
Estado.hasMany(Tarea, { foreignKey: 'idEstado' });
Tarea.belongsTo(Estado, { foreignKey: 'idEstado' });

// Estado -> Proyecto (1:N)
Estado.hasMany(Proyecto, { foreignKey: 'idEstado' });
Proyecto.belongsTo(Estado, { foreignKey: 'idEstado' });

// Proyecto -> Costo (1:N)
Proyecto.hasMany(Costo, { foreignKey: 'idProyecto' });
Costo.belongsTo(Proyecto, { foreignKey: 'idProyecto' });

// Usuario -> PerfilUsuario (1:1) [o 1:N, según convenga]
Usuario.hasOne(PerfilUsuario, { foreignKey: 'idUsuario' });
PerfilUsuario.belongsTo(Usuario, { foreignKey: 'idUsuario' });

// =========== N:M (tablas intermedias) ===========

// Proyecto <-> Tarea
Proyecto.belongsToMany(Tarea, {
  through: 'Proyecto_Tarea',
  foreignKey: 'Proyecto_idProyecto',
  otherKey: 'Tarea_idTarea',
  timestamps: false,
});
Tarea.belongsToMany(Proyecto, {
  through: 'Proyecto_Tarea',
  foreignKey: 'Tarea_idTarea',
  otherKey: 'Proyecto_idProyecto',
  timestamps: false,
});

// Rol <-> Permiso
Rol.belongsToMany(Permiso, {
  through: 'Rol_Permiso',
  foreignKey: 'Roles_idRol',
  otherKey: 'Permisos_idPermiso',
  timestamps: false,
});
Permiso.belongsToMany(Rol, {
  through: 'Rol_Permiso',
  foreignKey: 'Permisos_idPermiso',
  otherKey: 'Roles_idRol',
  timestamps: false,
});

// Tarea <-> Recurso
Tarea.belongsToMany(Recurso, {
  through: 'Tarea_Recurso',
  foreignKey: 'Tarea_idTarea',
  otherKey: 'Recurso_idRecurso',
  timestamps: false,
});
Recurso.belongsToMany(Tarea, {
  through: 'Tarea_Recurso',
  foreignKey: 'Recurso_idRecurso',
  otherKey: 'Tarea_idTarea',
  timestamps: false,
});

// Usuario <-> Rol
Usuario.belongsToMany(Rol, {
  through: 'Usuario_Rol',
  foreignKey: 'Usuario_idUsuario',
  otherKey: 'Rol_idRol',
  timestamps: false,
});
Rol.belongsToMany(Usuario, {
  through: 'Usuario_Rol',
  foreignKey: 'Rol_idRol',
  otherKey: 'Usuario_idUsuario',
  timestamps: false,
});

// Usuario <-> Tarea
Usuario.belongsToMany(Tarea, {
  through: 'Usuario_Tarea',
  foreignKey: 'Usuario_idUsuario',
  otherKey: 'Tarea_idTarea',
  timestamps: false,
});
Tarea.belongsToMany(Usuario, {
  through: 'Usuario_Tarea',
  foreignKey: 'Tarea_idTarea',
  otherKey: 'Usuario_idUsuario',
  timestamps: false,
});

export {
  Usuario,
  BitacoraEventos,
  Estado,
  Proyecto,
  Costo,
  PerfilUsuario,
  Permiso,
  Tarea,
  Recurso,
  Rol,
};
