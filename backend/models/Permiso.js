import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const Permiso = sequelize.define(
  'Permiso',
  {
    idPermiso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    NombrePermiso: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'Permiso',
    freezeTableName: true,
    timestamps: false,
  }
);
