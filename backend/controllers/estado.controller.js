import dotenv from 'dotenv';
import { Estado } from '../models/Estado.js';
import { Proyecto } from '../models/Proyecto.js';
import { Tarea } from '../models/Tarea.js';

dotenv.config();

export const createStatus = async (req, res, next) => {
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
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { idEstado, NombreEstado } = req.body;
    if (!idEstado || !NombreEstado)
      throw new Error('ID de estado y nuevo nombre son requeridos.');
    const status = await Estado.findOne({
      where: { idEstado },
    });
    if (!status) throw new Error('Estado no encontrado.');
    status.NombreEstado = NombreEstado;
    await status.save();
    return res.status(200).json({
      success: true,
      message: 'Estado actualizado correctamente.',
    });
  } catch (error) {
    next(error);
  }
};

export const assignStatus = async (req, res, next) => {
  try {
    const { tipo, id, idEstado } = req.body;
    if (!tipo || !id || !idEstado)
      throw new Error('Tipo, id y idEstado son requeridos.');
    const status = await Estado.findByPk(idEstado);
    if (!status) throw new Error('Estado no encontrado.');
    if (String(tipo).toLowerCase() === 'proyecto') {
      const project = await Proyecto.findByPk(id);
      if (!project) throw new Error('Proyecto no encontrado.');
      project.idEstado = idEstado;
      await project.save();
    } else if (String(tipo).toLowerCase() === 'tarea') {
      const task = await Tarea.findByPk(id);
      if (!task) throw new Error('Tarea no encontrada.');
      task.idEstado = idEstado;
      await task.save();
    } else {
      throw new Error("Tipo no válido. Debe ser 'proyecto' o 'tarea'.");
    }
    return res.status(200).json({
      success: true,
      message: `Estado: ${
        status.NombreEstado
      } asignado correctamente a ${String(tipo).toLowerCase()} con ID: ${id}.`,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllStatuses = async (_req, res) => {
  try {
    const statuses = await Estado.findAll();
    return res.status(200).json({
      success: true,
      message: 'Estados obtenidos correctamente.',
      data: statuses,
    });
  } catch (error) {
    next(error);
  }
};

export const getStatusById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const status = await Estado.findByPk(id);
    if (!status) throw new Error('Estado no encontrado.');
    return res.status(200).json({
      success: true,
      message: 'Estado encontrado.',
      data: status,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStatus = async (req, res, next) => {
  try {
    const idEstado = req.params.id;
    const status = await Estado.findByPk(idEstado);
    if (!status) throw new Error('Estado no encontrado.');

    await Estado.destroy({
      where: { idEstado },
    });
    return res.status(200).json({
      success: true,
      message: `Estado con id: ${idEstado} eliminado correctamente.`,
    });
  } catch (error) {
    next(error);
  }
};
