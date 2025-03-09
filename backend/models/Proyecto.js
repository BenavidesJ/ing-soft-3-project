import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';
import { isValidDateFormat } from '../common/isValidDateFormat.js';

export const Proyecto = sequelize.define(
  'Proyecto',
  {
    idProyecto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Nombre: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    Descripcion: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Objetivo: {
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
    Presupuesto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
    tableName: 'Proyecto',
    freezeTableName: true,
    timestamps: false,
  }
);
