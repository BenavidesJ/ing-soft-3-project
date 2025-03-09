import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const BitacoraEventos = sequelize.define(
  'BitacoraEventos',
  {
    idEvento: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Tiempo_evento: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    Tabla_afectada: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Tipo_evento: {
      type: DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE', 'ERROR'),
      allowNull: false,
    },
    Descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Usuario',
        key: 'idUsuario',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  },
  {
    tableName: 'BitacoraEventos',
    freezeTableName: true,
    timestamps: false,
  }
);
