import React from 'react';
import { ReportConfig } from './types';
import {
  getReportAvancePorProyectos,
  getReportFinancieroProyectos,
  getReportAsignacionRecursos,
  getReportCargaTrabajoPorMiembro,
  getReportComparativoProyectos,
  getReportTareasPendientesVencidas,
  getReportProyectosPorEstado,
  getReportActividadSistema,
  getReportTareasPorFechaVencimiento,
  getReportProyectosActivosVsInactivos,
  getReportTareasActivosVsInactivos,
  getReportUsuariosActivosVsInactivos,
} from '../../../../services/reportes';
import dayjs from 'dayjs';
import { BrandName } from '../../../../utils/strings';
import { useAuth } from '../../../../context';

export const AvanceReportPDFTemplate: React.FC<{ data: any[] }> = ({
  data,
}) => {
  const { currentUser } = useAuth();
  const currentDateTime = dayjs().format('DD/MM/YYYY HH:mm:ss A ');

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          color: '#333',
          padding: '10px',
        }}
      >
        <h2>{BrandName}</h2>
        <p>No se encontraron proyectos para mostrar.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        color: '#000',
        padding: '10px',
      }}
    >
      {/* ENCABEZADO */}
      <div
        style={{
          textAlign: 'center',
          padding: '20px',
          background: '#0b5a5e',
          marginBottom: '20px',
          color: '#fff',
        }}
      >
        <h3 style={{ margin: 0 }}>{BrandName}</h3>
        <h4 style={{ textDecoration: 'underline', marginTop: '10px' }}>
          REPORTE DE AVANCE POR PROYECTOS
        </h4>
      </div>

      {/* RESUMEN DEL REPORTE */}
      <h5 style={{ background: '#0b5a5e', color: '#fff', padding: '5px' }}>
        RESUMEN DEL REPORTE
      </h5>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '20px',
        }}
      >
        <tbody>
          <tr>
            <td
              style={{ width: '33%', border: '1px solid #000', padding: '5px' }}
            >
              Fecha del Reporte:
            </td>
            <td
              style={{ width: '33%', border: '1px solid #000', padding: '5px' }}
            >
              Nombre Responsable:
            </td>
            <td
              style={{ width: '34%', border: '1px solid #000', padding: '5px' }}
            >
              Total de Proyectos:
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {currentDateTime}
            </td>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {currentUser?.Nombre || 'Sin asignar'}
            </td>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {data.length}
            </td>
          </tr>
        </tbody>
      </table>

      <h5 style={{ background: '#0b5a5e', color: '#fff', padding: '5px' }}>
        AVANCE
      </h5>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: '5px' }}>
              ID Proyecto
            </th>
            <th style={{ border: '1px solid #000', padding: '5px' }}>
              Fecha Inicio Planeada
            </th>
            <th style={{ border: '1px solid #000', padding: '5px' }}>
              Fecha Fin Planeada
            </th>
            <th style={{ border: '1px solid #000', padding: '5px' }}>
              Avance Real
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((proyecto, index) => {
            const {
              idProyecto,
              FechaInicio = '',
              FechaFin = '',
              porcentajeFinalizacion = 0,
            } = proyecto;

            return (
              <tr key={index}>
                <td style={{ border: '1px solid #000', padding: '5px' }}>
                  {idProyecto}
                </td>
                <td style={{ border: '1px solid #000', padding: '5px' }}>
                  {FechaInicio}
                </td>
                <td style={{ border: '1px solid #000', padding: '5px' }}>
                  {FechaFin || 'Sin definir'}
                </td>
                <td style={{ border: '1px solid #000', padding: '5px' }}>
                  {porcentajeFinalizacion}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Sección opcional: PRESUPUESTO Y GASTO */}
      <h5
        style={{
          background: '#0b5a5e',
          color: '#fff',
          padding: '5px',
          marginTop: '10px',
        }}
      >
        PRESUPUESTO Y GASTO
      </h5>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: '5px' }}>
              ID Proyecto
            </th>
            <th style={{ border: '1px solid #000', padding: '5px' }}>
              Presupuesto
            </th>
            <th style={{ border: '1px solid #000', padding: '5px' }}>Costo</th>
          </tr>
        </thead>
        <tbody>
          {data.map((proyecto, index) => {
            const { idProyecto, presupuesto = 0, costoTotal = 0 } = proyecto;

            return (
              <tr key={index}>
                <td style={{ border: '1px solid #000', padding: '5px' }}>
                  {idProyecto}
                </td>
                <td style={{ border: '1px solid #000', padding: '5px' }}>
                  {presupuesto}
                </td>
                <td style={{ border: '1px solid #000', padding: '5px' }}>
                  {costoTotal}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/** Plantilla PDF para Reporte Financiero de Proyectos */
export const FinancieroReportPDFTemplate: React.FC<{ data: any[] }> = ({
  data,
}) => (
  <div>
    <h2>Reporte Financiero de Proyectos</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000' }}>ID Proyecto</th>
          <th style={{ border: '1px solid #000' }}>Nombre</th>
          <th style={{ border: '1px solid #000' }}>Presupuesto</th>
          <th style={{ border: '1px solid #000' }}>Costo Total</th>
          <th style={{ border: '1px solid #000' }}>Ajuste</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #000' }}>{row.idProyecto}</td>
            <td style={{ border: '1px solid #000' }}>{row.Nombre}</td>
            <td style={{ border: '1px solid #000' }}>{row.presupuesto}</td>
            <td style={{ border: '1px solid #000' }}>{row.costoTotal}</td>
            <td style={{ border: '1px solid #000' }}>
              {row.ajustePresupuesto}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Plantilla PDF para Reporte de Asignación de Recursos */
export const AsignacionRecursosPDFTemplate: React.FC<{ data: any[] }> = ({
  data,
}) => (
  <div>
    <h2>Reporte de Asignación de Recursos</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000' }}>ID Tarea</th>
          <th style={{ border: '1px solid #000' }}>Nombre Tarea</th>
          <th style={{ border: '1px solid #000' }}>Recursos</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #000' }}>{row.idTarea}</td>
            <td style={{ border: '1px solid #000' }}>{row.NombreTarea}</td>
            <td style={{ border: '1px solid #000' }}>
              {row.Recursos &&
                row.Recursos.map((r: any) => r.Nombre).join(', ')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Plantilla PDF para Reporte de Carga de Trabajo por Miembro */
export const CargaTrabajoPDFTemplate: React.FC<{ data: any[] }> = ({
  data,
}) => (
  <div>
    <h2>Reporte de Carga de Trabajo por Miembro</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000' }}>ID Usuario</th>
          <th style={{ border: '1px solid #000' }}>Nombre</th>
          <th style={{ border: '1px solid #000' }}>Total Tareas</th>
          <th style={{ border: '1px solid #000' }}>Completadas</th>
          <th style={{ border: '1px solid #000' }}>En Progreso</th>
          <th style={{ border: '1px solid #000' }}>Pendientes</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #000' }}>{row.idUsuario}</td>
            <td style={{ border: '1px solid #000' }}>{row.Nombre}</td>
            <td style={{ border: '1px solid #000' }}>{row.totalTareas}</td>
            <td style={{ border: '1px solid #000' }}>
              {row.tareasCompletadas}
            </td>
            <td style={{ border: '1px solid #000' }}>{row.tareasEnProgreso}</td>
            <td style={{ border: '1px solid #000' }}>{row.tareasPendientes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Plantilla PDF para Reporte Comparativo de Proyectos */
export const ComparativoPDFTemplate: React.FC<{ data: any[] }> = ({ data }) => (
  <div>
    <h2>Reporte Comparativo: Proyectos Planificados vs. Ejecutados</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000' }}>ID Proyecto</th>
          <th style={{ border: '1px solid #000' }}>Nombre</th>
          <th style={{ border: '1px solid #000' }}>Total Tareas</th>
          <th style={{ border: '1px solid #000' }}>Ejecutadas</th>
          <th style={{ border: '1px solid #000' }}>Pendientes</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #000' }}>{row.idProyecto}</td>
            <td style={{ border: '1px solid #000' }}>{row.Nombre}</td>
            <td style={{ border: '1px solid #000' }}>
              {row.totalTareasPlanificadas}
            </td>
            <td style={{ border: '1px solid #000' }}>{row.tareasEjecutadas}</td>
            <td style={{ border: '1px solid #000' }}>{row.tareasPendientes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Plantilla PDF para Reporte de Tareas Pendientes y Vencidas */
export const TareasPendientesPDFTemplate: React.FC<{ data: any[] }> = ({
  data,
}) => (
  <div>
    <h2>Reporte de Tareas Pendientes y Vencidas</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000' }}>ID Tarea</th>
          <th style={{ border: '1px solid #000' }}>Nombre</th>
          <th style={{ border: '1px solid #000' }}>Fecha Fin</th>
          <th style={{ border: '1px solid #000' }}>Vencida</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #000' }}>{row.idTarea}</td>
            <td style={{ border: '1px solid #000' }}>{row.Nombre}</td>
            <td style={{ border: '1px solid #000' }}>{row.FechaFin}</td>
            <td style={{ border: '1px solid #000' }}>
              {row.vencida ? 'Sí' : 'No'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Plantilla PDF para Reporte de Proyectos por Estado */
export const ProyectosEstadoPDFTemplate: React.FC<{ data: any[] }> = ({
  data,
}) => (
  <div>
    <h2>Reporte de Proyectos por Estado</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000' }}>Estado</th>
          <th style={{ border: '1px solid #000' }}>Proyectos</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #000' }}>{row.estado}</td>
            <td style={{ border: '1px solid #000' }}>{row.proyectos}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Plantilla PDF para Reporte de Actividad en el Sistema */
export const ActividadSistemaPDFTemplate: React.FC<{ data: any[] }> = ({
  data,
}) => (
  <div>
    <h2>Reporte de Actividad en el Sistema</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000' }}>ID Evento</th>
          <th style={{ border: '1px solid #000' }}>Tiempo</th>
          <th style={{ border: '1px solid #000' }}>Tabla</th>
          <th style={{ border: '1px solid #000' }}>Tipo</th>
          <th style={{ border: '1px solid #000' }}>Descripción</th>
          <th style={{ border: '1px solid #000' }}>ID Usuario</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #000' }}>{row.idEvento}</td>
            <td style={{ border: '1px solid #000' }}>{row.Tiempo_evento}</td>
            <td style={{ border: '1px solid #000' }}>{row.Tabla_afectada}</td>
            <td style={{ border: '1px solid #000' }}>{row.Tipo_evento}</td>
            <td style={{ border: '1px solid #000' }}>{row.Descripcion}</td>
            <td style={{ border: '1px solid #000' }}>{row.idUsuario}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Plantilla PDF para Reporte de Tareas por Fecha de Vencimiento */
export const TareasFechaPDFTemplate: React.FC<{ data: any[] }> = ({ data }) => (
  <div>
    <h2>Reporte de Tareas por Fecha de Vencimiento</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000' }}>ID Tarea</th>
          <th style={{ border: '1px solid #000' }}>Nombre</th>
          <th style={{ border: '1px solid #000' }}>Fecha Fin</th>
          <th style={{ border: '1px solid #000' }}>Estado</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #000' }}>{row.idTarea}</td>
            <td style={{ border: '1px solid #000' }}>{row.Nombre}</td>
            <td style={{ border: '1px solid #000' }}>{row.FechaFin}</td>
            <td style={{ border: '1px solid #000' }}>
              {row.Estado ? row.Estado.NombreEstado : ''}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Plantilla PDF para Reporte de Proyectos Activos vs Inactivos */
export const ProyectosActivosPDFTemplate: React.FC<{ data: any[] }> = ({
  data,
}) => (
  <div>
    <h2>Reporte de Proyectos Activos vs Inactivos</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000' }}>Proyectos Activos</th>
          <th style={{ border: '1px solid #000' }}>Proyectos Inactivos</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #000' }}>{row.activos}</td>
            <td style={{ border: '1px solid #000' }}>{row.inactivos}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Plantilla PDF para Reporte de Tareas Activas vs Inactivas */
export const TareasActivosPDFTemplate: React.FC<{ data: any[] }> = ({
  data,
}) => (
  <div>
    <h2>Reporte de Tareas Activas vs Inactivas</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000' }}>Tareas Activas</th>
          <th style={{ border: '1px solid #000' }}>Tareas Inactivas</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #000' }}>{row.activos}</td>
            <td style={{ border: '1px solid #000' }}>{row.inactivos}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Plantilla PDF para Reporte de Usuarios Activos vs Inactivos */
export const UsuariosActivosPDFTemplate: React.FC<{ data: any[] }> = ({
  data,
}) => (
  <div>
    <h2>Reporte de Usuarios Activos vs Inactivos</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000' }}>Usuarios Activos</th>
          <th style={{ border: '1px solid #000' }}>Usuarios Inactivos</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #000' }}>{row.activos}</td>
            <td style={{ border: '1px solid #000' }}>{row.inactivos}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Arreglo de configuraciones para los reportes */
export const reportConfigurations: ReportConfig[] = [
  {
    id: 'avance',
    label: 'Avance por Proyectos',
    filters: [
      { name: 'fechaInicio', label: 'Fecha de Inicio', type: 'date' },
      { name: 'fechaFin', label: 'Fecha de Fin', type: 'date' },
    ],
    tableColumns: [
      { header: 'ID Proyecto', accessor: 'idProyecto' },
      { header: 'Nombre', accessor: 'Nombre' },
      {
        header: 'Porcentaje Finalización',
        accessor: (row) => `${row.porcentajeFinalizacion}%`,
      },
    ],
    pdfTemplate: AvanceReportPDFTemplate,
    fetchData: async (filters: any): Promise<any[]> => {
      const response = await getReportAvancePorProyectos(filters);
      return response.data.data;
    },
  },
  {
    id: 'financiero',
    label: 'Financiero de Proyectos',
    filters: [],
    tableColumns: [
      { header: 'ID Proyecto', accessor: 'idProyecto' },
      { header: 'Nombre', accessor: 'Nombre' },
      { header: 'Presupuesto', accessor: 'presupuesto' },
      { header: 'Costo Total', accessor: 'costoTotal' },
      { header: 'Ajuste', accessor: 'ajustePresupuesto' },
    ],
    pdfTemplate: FinancieroReportPDFTemplate,
    fetchData: async (_filters: any): Promise<any[]> => {
      const response = await getReportFinancieroProyectos();
      return response.data.data;
    },
  },
  {
    id: 'asignacionRecursos',
    label: 'Asignación de Recursos',
    filters: [],
    tableColumns: [
      { header: 'ID Tarea', accessor: 'idTarea' },
      { header: 'Nombre Tarea', accessor: 'NombreTarea' },
      {
        header: 'Recursos',
        accessor: (row) =>
          row.Recursos ? row.Recursos.map((r: any) => r.Nombre).join(', ') : '',
      },
    ],
    pdfTemplate: AsignacionRecursosPDFTemplate,
    fetchData: async (_filters: any): Promise<any[]> => {
      const response = await getReportAsignacionRecursos();
      return response.data.data;
    },
  },
  {
    id: 'cargaTrabajo',
    label: 'Carga de Trabajo por Miembro',
    filters: [],
    tableColumns: [
      { header: 'ID Usuario', accessor: 'idUsuario' },
      { header: 'Nombre', accessor: 'Nombre' },
      { header: 'Total Tareas', accessor: 'totalTareas' },
      { header: 'Tareas Completadas', accessor: 'tareasCompletadas' },
      { header: 'Tareas en Progreso', accessor: 'tareasEnProgreso' },
      { header: 'Tareas Pendientes', accessor: 'tareasPendientes' },
    ],
    pdfTemplate: CargaTrabajoPDFTemplate,
    fetchData: async (_filters: any): Promise<any[]> => {
      const response = await getReportCargaTrabajoPorMiembro();
      return response.data.data;
    },
  },
  {
    id: 'comparativo',
    label: 'Comparativo Proyectos',
    filters: [],
    tableColumns: [
      { header: 'ID Proyecto', accessor: 'idProyecto' },
      { header: 'Nombre', accessor: 'Nombre' },
      { header: 'Total Tareas', accessor: 'totalTareasPlanificadas' },
      { header: 'Tareas Ejecutadas', accessor: 'tareasEjecutadas' },
      { header: 'Tareas Pendientes', accessor: 'tareasPendientes' },
    ],
    pdfTemplate: ComparativoPDFTemplate,
    fetchData: async (_filters: any): Promise<any[]> => {
      const response = await getReportComparativoProyectos();
      return response.data.data;
    },
  },
  {
    id: 'tareasPendientes',
    label: 'Tareas Pendientes y Vencidas',
    filters: [],
    tableColumns: [
      { header: 'ID Tarea', accessor: 'idTarea' },
      { header: 'Nombre', accessor: 'Nombre' },
      { header: 'Fecha Fin', accessor: 'FechaFin' },
      { header: 'Vencida', accessor: (row) => (row.vencida ? 'Sí' : 'No') },
    ],
    pdfTemplate: TareasPendientesPDFTemplate,
    fetchData: async (_filters: any): Promise<any[]> => {
      const response = await getReportTareasPendientesVencidas();
      return response.data.data;
    },
  },
  {
    id: 'proyectosEstado',
    label: 'Proyectos por Estado',
    filters: [
      { name: 'estado', label: 'Estado', type: 'text' }, // Puedes ajustar a 'select' si tienes opciones predefinidas.
    ],
    tableColumns: [
      { header: 'Estado', accessor: 'estado' },
      { header: 'Proyectos', accessor: 'proyectos' },
    ],
    pdfTemplate: ProyectosEstadoPDFTemplate,
    fetchData: async (filters: any): Promise<any[]> => {
      const response = await getReportProyectosPorEstado(filters.estado);
      // Si el endpoint retorna un objeto agrupado, lo transformamos en un array:
      const grouped = response.data.data;
      const arrayData = Object.entries(grouped).map(
        ([estado, proyectos]: [string, any]) => ({
          estado,
          proyectos: Array.isArray(proyectos)
            ? proyectos.map((p: any) => p.Nombre).join(', ')
            : '',
        })
      );
      return arrayData;
    },
  },
  {
    id: 'actividadSistema',
    label: 'Actividad en el Sistema',
    filters: [],
    tableColumns: [
      { header: 'ID Evento', accessor: 'idEvento' },
      { header: 'Tiempo', accessor: 'Tiempo_evento' },
      { header: 'Tabla', accessor: 'Tabla_afectada' },
      { header: 'Tipo', accessor: 'Tipo_evento' },
      { header: 'Descripción', accessor: 'Descripcion' },
      { header: 'ID Usuario', accessor: 'idUsuario' },
    ],
    pdfTemplate: ActividadSistemaPDFTemplate,
    fetchData: async (_filters: any): Promise<any[]> => {
      const response = await getReportActividadSistema();
      return response.data.data;
    },
  },
  {
    id: 'tareasFecha',
    label: 'Tareas por Fecha de Vencimiento',
    filters: [],
    tableColumns: [
      { header: 'ID Tarea', accessor: 'idTarea' },
      { header: 'Nombre', accessor: 'Nombre' },
      { header: 'Fecha Fin', accessor: 'FechaFin' },
      {
        header: 'Estado',
        accessor: (row) => (row.Estado ? row.Estado.NombreEstado : ''),
      },
    ],
    pdfTemplate: TareasFechaPDFTemplate,
    fetchData: async (_filters: any): Promise<any[]> => {
      const response = await getReportTareasPorFechaVencimiento();
      return response.data.data;
    },
  },
  {
    id: 'proyectosActivos',
    label: 'Proyectos Activos vs Inactivos',
    filters: [],
    tableColumns: [
      { header: 'Proyectos Activos', accessor: 'activos' },
      { header: 'Proyectos Inactivos', accessor: 'inactivos' },
    ],
    pdfTemplate: ProyectosActivosPDFTemplate,
    fetchData: async (_filters: any): Promise<any[]> => {
      const response = await getReportProyectosActivosVsInactivos();
      // Se espera que el endpoint retorne un objeto con { activos, inactivos }.
      return [response.data.data];
    },
  },
  {
    id: 'tareasActivos',
    label: 'Tareas Activas vs Inactivas',
    filters: [],
    tableColumns: [
      { header: 'Tareas Activas', accessor: 'activos' },
      { header: 'Tareas Inactivas', accessor: 'inactivos' },
    ],
    pdfTemplate: TareasActivosPDFTemplate,
    fetchData: async (_filters: any): Promise<any[]> => {
      const response = await getReportTareasActivosVsInactivos();
      return [response.data.data];
    },
  },
  {
    id: 'usuariosActivos',
    label: 'Usuarios Activos vs Inactivos',
    filters: [],
    tableColumns: [
      { header: 'Usuarios Activos', accessor: 'activos' },
      { header: 'Usuarios Inactivos', accessor: 'inactivos' },
    ],
    pdfTemplate: UsuariosActivosPDFTemplate,
    fetchData: async (_filters: any): Promise<any[]> => {
      const response = await getReportUsuariosActivosVsInactivos();
      return [response.data.data];
    },
  },
];
