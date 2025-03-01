import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const Recurso = sequelize.define(
  'Recurso',
  {
    idRecurso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Nombre: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  },
  {
    tableName: 'Recurso',
    freezeTableName: true,
    timestamps: false,
  }
);
