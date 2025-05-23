import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const Costo = sequelize.define(
  'Costo',
  {
    idCosto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CostoTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    idProyecto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Proyecto',
        key: 'idProyecto',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'Costo',
    freezeTableName: true,
    timestamps: false,
  }
);
