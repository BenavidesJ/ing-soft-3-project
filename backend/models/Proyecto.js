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
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isValidDate(value) {
          if (!isValidDateFormat(value)) {
            throw new Error(
              'La fecha de inicio debe tener el formato dd/mm/yyyy y ser válida.'
            );
          }
        },
      },
    },
    FechaFin: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isValidDate(value) {
          if (!isValidDateFormat(value)) {
            throw new Error(
              'La fecha de finalizacion debe tener el formato dd/mm/yyyy y ser válida.'
            );
          }
        },
        isAfterStartDate(value) {
          if (value && this.FechaInicio) {
            const fechaInicio = new Date(
              ...String(this.FechaInicio).split('/').reverse().map(Number)
            );
            const fechaFinalizacion = new Date(
              ...String(value).split('/').reverse().map(Number)
            );

            if (fechaFinalizacion <= fechaInicio) {
              throw new Error(
                'La fecha de finalizacion debe ser posterior a la fecha de inicio.'
              );
            }
          }
        },
      },
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
    Estado_idEstado: {
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
