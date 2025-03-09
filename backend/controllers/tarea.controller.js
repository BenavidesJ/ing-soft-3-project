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

    const task = await Tarea.create({
      Nombre,
      Descripcion,
      FechaInicio,
      FechaFin,
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
    const { idTarea, ...updates } = req.body;
    if (!idTarea) throw new Error('ID de la tarea es requerido.');
    const task = await Tarea.findByPk(idTarea);
    if (!task) throw new Error('Tarea no encontrada.');
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
    const tasks = await Tarea.findAll();
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
  //** ver luego */
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
  //** ver luego */
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
    return res.status(400).json({ success: false, message: error.message });
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
