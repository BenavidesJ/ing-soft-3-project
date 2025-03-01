import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const Estado = sequelize.define(
  'Estado',
  {
    idEstado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    NombreEstado: {
      type: DataTypes.STRING(45),
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: 'Estado',
    freezeTableName: true,
    timestamps: false,
  }
);
