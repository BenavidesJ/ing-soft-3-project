import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Proyecto extends Model {
    static associate(models) {
      Proyecto.hasMany(models.Costo, {
        foreignKey: 'Proyecto_idProyecto',
      });

      Proyecto.hasMany(models.Tarea, {
        foreignKey: 'Proyecto_idProyecto',
      });
    }
  }

  Proyecto.init(
    {
      idProyecto: {
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
      Objetivo: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      Presupuesto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      Estado: {
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
      Activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Proyecto',
      tableName: 'Proyecto',
      timestamps: false,
    }
  );

  return Proyecto;
};
