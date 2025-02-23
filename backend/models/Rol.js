import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Rol extends Model {
    static associate(models) {
      Rol.belongsToMany(models.Usuario, {
        through: models.UsuarioRol,
        foreignKey: 'idRol',
      });
      Rol.belongsToMany(models.Permiso, {
        through: models.RolPermiso,
        foreignKey: 'idRol',
      });
    }
  }

  Rol.init(
    {
      idRol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      NombreRol: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Rol',
      tableName: 'Rol',
      timestamps: false,
    }
  );

  return Rol;
};
