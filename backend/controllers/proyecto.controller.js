import dotenv from 'dotenv';
import { Estado } from '../models/Estado.js';
import { Proyecto } from '../models/Proyecto.js';

dotenv.config();

export const createProject = async (req, res) => {
  try {
    const {
      Nombre,
      Descripcion,
      Objetivo,
      FechaInicio,
      FechaFin,
      Presupuesto,
      Status,
    } = req.body;

    if (
      !Nombre ||
      !Descripcion ||
      !Objetivo ||
      !FechaInicio ||
      !Presupuesto ||
      !Status
    ) {
      throw new Error('Todos los campos son obligatorios.');
    }

    const status = await Estado.findOne({ where: { Nombre: Status } });

    if (!status) {
      throw new Error('El estado ingresado no existe, por favor verifique.');
    }

    const project = await Proyecto.create({
      Nombre,
      Descripcion,
      Objetivo,
      FechaInicio,
      FechaFin,
      Presupuesto,
      Estado: status.idEstado,
    });

    return res.status(200).json({
      success: true,
      message: `Proyecto creado correctamente. ID: ${project.idProyecto}`,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
export const updateProject = async (req, res) => {};
export const getProjects = async (req, res) => {};
export const getProjectById = async (req, res) => {};
export const deleteProject = async (req, res) => {};
