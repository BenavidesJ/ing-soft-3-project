import { Recurso, Tarea, Proyecto } from '../models/index.js';

export const createResource = async (req, res, next) => {
  try {
    const { Nombre } = req.body;
    if (!Nombre) throw new Error('El nombre del recurso es requerido.');
    const resource = await Recurso.create(
      { Nombre },
      {
        userId: req.user ? req.user.idUsuario : null,
      }
    );
    return res.status(201).json({
      success: true,
      message: 'Recurso creado correctamente.',
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (req, res, next) => {
  try {
    const { idRecurso, Nombre } = req.body;
    if (!idRecurso || !Nombre)
      throw new Error('ID del recurso y nuevo nombre son requeridos.');
    const resource = await Recurso.findByPk(idRecurso);
    if (!resource) throw new Error('Recurso no encontrado.');
    resource.Nombre = Nombre;
    await resource.save({
      userId: req.user ? req.user.idUsuario : null,
    });
    return res.status(200).json({
      success: true,
      message: 'Recurso actualizado correctamente.',
    });
  } catch (error) {
    next(error);
  }
};

export const assignResourceToTask = async (req, res, next) => {
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
    next(error);
  }
};

export const getAllResources = async (req, res, next) => {
  try {
    const resources = await Recurso.findAll();
    return res.status(200).json({
      success: true,
      message: 'Recursos obtenidos correctamente.',
      data: resources,
    });
  } catch (error) {
    next(error);
  }
};

export const getResourcesByProject = async (req, res, next) => {
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
    next(error);
  }
};

export const getResourcesByTask = async (req, res, next) => {
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
    next(error);
  }
};

export const deleteResource = async (req, res, next) => {
  try {
    const id = req.params.id;
    const resource = await Recurso.findByPk(id);
    if (!resource) throw new Error('Recurso no encontrado.');
    await Recurso.destroy({
      where: { idRecurso: id },
      userId: req.user ? req.user.idUsuario : null,
    });
    return res.status(200).json({
      success: true,
      message: 'Recurso eliminado correctamente.',
    });
  } catch (error) {
    next(error);
  }
};
