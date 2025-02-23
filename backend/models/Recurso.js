import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Recurso extends Model {
    static associate(models) {
      Recurso.hasMany(models.Tarea, {
        foreignKey: 'Recurso_idRecurso',
      });
    }
  }

  Recurso.init(
    {
      idRecurso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      TipoRecurso: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Recurso',
      tableName: 'Recurso',
      timestamps: false,
    }
  );

  return Recurso;
};
