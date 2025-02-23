import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Permiso extends Model {
    static associate(models) {
      Permiso.belongsToMany(models.Rol, {
        through: models.RolPermiso,
        foreignKey: 'idPermiso',
      });
    }
  }

  Permiso.init(
    {
      idPermiso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      NombrePermiso: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Permiso',
      tableName: 'Permiso',
      timestamps: false,
    }
  );

  return Permiso;
};
