import { Op } from 'sequelize';
import dayjs from 'dayjs';
import {
  Proyecto,
  Tarea,
  Costo,
  Usuario,
  BitacoraEventos,
  Estado,
  Recurso,
} from '../models/index.js';

/**
 * 1. Reporte de Avance por Proyectos
 * Muestra el porcentaje de tareas completadas, en progreso y pendientes por proyecto,
 * junto con información adicional del proyecto.
 */
export const reportAvancePorProyectos = async (req, res, next) => {
  try {
    const { fechaInicio: filterFechaInicio, fechaFin: filterFechaFin } =
      req.query;
    let where = {};
    if (filterFechaInicio && filterFechaFin) {
      where = {
        FechaInicio: {
          [Op.between]: [
            dayjs(filterFechaInicio).format('YYYY-MM-DD'),
            dayjs(filterFechaFin).format('YYYY-MM-DD'),
          ],
        },
        [Op.or]: [
          { FechaFin: null },
          {
            FechaFin: {
              [Op.between]: [
                dayjs(filterFechaInicio).format('YYYY-MM-DD'),
                dayjs(filterFechaFin).format('YYYY-MM-DD'),
              ],
            },
          },
        ],
      };
    }

    const projects = await Proyecto.findAll({
      where,
      include: [
        {
          model: Tarea,
          include: { model: Estado, attributes: ['NombreEstado'] },
        },
        {
          model: Estado,
          attributes: ['NombreEstado'],
        },
        {
          model: Costo,
          attributes: ['CostoTotal'],
        },
      ],
    });

    const data = projects.map((project) => {
      const total = project.Tareas.length;
      let completadas = 0,
        enProgreso = 0,
        pendientes = 0;

      project.Tareas.forEach((task) => {
        const estado = task.Estado
          ? task.Estado.NombreEstado.toUpperCase()
          : '';
        if (estado === 'FINALIZADO') {
          completadas++;
        } else if (estado === 'EN PROGRESO') {
          enProgreso++;
        } else {
          pendientes++;
        }
      });

      const projectState = project.Estado
        ? project.Estado.NombreEstado.toUpperCase()
        : 'NO ASIGNADO';

      let porcentajeFinalizacion = 0;
      if (total > 0) {
        if (completadas === total && projectState === 'FINALIZADO') {
          porcentajeFinalizacion = 100;
        } else {
          porcentajeFinalizacion = Number(
            ((completadas / total) * 100).toFixed(2)
          );
        }
      }

      const costoFinal = project.Costos
        ? project.Costos.reduce(
            (sum, cost) => sum + parseFloat(cost.CostoTotal),
            0
          )
        : 0;

      return {
        idProyecto: project.idProyecto,
        Nombre: project.Nombre,
        Descripcion: project.Descripcion,
        Objetivo: project.Objetivo,
        FechaInicio: dayjs(project.FechaInicio).format('DD/MM/YYYY'),
        FechaFin: project.FechaFin
          ? dayjs(project.FechaFin).format('DD/MM/YYYY')
          : 'Sin definir',
        EstadoProyecto: projectState,
        totalTareas: total,
        tareasCompletadas: completadas,
        tareasEnProgreso: enProgreso,
        tareasPendientes: pendientes,
        porcentajeFinalizacion,
        presupuesto: project.Presupuesto,
        costoFinal,
      };
    });

    res.status(200).json({
      success: true,
      message: 'Reporte de avance por proyectos obtenido correctamente.',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. Reporte Financiero de Proyectos
 * Detalla el costo total (suma de costos asociados) de cada proyecto.
 */
export const reportFinancieroProyectos = async (req, res, next) => {
  try {
    const { fechaInicio: filterFechaInicio, fechaFin: filterFechaFin } =
      req.query;
    let where = {};
    if (filterFechaInicio && filterFechaFin) {
      where = {
        FechaInicio: {
          [Op.between]: [
            dayjs(filterFechaInicio).format('YYYY-MM-DD'),
            dayjs(filterFechaFin).format('YYYY-MM-DD'),
          ],
        },
        FechaFin: {
          [Op.between]: [
            dayjs(filterFechaInicio).format('YYYY-MM-DD'),
            dayjs(filterFechaFin).format('YYYY-MM-DD'),
          ],
        },
      };
    }

    const projects = await Proyecto.findAll({
      where,
      include: { model: Costo, attributes: ['CostoTotal'] },
    });

    const data = projects.map((project) => {
      const totalCost = project.Costos
        ? project.Costos.reduce(
            (sum, cost) => sum + parseFloat(cost.CostoTotal),
            0
          )
        : 0;

      const presupuesto = parseFloat(project.Presupuesto);

      const ajustePresupuesto =
        totalCost <= presupuesto ? 'Dentro del Presupuesto' : 'Excedido';

      return {
        idProyecto: project.idProyecto,
        Nombre: project.Nombre,
        presupuesto,
        costoTotal: totalCost,
        ajustePresupuesto,
      };
    });

    res.status(200).json({
      success: true,
      message: 'Reporte financiero de proyectos obtenido correctamente.',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. Reporte de Asignación de Recursos
 * Lista cómo se han asignado y utilizado los recursos en las tareas.
 */
export const reportAsignacionRecursos = async (req, res, next) => {
  try {
    const { fechaInicio: filterFechaInicio, fechaFin: filterFechaFin } =
      req.query;
    let where = {};

    if (filterFechaInicio && filterFechaFin) {
      where = {
        FechaInicio: {
          [Op.between]: [
            dayjs(filterFechaInicio).format('YYYY-MM-DD'),
            dayjs(filterFechaFin).format('YYYY-MM-DD'),
          ],
        },
        [Op.or]: [
          { FechaFin: null },
          {
            FechaFin: {
              [Op.between]: [
                dayjs(filterFechaInicio).format('YYYY-MM-DD'),
                dayjs(filterFechaFin).format('YYYY-MM-DD'),
              ],
            },
          },
        ],
      };
    }

    const tasks = await Tarea.findAll({
      where,
      include: { model: Recurso, attributes: ['idRecurso', 'Nombre'] },
    });

    const data = tasks.map((task) => ({
      idTarea: task.idTarea,
      NombreTarea: task.Nombre,
      Recursos: task.Recursos
        ? task.Recursos.map((r) => ({
            idRecurso: r.idRecurso,
            Nombre: r.Nombre,
          }))
        : [],
    }));

    res.status(200).json({
      success: true,
      message: 'Reporte de asignación de recursos obtenido correctamente.',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. Reporte de Carga de Trabajo por Miembro
 * Muestra el número total de tareas asignadas a cada usuario, con su desglose.
 */
export const reportCargaTrabajoPorMiembro = async (req, res, next) => {
  try {
    const { fechaInicio: filterFechaInicio, fechaFin: filterFechaFin } =
      req.query;

    let tareaWhere = {};
    if (filterFechaInicio && filterFechaFin) {
      tareaWhere = {
        FechaInicio: {
          [Op.between]: [
            dayjs(filterFechaInicio).format('YYYY-MM-DD'),
            dayjs(filterFechaFin).format('YYYY-MM-DD'),
          ],
        },
        [Op.or]: [
          { FechaFin: null },
          {
            FechaFin: {
              [Op.between]: [
                dayjs(filterFechaInicio).format('YYYY-MM-DD'),
                dayjs(filterFechaFin).format('YYYY-MM-DD'),
              ],
            },
          },
        ],
      };
    }

    const tareaInclude = {
      model: Tarea,
      include: { model: Estado, attributes: ['NombreEstado'] },
      ...(filterFechaInicio && filterFechaFin ? { where: tareaWhere } : {}),
    };

    const users = await Usuario.findAll({
      include: tareaInclude,
    });

    const data = users.map((user) => {
      const total = user.Tareas ? user.Tareas.length : 0;
      let completadas = 0,
        enProgreso = 0,
        pendientes = 0;
      if (user.Tareas) {
        user.Tareas.forEach((task) => {
          const estado = task.Estado
            ? task.Estado.NombreEstado.toUpperCase()
            : '';
          if (estado === 'FINALIZADO') {
            completadas++;
          } else if (estado === 'EN PROGRESO') {
            enProgreso++;
          } else {
            pendientes++;
          }
        });
      }
      return {
        idUsuario: user.idUsuario,
        Nombre: `${user.Nombre} ${user.Apellido1}`,
        totalTareas: total,
        tareasCompletadas: completadas,
        tareasEnProgreso: enProgreso,
        tareasPendientes: pendientes,
      };
    });

    res.status(200).json({
      success: true,
      message:
        'Reporte de carga de trabajo por miembro obtenido correctamente.',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 5. Reporte Comparativo: Proyectos Planificados vs. Ejecutados
 * Compara el total de tareas planificadas versus las que se han completado en cada proyecto.
 */
export const reportComparativoProyectos = async (req, res, next) => {
  try {
    const { fechaInicio: filterFechaInicio, fechaFin: filterFechaFin } =
      req.query;
    let where = {};

    if (filterFechaInicio && filterFechaFin) {
      where = {
        FechaInicio: {
          [Op.between]: [
            dayjs(filterFechaInicio).format('YYYY-MM-DD'),
            dayjs(filterFechaFin).format('YYYY-MM-DD'),
          ],
        },
        [Op.or]: [
          { FechaFin: null },
          {
            FechaFin: {
              [Op.between]: [
                dayjs(filterFechaInicio).format('YYYY-MM-DD'),
                dayjs(filterFechaFin).format('YYYY-MM-DD'),
              ],
            },
          },
        ],
      };
    }

    const projects = await Proyecto.findAll({
      where,
      include: {
        model: Tarea,
        include: { model: Estado, attributes: ['NombreEstado'] },
      },
    });

    const data = projects.map((project) => {
      const total = project.Tareas ? project.Tareas.length : 0;
      let completadas = 0;

      if (project.Tareas) {
        project.Tareas.forEach((task) => {
          const estado = task.Estado
            ? task.Estado.NombreEstado.toUpperCase()
            : '';
          if (estado === 'FINALIZADO') {
            completadas++;
          }
        });
      }

      return {
        idProyecto: project.idProyecto,
        Nombre: project.Nombre,
        totalTareasPlanificadas: total,
        tareasEjecutadas: completadas,
        tareasPendientes: total - completadas,
      };
    });

    res.status(200).json({
      success: true,
      message:
        'Reporte comparativo de proyectos planificados vs. ejecutados obtenido correctamente.',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 6. Reporte de Tareas Pendientes y Vencidas
 * Lista las tareas que están pendientes (no completadas) y cuya fecha de finalización es anterior al día de hoy.
 */
export const reportTareasPendientesVencidas = async (req, res, next) => {
  try {
    const today = dayjs().format('YYYY-MM-DD');

    const tasks = await Tarea.findAll({
      include: { model: Estado, attributes: ['NombreEstado'] },
      where: {
        FechaFin: {
          [Op.lt]: today,
        },
      },
    });

    const pendientesVencidas = tasks
      .filter((task) => {
        const estado = task.Estado
          ? task.Estado.NombreEstado.toUpperCase()
          : '';
        return estado !== 'FINALIZADO';
      })
      .map((task) => ({
        ...task.toJSON(),
        vencida: true,
      }));

    res.status(200).json({
      success: true,
      message:
        'Reporte de tareas pendientes y vencidas obtenido correctamente.',
      data: pendientesVencidas,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 8. Reporte de Proyectos por Estado
 * Agrupa los proyectos según su estado.
 */
export const reportProyectosPorEstado = async (req, res, next) => {
  try {
    const { estado } = req.query;

    let includeOptions = { model: Estado, attributes: ['NombreEstado'] };
    console.log(estado);
    if (estado) {
      includeOptions.where = { NombreEstado: estado };
    }

    const projects = await Proyecto.findAll({
      include: includeOptions,
    });

    const result = projects.map((project) => ({
      estado: project.Estado ? project.Estado.NombreEstado : 'SIN ESTADO',
      nombreProyecto: project.Nombre,
    }));

    res.status(200).json({
      success: true,
      message: 'Reporte de proyectos por estado obtenido correctamente.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 9. Reporte de Actividad en el Sistema
 * Muestra los eventos registrados en la Bitácora de Eventos.
 */
export const reportActividadSistema = async (req, res, next) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    let where = {};

    if (fechaInicio && fechaFin) {
      where = {
        Tiempo_evento: {
          [Op.between]: [
            dayjs(fechaInicio).format('YYYY-MM-DD'),
            dayjs(fechaFin).format('YYYY-MM-DD'),
          ],
        },
      };
    }

    const events = await BitacoraEventos.findAll({
      where,
      order: [['Tiempo_evento', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: 'Reporte de actividad en el sistema obtenido correctamente.',
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 10. Reporte de Tareas por Fecha de Vencimiento
 * Organiza las tareas según su fecha límite (FechaFin).
 */
export const reportTareasPorFechaVencimiento = async (req, res, next) => {
  try {
    const tasks = await Tarea.findAll({
      order: [['FechaFin', 'ASC']],
      include: { model: Estado, attributes: ['NombreEstado'] },
    });

    res.status(200).json({
      success: true,
      message:
        'Reporte de tareas por fecha de vencimiento obtenido correctamente.',
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reporte: Proyectos Activos vs Inactivos
 * Cuenta la cantidad de proyectos activos e inactivos.
 */
export const reportProyectosActivosVsInactivos = async (req, res, next) => {
  try {
    const activos = await Proyecto.count({ where: { Activo: true } });
    const inactivos = await Proyecto.count({ where: { Activo: false } });
    res.status(200).json({
      success: true,
      message:
        'Reporte de proyectos activos vs inactivos obtenido correctamente.',
      data: {
        activos,
        inactivos,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reporte: Tareas Activos vs Inactivos
 * Cuenta la cantidad de tareas activas e inactivas.
 */
export const reportTareasActivosVsInactivos = async (req, res, next) => {
  try {
    const activos = await Tarea.count({ where: { Activo: true } });
    const inactivos = await Tarea.count({ where: { Activo: false } });
    res.status(200).json({
      success: true,
      message: 'Reporte de tareas activos vs inactivos obtenido correctamente.',
      data: {
        activos,
        inactivos,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reporte: Usuarios Activos vs Inactivos
 * Cuenta la cantidad de usuarios activos e inactivos.
 */
export const reportUsuariosActivosVsInactivos = async (req, res, next) => {
  try {
    const activos = await Usuario.count({ where: { Activo: true } });
    const inactivos = await Usuario.count({ where: { Activo: false } });
    res.status(200).json({
      success: true,
      message:
        'Reporte de usuarios activos vs inactivos obtenido correctamente.',
      data: {
        activos,
        inactivos,
      },
    });
  } catch (error) {
    next(error);
  }
};
