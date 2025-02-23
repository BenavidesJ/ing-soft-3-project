import { Model, DataTypes } from 'sequelize';
import { validPasswordRegex } from '../common/strings';

export default (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.belongsToMany(models.Rol, {
        through: models.UsuarioRol,
        foreignKey: 'idUsuario',
      });

      Usuario.belongsToMany(models.Tarea, {
        through: models.UsuarioTarea,
        foreignKey: 'idUsuario',
      });
    }
  }

  Usuario.init(
    {
      idUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: 'El correo no tiene un formato válido.',
          },
        },
      },
      Contrasena: {
        type: DataTypes.STRING(45),
        allowNull: false,
        len: {
          args: [6, 45],
          msg: 'La contraseña debe tener al menos 6 caracteres.',
        },
        isValidPassword(value) {
          if (!validPasswordRegex.test(value)) {
            throw new Error(
              'La contraseña debe contener al menos una letra mayúscula, un número y un símbolo (@#!.).'
            );
          }
        },
      },
      NombreUsuario: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      Activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Usuario',
      tableName: 'Usuario',
    }
  );

  return Usuario;
};
