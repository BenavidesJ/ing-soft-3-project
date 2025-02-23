import { Model } from 'sequelize';

export default (sequelize) => {
  class UsuarioTarea extends Model {
    static associate(models) {}
  }

  UsuarioTarea.init(
    {},
    {
      sequelize,
      modelName: 'UsuarioTarea',
      tableName: 'Usuario_Tarea',
      timestamps: false,
    }
  );

  return UsuarioTarea;
};
