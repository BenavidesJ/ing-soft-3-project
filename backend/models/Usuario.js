import { DataTypes, Sequelize } from 'sequelize';
import { validPasswordRegex } from '../common/strings.js';
import { sequelize } from '../database.js';

export const Usuario = sequelize.define(
  'Usuario',
  {
    idUsuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Nombre: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    Apellido1: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    Apellido2: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    Correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'El correo no tiene un formato válido.',
        },
      },
    },
    Contrasena: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    Fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    Fecha_modificacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    tableName: 'Usuario',
    freezeTableName: true,
    timestamps: false,
  }
);
