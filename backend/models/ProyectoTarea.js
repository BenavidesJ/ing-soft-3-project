import { Model } from 'sequelize';

export default (sequelize) => {
  class ProyectoTarea extends Model {
    static associate(models) {}
  }

  ProyectoTarea.init(
    {},
    {
      sequelize,
      modelName: 'ProyectoTarea',
      tableName: 'Proyecto_Tarea',
      timestamps: false,
    }
  );

  return ProyectoTarea;
};
