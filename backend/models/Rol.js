import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const Rol = sequelize.define(
  'Rol',
  {
    idRol: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    NombreRol: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'Rol',
    freezeTableName: true,
    timestamps: false,
  }
);
