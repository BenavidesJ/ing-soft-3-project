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
Estado.hasMany(Tarea, { foreignKey: 'Estado_idEstado' });
Tarea.belongsTo(Estado, { foreignKey: 'Estado_idEstado' });

// Estado -> Proyecto (1:N)
Estado.hasMany(Proyecto, { foreignKey: 'Estado_idEstado' });
Proyecto.belongsTo(Estado, { foreignKey: 'Estado_idEstado' });

// Proyecto -> Costo (1:N)
Proyecto.hasMany(Costo, { foreignKey: 'Proyecto_idProyecto' });
Costo.belongsTo(Proyecto, { foreignKey: 'Proyecto_idProyecto' });

// Usuario -> PerfilUsuario (1:1) [o 1:N, según convenga]
Usuario.hasOne(PerfilUsuario, { foreignKey: 'idUsuario' });
PerfilUsuario.belongsTo(Usuario, { foreignKey: 'idUsuario' });

// =========== N:M (tablas intermedias) ===========

// Proyecto <-> Tarea
Proyecto.belongsToMany(Tarea, {
  through: 'Proyecto_Tarea',
  foreignKey: 'Proyecto_idProyecto',
  otherKey: 'Tarea_idTarea',
});
Tarea.belongsToMany(Proyecto, {
  through: 'Proyecto_Tarea',
  foreignKey: 'Tarea_idTarea',
  otherKey: 'Proyecto_idProyecto',
});

// Rol <-> Permiso
Rol.belongsToMany(Permiso, {
  through: 'Rol_Permiso',
  foreignKey: 'Roles_idRol',
  otherKey: 'Permisos_idPermiso',
});
Permiso.belongsToMany(Rol, {
  through: 'Rol_Permiso',
  foreignKey: 'Permisos_idPermiso',
  otherKey: 'Roles_idRol',
});

// Tarea <-> Recurso
Tarea.belongsToMany(Recurso, {
  through: 'Tarea_Recurso',
  foreignKey: 'Tarea_idTarea',
  otherKey: 'Recurso_idRecurso',
});
Recurso.belongsToMany(Tarea, {
  through: 'Tarea_Recurso',
  foreignKey: 'Recurso_idRecurso',
  otherKey: 'Tarea_idTarea',
});

// Usuario <-> Rol
Usuario.belongsToMany(Rol, {
  through: 'Usuario_Rol',
  foreignKey: 'Usuario_idUsuario',
  otherKey: 'Rol_idRol',
});
Rol.belongsToMany(Usuario, {
  through: 'Usuario_Rol',
  foreignKey: 'Rol_idRol',
  otherKey: 'Usuario_idUsuario',
});

// Usuario <-> Tarea
Usuario.belongsToMany(Tarea, {
  through: 'Usuario_Tarea',
  foreignKey: 'Usuario_idUsuario',
  otherKey: 'Tarea_idTarea',
});
Tarea.belongsToMany(Usuario, {
  through: 'Usuario_Tarea',
  foreignKey: 'Tarea_idTarea',
  otherKey: 'Usuario_idUsuario',
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
