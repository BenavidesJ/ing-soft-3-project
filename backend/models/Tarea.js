import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Tarea extends Model {
    static associate(models) {
      Tarea.belongsToMany(models.Usuario, {
        through: models.UsuarioTarea,
        foreignKey: 'idTarea',
      });

      Tarea.belongsTo(models.Recurso, {
        foreignKey: 'Recurso_idRecurso',
      });
    }
  }

  Tarea.init(
    {
      idTarea: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Nombre: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      Descripcion: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      FechaInicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      FechaFin: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      Estado: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      Activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Tarea',
      tableName: 'Tarea',
      timestamps: false,
    }
  );

  return Tarea;
};
