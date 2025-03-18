import { sequelize } from '../database.js';
import { BitacoraEventos } from '../models/index.js';

sequelize.addHook('afterCreate', async (instance, options) => {
  if (instance.constructor.name === 'BitacoraEventos') return;

  const pkAttribute = instance.constructor.primaryKeyAttributes[0];

  const pkValue = instance.getDataValue(pkAttribute);

  await BitacoraEventos.create({
    Tabla_afectada: instance.constructor.name,
    Tipo_evento: 'INSERT',
    Descripcion: `Se creó un registro en ${instance.constructor.name} con id ${pkValue}`,
    idUsuario: options.userId || null,
  });
});

sequelize.addHook('afterUpdate', async (instance, options) => {
  if (instance.constructor.name === 'BitacoraEventos') return;

  const pkAttribute = instance.constructor.primaryKeyAttributes[0];
  const pkValue = instance.getDataValue(pkAttribute);

  if (instance.changed('Activo') && instance.getDataValue('Activo') === false) {
    await BitacoraEventos.create({
      Tabla_afectada: instance.constructor.name,
      Tipo_evento: 'DELETE',
      Descripcion: `Se elimino o desactivo el registro con id ${pkValue} en ${instance.constructor.name}`,
      idUsuario: options.userId || null,
    });
  } else {
    await BitacoraEventos.create({
      Tabla_afectada: instance.constructor.name,
      Tipo_evento: 'UPDATE',
      Descripcion: `Se modificó un registro con id ${pkValue} en ${instance.constructor.name}`,
      idUsuario: options.userId || null,
    });
  }
});
