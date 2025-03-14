import dotenv from 'dotenv';
import { Tarea, Proyecto, Estado, Costo } from '../models/index.js';
import { validateDates } from '../common/dateValidation.js';
import dayjs from 'dayjs';

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

    const nombreEstado =
      String(Status).charAt(0).toUpperCase() + Status.slice(1);

    const status = await Estado.findOne({
      where: { NombreEstado: nombreEstado },
    });

    if (!status) {
      throw new Error('El estado ingresado no existe, por favor verifique.');
    }

    validateDates(FechaInicio, FechaFin);

    const isoStart = dayjs(FechaInicio, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const isoEnd = FechaFin
      ? dayjs(FechaFin, 'DD/MM/YYYY').format('YYYY-MM-DD')
      : null;

    const project = await Proyecto.create({
      Nombre,
      Descripcion,
      Objetivo,
      FechaInicio: isoStart,
      FechaFin: isoEnd,
      Presupuesto,
      idEstado: status.idEstado,
    });

    return res.status(200).json({
      success: true,
      message: `Proyecto creado correctamente. ID: ${project.idProyecto}`,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { idProyecto, FechaInicio, FechaFin, Status, ...updates } = req.body;
    if (!idProyecto) throw new Error('ID del proyecto es requerido.');

    const project = await Proyecto.findByPk(idProyecto);
    if (!project) throw new Error('Proyecto no encontrado.');

    const effectiveStart = FechaInicio || project.FechaInicio;
    const effectiveEnd =
      typeof FechaFin !== 'undefined' ? FechaFin : project.FechaFin;

    validateDates(effectiveStart, effectiveEnd);

    if (FechaInicio) {
      updates.FechaInicio = dayjs(FechaInicio, 'DD/MM/YYYY').format(
        'YYYY-MM-DD'
      );
    }
    if (typeof FechaFin !== 'undefined') {
      updates.FechaFin = FechaFin
        ? dayjs(FechaFin, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null;
    }

    if (Status) {
      const nombreEstado =
        String(Status).charAt(0).toUpperCase() + Status.slice(1);
      const estado = await Estado.findOne({
        where: { NombreEstado: nombreEstado },
      });
      if (!estado) {
        throw new Error('El estado ingresado no existe, por favor verifique.');
      }
      updates.idEstado = estado.idEstado;
    }

    await project.update(updates);
    return res.status(200).json({
      success: true,
      message: 'Proyecto actualizado correctamente.',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Proyecto.findAll();
    return res.status(200).json({
      success: true,
      message: 'Proyectos obtenidos correctamente.',
      data: projects,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getProjectsByStatus = async (req, res) => {
  try {
    const { NombreEstado } = req.body;
    const status = await Estado.findOne({
      where: { NombreEstado },
    });
    if (!status) throw new Error('Estado no encontrado.');
    const projects = await Proyecto.findAll({
      where: { idEstado: status.idEstado },
    });
    return res.status(200).json({
      success: true,
      message: 'Proyectos por estado obtenidos correctamente.',
      data: projects,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Proyecto.findByPk(id);
    if (!project) throw new Error('Proyecto no encontrado.');
    return res.status(200).json({
      success: true,
      message: 'Proyecto encontrado.',
      data: project,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Proyecto.findByPk(id);
    if (!project) throw new Error('Proyecto no encontrado.');
    project.Activo = false;
    await project.save();
    return res.status(200).json({
      success: true,
      message: 'Proyecto eliminado correctamente.',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const createCost = async (req, res) => {
  try {
    const { idProyecto, CostoTotal } = req.body;
    if (!idProyecto || !CostoTotal) throw new Error('CostoTotal es requerido.');
    const project = await Proyecto.findByPk(idProyecto);
    if (!project) throw new Error('Proyecto no encontrado.');
    const cost = await Costo.create({
      CostoTotal,
      idProyecto,
    });
    return res.status(201).json({
      success: true,
      message: 'Costo creado y asignado al proyecto correctamente.',
      data: cost,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const assignTaskToProject = async (req, res) => {
  try {
    const { idProyecto, idTareas } = req.body;

    if (!idProyecto || !idTareas || !Array.isArray(idTareas)) {
      throw new Error(
        'Se requieren el ID del proyecto y un array de IDs de tareas.'
      );
    }

    const project = await Proyecto.findByPk(idProyecto);
    if (!project) throw new Error('Proyecto no encontrado.');

    const tasks = await Tarea.findAll({
      where: {
        idTarea: idTareas,
      },
    });

    if (!tasks.length) {
      throw new Error('No se encontraron las tareas especificadas.');
    }

    await project.addTareas(tasks);

    return res.status(200).json({
      success: true,
      message: 'Tareas asignadas al proyecto correctamente.',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
