import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Usuario } from '../models/Usuario.js';
import { PerfilUsuario } from '../models/PerfilUsuario.js';
import { validPasswordRegex } from '../common/strings.js';

dotenv.config();

export const createUser = async (req, res) => {
  const { Nombre, Correo, Contrasena, Apellido1, Apellido2 } = req.body;
  try {
    if (!Nombre || !Correo || !Contrasena || !Apellido1) {
      throw new Error('Por favor, complete todos los campos.');
    }
    if (!validPasswordRegex.test(Contrasena) && Contrasena.length <= 6) {
      throw new Error(
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo (@#!.).'
      );
    }
    const hashedPassword = await bcrypt.hash(Contrasena, 10);
    const user = await Usuario.create({
      Correo,
      Contrasena: hashedPassword,
      Apellido1,
      Apellido2: Apellido2 ? Apellido2 : '',
      Nombre,
    });
    const userProfile = await PerfilUsuario.create({
      idUsuario: user.idUsuario,
      nombreUsuario: `@${Nombre.toLowerCase().substring(
        0,
        1
      )}${Apellido1.toLowerCase()}${user.idUsuario}`,
    });
    return res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente.',
      data: {
        idUsuario: user.idUsuario,
        Nombre: `${Nombre} ${Apellido1} ${Apellido2 ? Apellido2 : ''}`,
        Correo: user.Correo,
        Perfil: {
          idPerfilUsuario: userProfile.idPerfilUsuario,
          NombreUsuario: userProfile.nombreUsuario,
        },
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {};

export const deleteUser = async (req, res) => {};

export const getUserById = async (req, res) => {
  const userID = req.params.id;
  console.log(userID);
  try {
    const user = await Usuario.findOne({
      where: {
        idUsuario: userID,
      },
    });

    const userProfile = await PerfilUsuario.findOne({
      where: {
        idUsuario: userID,
      },
    });
    if (!user) {
      throw new Error(`El usuario con ID ${userID} no existe.`);
    }

    return res.status(200).json({
      success: true,
      message: 'Usuario encontrado',
      data: {
        idUsuario: user.idUsuario,
        Nombre: `${user.Nombre} ${user.Apellido1} ${user.Apellido2 || ''}`,
        Correo: user.Correo,
        Perfil: {
          idPerfilUsuario: userProfile.idPerfilUsuario,
          NombreUsuario: userProfile.nombreUsuario,
          urlImagenPerfil: userProfile.urlImagenPerfil
            ? userProfile.urlImagenPerfil
            : null,
        },
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getUsers = async (_req, res) => {
  try {
    const users = await Usuario.findAll({
      attributes: ['idUsuario', 'Nombre', 'Apellido1', 'Apellido2', 'Correo'],
    });
    if (!users) {
      throw new Error('No se encontraron usuarios.');
    }
    return res.status(200).json({
      success: true,
      message: 'Usuarios encontrados',
      data: users,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
