import { Recurso } from '../models/Recurso.js';
import { Tarea } from '../models/Tarea.js';
import { Proyecto } from '../models/Proyecto.js';

export const createResource = async (req, res) => {
  try {
    const { Nombre } = req.body;
    if (!Nombre) throw new Error('El nombre del recurso es requerido.');
    const resource = await Recurso.create({ Nombre });
    return res.status(201).json({
      success: true,
      message: 'Recurso creado correctamente.',
      data: resource,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateResource = async (req, res) => {
  try {
    const { idRecurso, Nombre } = req.body;
    if (!idRecurso || !Nombre)
      throw new Error('ID del recurso y nuevo nombre son requeridos.');
    const resource = await Recurso.findByPk(idRecurso);
    if (!resource) throw new Error('Recurso no encontrado.');
    resource.Nombre = Nombre;
    await resource.save();
    return res.status(200).json({
      success: true,
      message: 'Recurso actualizado correctamente.',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const assignResourceToTask = async (req, res) => {
  try {
    const { idTarea, recursos } = req.body;
    if (!idTarea || !recursos)
      throw new Error('ID de tarea y recursos son requeridos.');
    const task = await Tarea.findByPk(idTarea);
    if (!task) throw new Error('Tarea no encontrada.');
    await task.addRecursos(recursos);
    return res.status(200).json({
      success: true,
      message: 'Recursos asignados a la tarea correctamente.',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllResources = async (req, res) => {
  try {
    const resources = await Recurso.findAll();
    return res.status(200).json({
      success: true,
      message: 'Recursos obtenidos correctamente.',
      data: resources,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getResourcesByProject = async (req, res) => {
  // ** revisar luego
  try {
    const projectId = req.params.id;
    const project = await Proyecto.findByPk(projectId, {
      include: { model: Tarea, include: Recurso },
    });
    if (!project) throw new Error('Proyecto no encontrado.');

    let resources = [];
    project.Tareas &&
      project.Tareas.forEach((task) => {
        if (task.Recursos) {
          resources = resources.concat(task.Recursos);
        }
      });

    const uniqueResources = Array.from(
      new Set(resources.map((r) => r.idRecurso))
    ).map((id) => resources.find((r) => r.idRecurso === id));
    return res.status(200).json({
      success: true,
      message: 'Recursos del proyecto obtenidos correctamente.',
      data: uniqueResources,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getResourcesByTask = async (req, res) => {
  // ** revisar luego
  try {
    const taskId = req.params.id;
    const task = await Tarea.findByPk(taskId, { include: Recurso });
    if (!task) throw new Error('Tarea no encontrada.');
    return res.status(200).json({
      success: true,
      message: 'Recursos de la tarea obtenidos correctamente.',
      data: task.Recursos,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const id = req.params.id;
    const resource = await Recurso.findByPk(id);
    if (!resource) throw new Error('Recurso no encontrado.');
    await Recurso.destroy({
      where: { idRecurso: id },
    });
    return res.status(200).json({
      success: true,
      message: 'Recurso eliminado correctamente.',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
