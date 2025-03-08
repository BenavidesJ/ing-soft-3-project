import dotenv from 'dotenv';
import { Estado } from '../models/Estado.js';

dotenv.config();

export const createStatus = async (req, res) => {
  try {
    const { NombreEstado } = req.body;

    if (!NombreEstado) {
      throw new Error('Todos los campos son obligatorios.');
    }

    const status = await Estado.findOne({
      where: { NombreEstado: NombreEstado },
    });

    if (status) {
      throw new Error('El estado ingresado ya fue creado previamente.');
    }

    const estado = await Estado.create({
      NombreEstado,
    });

    return res.status(200).json({
      success: true,
      message: `Estado: ${estado.NombreEstado} con ID: ${estado.idEstado} creado correctamente.`,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
