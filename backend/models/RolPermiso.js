import { Model } from 'sequelize';

export default (sequelize) => {
  class RolPermiso extends Model {
    static associate(models) {}
  }

  RolPermiso.init(
    {},
    {
      sequelize,
      modelName: 'RolPermiso',
      tableName: 'Rol_Permiso',
      timestamps: false,
    }
  );

  return RolPermiso;
};
