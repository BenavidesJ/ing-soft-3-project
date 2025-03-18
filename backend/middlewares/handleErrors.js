import { ValidationError, UniqueConstraintError } from 'sequelize';
import { BitacoraEventos } from '../models/index.js';

export function errorHandler(err, req, res, _next) {
  BitacoraEventos.create({
    Tabla_afectada: 'n/a',
    Tipo_evento: 'ERROR',
    Descripcion: `Se produjo el error ${err.message} al consultar el endpoint ${req.originalUrl}`,
    idUsuario: req.user ? req.user.idUsuario : null,
  });

  if (err instanceof ValidationError) {
    const mensajes = err.errors.map((e) => e.message).join(', ');
    return res.status(400).json({
      success: false,
      message: `Error de validación: ${mensajes}`,
    });
  }

  if (err instanceof UniqueConstraintError) {
    return res.status(400).json({
      success: false,
      message: 'El valor ingresado ya existe.',
    });
  }

  if (err.message && err.message.includes('notNull Violation')) {
    const match = err.message.match(/(\w+) cannot be null/);
    if (match && match[1]) {
      return res.status(400).json({
        success: false,
        message: `El campo ${match[1]} es obligatorio y no puede ser nulo.`,
      });
    }
  }

  if (err.code) {
    switch (err.code) {
      case 'ER_DUP_ENTRY':
        return res.status(400).json({
          success: false,
          message: 'El valor ingresado ya existe (duplicado).',
        });
      default:
        break;
    }
  }

  return res.status(400).json({
    success: false,
    message: err.message,
  });
}
