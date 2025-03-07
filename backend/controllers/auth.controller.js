import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import { Usuario } from '../models/Usuario.js';
import { PerfilUsuario } from '../models/PerfilUsuario.js';
import { generateJWT } from '../common/generateJWT.js';
import { validPasswordRegex } from '../common/strings.js';
import { sendEmail } from '../services/mail.js';
import { generateTempPassword } from '../common/generateTempPassword.js';

dotenv.config();

export const registro = async (req, res) => {
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
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
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

    const access_token = generateJWT(user.Correo);

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
    return res.status(400).json({ success: false, message: error.message });
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
