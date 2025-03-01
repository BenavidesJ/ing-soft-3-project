import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const PerfilUsuario = sequelize.define(
  'PerfilUsuario',
  {
    idPerfilUsuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario',
        key: 'idUsuario',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    nombreUsuario: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    urlImagenPerfil: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: 'PerfilUsuario',
    freezeTableName: true,
    timestamps: false,
  }
);
