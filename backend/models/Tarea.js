import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const Tarea = sequelize.define(
  'Tarea',
  {
    idTarea: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Descripcion: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    FechaInicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    FechaFin: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    idEstado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Estado',
        key: 'idEstado',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'Tarea',
    freezeTableName: true,
    timestamps: false,
  }
);
