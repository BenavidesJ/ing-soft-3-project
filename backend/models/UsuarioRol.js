import { Model } from 'sequelize';

export default (sequelize) => {
  class UsuarioRol extends Model {}

  UsuarioRol.init(
    {},
    {
      sequelize,
      modelName: 'UsuarioRol',
      tableName: 'Usuario_Rol',
      timestamps: false,
    }
  );

  return UsuarioRol;
};
