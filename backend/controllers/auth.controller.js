import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import { Usuario, Rol, PerfilUsuario, Permiso } from '../models/index.js';
import { generateJWT } from '../common/generateJWT.js';
import { validPasswordRegex } from '../common/strings.js';
import { sendEmail } from '../services/mail.js';
import { generateTempPassword } from '../common/generateTempPassword.js';

dotenv.config();

export const registro = async (req, res, next) => {
  const { Correo, Contrasena, Nombre, Apellido1, Apellido2 } = req.body;
  try {
    if (!Correo || !Contrasena || !Nombre || !Apellido1) {
      throw new Error('Por favor, complete todos los campos.');
    }

    const userAlreadyExists = await Usuario.findOne({
      where: {
        Correo,
      },
    });

    if (userAlreadyExists) {
      throw new Error('El usuario ingresado ya existe.');
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
      Nombre,
      Apellido1,
      Apellido2,
    });

    const userProfile = await PerfilUsuario.create({
      idUsuario: user.idUsuario,
      nombreUsuario: `@${Nombre.toLowerCase().substring(
        0,
        1
      )}${Apellido1.toLowerCase()}${user.idUsuario}`,
    });

    const access_token = generateJWT(user.Correo);

    return res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente.',
      data: {
        idUsuario: user.idUsuario,
        Nombre: `${Nombre} ${Apellido1} ${Apellido2}`,
        Correo: user.Correo,
        Access_token: access_token,
        Perfil: {
          idPerfilUsuario: userProfile.idPerfilUsuario,
          NombreUsuario: userProfile.nombreUsuario,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { Correo, Contrasena } = req.body;
  try {
    if (!Correo || !Contrasena) {
      throw new Error('Por favor, complete todos los campos.');
    }

    const user = await Usuario.findOne({
      where: {
        Correo,
      },
    });

    if (!user) {
      throw new Error(
        'Credenciales incorrectas, por favor verifique e ingrese de nuevo sus datos.'
      );
    }

    const userProfile = await PerfilUsuario.findOne({
      where: {
        idUsuario: user.idUsuario,
      },
    });

    const isPasswordValid = await bcrypt.compare(Contrasena, user.Contrasena);
    if (!isPasswordValid) {
      throw new Error(
        'Contrasena incorrecta, por favor verifique e ingrese de nuevo sus datos.'
      );
    }

    const access_token = generateJWT(user);

    return res.status(200).json({
      success: true,
      message: 'Sesion iniciada correctamente.',
      data: {
        idUsuario: user.idUsuario,
        Nombre: `${user.Nombre} ${user.Apellido1} ${user?.Apellido2}`,
        Correo: user.Correo,
        Access_token: access_token,
        Perfil: {
          idPerfilUsuario: userProfile.idPerfilUsuario,
          NombreUsuario: userProfile.nombreUsuario,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resetearPassword = async (req, res) => {
  try {
    const { Correo } = req.body;

    if (!Correo) {
      throw new Error('Por favor, ingrese su correo.');
    }

    const user = await Usuario.findOne({
      where: {
        Correo,
      },
    });

    if (!user) {
      throw new Error('El correo ingresado no se encuentra registrado.');
    }

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    user.Contrasena = hashedPassword;
    await user.save();

    const subject = 'Restaurar Contrasena';
    const message = `Hola ${user.Nombre} ${user.Apellido1}, te enviamos la siguiente contraseña temporal: ${tempPassword}. Por favor, cambia tu contraseña en cuanto puedas.`;
    const recipient = Correo;
    await sendEmail({ recipient, subject, message });

    return res.status(200).json({
      success: true,
      message: 'Hemos enviado un correo para que restaures tu contrasena.',
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: 'Hemos detectado un error al enviar el correo' + error.message,
    });
  }
};

export const createRole = async (req, res, next) => {
  try {
    const { NombreRol } = req.body;
    if (!NombreRol) throw new Error('El nombre del rol es requerido.');
    const existingRole = await Rol.findOne({
      where: { NombreRol: String(NombreRol).toUpperCase() },
    });
    if (existingRole) throw new Error(`El ${NombreRol} rol ya existe.`);
    const nuevoRol = String(NombreRol).toUpperCase();
    const role = await Rol.create({ NombreRol: nuevoRol });
    return res.status(201).json({
      success: true,
      message: 'Rol creado correctamente.',
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

export const createPermission = async (req, res, next) => {
  try {
    const { NombrePermiso } = req.body;
    if (!NombrePermiso) throw new Error('El nombre del permiso es requerido.');
    const existingPermission = await Permiso.findOne({
      where: { NombrePermiso: String(NombrePermiso).toUpperCase() },
    });
    if (existingPermission)
      throw new Error(`El permiso ${NombrePermiso} ya existe.`);
    const nuevoPermiso = String(NombrePermiso).toUpperCase();
    const permission = await Permiso.create({ NombrePermiso: nuevoPermiso });
    return res.status(201).json({
      success: true,
      message: 'Permiso creado correctamente.',
      data: permission,
    });
  } catch (error) {
    next(error);
  }
};

export const assignRoleToUser = async (req, res, next) => {
  try {
    const { idUsuario, idRol } = req.body;
    if (!idUsuario || !idRol)
      throw new Error('ID de usuario y ID de rol son requeridos.');
    const user = await Usuario.findByPk(idUsuario);
    if (!user) throw new Error('Usuario no encontrado.');
    const role = await Rol.findByPk(idRol);
    if (!role) throw new Error('Rol no encontrado.');
    await user.addRol(role);
    return res.status(200).json({
      success: true,
      message: 'Rol asignado al usuario correctamente.',
    });
  } catch (error) {
    next(error);
  }
};

export const assignPermissionToRole = async (req, res, next) => {
  try {
    const { idRol, idPermiso } = req.body;
    if (!idRol || !idPermiso)
      throw new Error('ID de rol y ID de permiso son requeridos.');
    const role = await Rol.findByPk(idRol);
    if (!role) throw new Error('Rol no encontrado.');
    const permission = await Permiso.findByPk(idPermiso);
    if (!permission) throw new Error('Permiso no encontrado.');
    await role.addPermiso(permission);
    return res.status(200).json({
      success: true,
      message: 'Permiso asignado al rol correctamente.',
    });
  } catch (error) {
    next(error);
  }
};

export const modifyUserRole = async (req, res, next) => {
  try {
    const { idUsuario, roles } = req.body; // roles: array de IDs de rol
    if (!idUsuario || !roles)
      throw new Error('ID de usuario y roles son requeridos.');
    const user = await Usuario.findByPk(idUsuario);
    if (!user) throw new Error('Usuario no encontrado.');

    await user.setRols(roles);
    return res.status(200).json({
      success: true,
      message: 'Roles del usuario modificados correctamente.',
    });
  } catch (error) {
    next(error);
  }
};

export const modifyRolePermission = async (req, res, next) => {
  try {
    const { idRol, permisos } = req.body; // permisos: array de IDs de permiso
    if (!idRol || !permisos)
      throw new Error('ID de rol y permisos son requeridos.');
    const role = await Rol.findByPk(idRol);
    if (!role) throw new Error('Rol no encontrado.');
    await role.setPermisos(permisos);
    return res.status(200).json({
      success: true,
      message: 'Permisos del rol modificados correctamente.',
    });
  } catch (error) {
    next(error);
  }
};
