import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Tarea extends Model {
    static associate(models) {
      Tarea.belongsToMany(models.Usuario, {
        through: models.UsuarioTarea,
        foreignKey: 'idTarea',
      });

      Tarea.belongsTo(models.Proyecto, {
        foreignKey: 'Proyecto_idProyecto',
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
        type: DataTypes.STRING,
        allowNull: false,
      },
      Descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      FechaInicio: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      FechaFin: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      Estado: {
        type: DataTypes.STRING,
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
