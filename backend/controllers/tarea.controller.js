import dayjs from 'dayjs';
import { validateDates } from '../common/dateValidation.js';
import { Tarea, Proyecto, Estado, Usuario } from '../models/index.js';

export const createTask = async (req, res) => {
  try {
    const { Nombre, Descripcion, FechaInicio, FechaFin, Status } = req.body;
    if (!Nombre || !Descripcion || !FechaInicio || !Status)
      throw new Error('Todos los campos son obligatorios.');

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

    const task = await Tarea.create({
      Nombre,
      Descripcion,
      FechaInicio: isoStart,
      FechaFin: isoEnd,
      idEstado: status.idEstado,
    });
    return res.status(201).json({
      success: true,
      message: `Tarea creada correctamente con el ID ${task.idTarea}.`,
      data: task,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { idTarea, FechaInicio, FechaFin, Status, ...updates } = req.body;
    if (!idTarea) throw new Error('ID de la tarea es requerido.');

    const task = await Tarea.findByPk(idTarea);
    if (!task) throw new Error('Tarea no encontrada.');

    const effectiveStart = FechaInicio || task.FechaInicio;
    const effectiveEnd =
      typeof FechaFin !== 'undefined' ? FechaFin : task.FechaFin;

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

    await task.update(updates);
    return res.status(200).json({
      success: true,
      message: 'Tarea actualizada correctamente.',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const assignTaskToMember = async (req, res) => {
  try {
    const { idTarea, idUsuario } = req.body;
    if (!idTarea || !idUsuario)
      throw new Error('ID de tarea y usuario son requeridos.');
    const task = await Tarea.findByPk(idTarea);
    if (!task) throw new Error('Tarea no encontrada.');
    const user = await Usuario.findByPk(idUsuario);
    if (!user) throw new Error('Usuario no encontrado.');
    await task.addUsuario(user);
    return res.status(200).json({
      success: true,
      message: 'Tarea asignada al miembro correctamente.',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Tarea.findAll({
      include: [
        {
          model: Proyecto,
          attributes: ['idProyecto'],
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: 'Tareas obtenidas correctamente.',
      data: tasks,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getTasksByStatus = async (req, res) => {
  try {
    const { NombreEstado } = req.body;
    const status = await Estado.findOne({
      where: { NombreEstado },
    });
    if (!status) throw new Error('Estado no encontrado.');
    const tasks = await Tarea.findAll({ where: { idEstado: status.idEstado } });
    return res.status(200).json({
      success: true,
      message: 'Tareas por estado obtenidas correctamente.',
      data: tasks,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getTasksByProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Proyecto.findByPk(projectId, { include: Tarea });
    if (!project) throw new Error('Proyecto no encontrado.');
    return res.status(200).json({
      success: true,
      message: 'Tareas del proyecto obtenidas correctamente.',
      data: project.Tareas,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getTasksByMember = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Usuario.findByPk(userId, { include: Tarea });
    if (!user) throw new Error('Usuario no encontrado.');
    return res.status(200).json({
      success: true,
      message: 'Tareas asignadas al miembro obtenidas correctamente.',
      data: user.Tareas,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error.message, data: [] });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Tarea.findByPk(id);
    if (!task) throw new Error('Tarea no encontrada.');
    return res.status(200).json({
      success: true,
      message: 'Tarea encontrada.',
      data: task,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Tarea.findByPk(id);
    if (!task) throw new Error('Tarea no encontrada.');
    task.Activo = false;
    await task.save();
    return res.status(200).json({
      success: true,
      message: 'Tarea eliminada correctamente.',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getUserByTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Tarea.findByPk(taskId, { include: Usuario });
    if (!task) throw new Error('Tarea no encontrada.');

    const transformedData = task.Usuarios.map((user) => ({
      idTarea: task.idTarea,
      userId: user.idUsuario,
    }));

    return res.status(200).json({
      success: true,
      message: 'Usuario(s) asignado(s) a la tarea obtenidos correctamente.',
      data: transformedData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
