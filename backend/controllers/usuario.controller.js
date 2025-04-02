import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Usuario, PerfilUsuario, Rol, Permiso } from '../models/index.js';
import { validPasswordRegex } from '../common/strings.js';

dotenv.config();

export const createUser = async (req, res, next) => {
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
    const user = await Usuario.create(
      {
        Correo,
        Contrasena: hashedPassword,
        Apellido1,
        Apellido2: Apellido2 ? Apellido2 : '',
        Nombre,
      },
      {
        userId: req.user ? req.user.idUsuario : null,
      }
    );
    const userProfile = await PerfilUsuario.create(
      {
        idUsuario: user.idUsuario,
        nombreUsuario: `@${Nombre.toLowerCase().substring(
          0,
          1
        )}${Apellido1.toLowerCase()}${user.idUsuario}`,
      },
      {
        userId: req.user ? req.user.idUsuario : null,
      }
    );
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
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const {
      idUsuario,
      Nombre,
      Correo,
      Contrasena,
      Apellido1,
      Apellido2,
      Activo,
    } = req.body;

    const user = await Usuario.findOne({
      where: { idUsuario },
    });

    if (!user) {
      throw new Error(`El usuario con ID ${idUsuario} no existe.`);
    }

    const updateData = {
      Activo,
      Nombre,
      Correo,
      Apellido1,
      Apellido2,
    };

    if (Contrasena) {
      if (!validPasswordRegex.test(Contrasena) && Contrasena.length <= 6) {
        throw new Error(
          'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo (@#!.).'
        );
      }
      updateData.Contrasena = await bcrypt.hash(Contrasena, 10);
    }

    await user.update(updateData, {
      userId: req.user ? req.user.idUsuario : null,
    });

    return res.status(200).json({
      success: true,
      message: 'Usuario modificado correctamente.',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const idUsuario = req.params.id;
  try {
    const user = await Usuario.findOne({
      where: {
        idUsuario,
      },
    });

    if (!user) {
      throw new Error(`El usuario con ID ${idUsuario} no existe.`);
    }

    await user.update(
      { Activo: false },
      {
        userId: req.user ? req.user.idUsuario : null,
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Usuario eliminado correctamente.',
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  const userID = req.params.id;
  try {
    const user = await Usuario.findOne({
      where: { idUsuario: userID },
      include: [
        { model: PerfilUsuario },
        {
          model: Rol,
          include: [Permiso],
        },
      ],
    });

    if (!user) {
      throw new Error(`El usuario con ID ${userID} no existe.`);
    }

    const profile = user.PerfilUsuario;

    const roles = user.Rols ? user.Rols.map((rol) => rol.NombreRol) : [];

    const permisos = user.Rols
      ? user.Rols.reduce((acc, rol) => {
          if (rol.Permisos && Array.isArray(rol.Permisos)) {
            rol.Permisos.forEach((permiso) => {
              if (!acc.includes(permiso.NombrePermiso)) {
                acc.push(permiso.NombrePermiso);
              }
            });
          }
          return acc;
        }, [])
      : [];

    return res.status(200).json({
      success: true,
      message: 'Usuario encontrado',
      data: {
        idUsuario: user.idUsuario,
        Nombre: `${user.Nombre} ${user.Apellido1} ${user.Apellido2 || ''}`,
        Correo: user.Correo,
        Activo: user.Activo,
        Perfil: {
          idPerfilUsuario: profile?.idPerfilUsuario,
          NombreUsuario: profile?.nombreUsuario,
          urlImagenPerfil: profile?.urlImagenPerfil || null,
        },
        Roles: roles,
        Permisos: permisos,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (_req, res, next) => {
  try {
    const users = await Usuario.findAll({
      attributes: [
        'idUsuario',
        'Nombre',
        'Apellido1',
        'Apellido2',
        'Correo',
        'Activo',
      ],
      include: [
        { model: PerfilUsuario },
        {
          model: Rol,
          include: [Permiso],
        },
      ],
    });
    if (!users) {
      throw new Error('No se encontraron usuarios.');
    }

    const transformedUsers = users.map((user) => {
      const profile = user.PerfilUsuario;
      const roles = user.Rols ? user.Rols.map((rol) => rol.NombreRol) : [];
      const permisos = user.Rols
        ? user.Rols.reduce((acc, rol) => {
            if (rol.Permisos && Array.isArray(rol.Permisos)) {
              rol.Permisos.forEach((permiso) => {
                if (!acc.includes(permiso.NombrePermiso)) {
                  acc.push(permiso.NombrePermiso);
                }
              });
            }
            return acc;
          }, [])
        : [];

      return {
        idUsuario: user.idUsuario,
        Nombre: `${user.Nombre} ${user.Apellido1} ${user.Apellido2 || ''}`,
        Correo: user.Correo,
        Activo: user.Activo,
        Perfil: {
          idPerfilUsuario: profile?.idPerfilUsuario,
          NombreUsuario: profile?.nombreUsuario,
          urlImagenPerfil: profile?.urlImagenPerfil || null,
        },
        Roles: roles,
        Permisos: permisos,
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Usuarios encontrados',
      data: transformedUsers,
    });
  } catch (error) {
    next(error);
  }
};
