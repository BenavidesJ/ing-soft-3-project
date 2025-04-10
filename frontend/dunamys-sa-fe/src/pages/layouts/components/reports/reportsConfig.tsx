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
import { PaginatedPDFTemplate } from './PaginatedPDFTemplate';

const getHeader = (title: string, length: number) => {
  const { currentUser } = useAuth();
  const currentDateTime = dayjs().format('DD/MM/YYYY hh:mm:ss A');
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '10px',
        background: '#0b5a5e',
        color: '#fff',
      }}
    >
      <h3 style={{ margin: 0 }}>{BrandName}</h3>
      <h4 style={{ textDecoration: 'underline', marginTop: '5px' }}>{title}</h4>
      <div style={{ marginTop: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td
                style={{
                  width: '33%',
                  border: '1px solid #000',
                  padding: '5px',
                }}
              >
                Fecha del Reporte:
              </td>
              <td
                style={{
                  width: '33%',
                  border: '1px solid #000',
                  padding: '5px',
                }}
              >
                Nombre Responsable:
              </td>
              <td
                style={{
                  width: '34%',
                  border: '1px solid #000',
                  padding: '5px',
                }}
              >
                Total de Registros:
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
                {length}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AvanceReportPDFTemplate: React.FC<any> = ({ data }) => {
  const itemsPerPage = 4;

  // Función para renderizar el contenido (tabla) para cada página
  const renderPageContent = (pageData: any[]) => {
    return (
      <>
        <div style={{ marginTop: '10mm' }}>
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
              {pageData.map((proyecto, index) => {
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
        </div>

        <div style={{ marginTop: '10mm' }}>
          <h5 style={{ background: '#0b5a5e', color: '#fff', padding: '5px' }}>
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
                <th style={{ border: '1px solid #000', padding: '5px' }}>
                  Costo
                </th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((proyecto, index) => {
                const {
                  idProyecto,
                  presupuesto = 0,
                  costoTotal = 0,
                } = proyecto;
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
      </>
    );
  };

  // Footer se define en el componente PDFPage (se usa su default o se puede pasar mediante prop)
  const footer = (pageNumber: number, totalPages: number) => (
    <div>
      Pag {pageNumber}/{totalPages}
    </div>
  );

  return (
    <PaginatedPDFTemplate
      data={data}
      itemsPerPage={itemsPerPage}
      renderPageContent={renderPageContent}
      header={getHeader('REPORTE DE AVANCE POR PROYECTOS', data.length)}
      footer={footer}
    />
  );
};

/** Plantilla PDF para Reporte Financiero de Proyectos */
export const FinancieroReportPDFTemplate: React.FC<any> = ({ data }) => {
  const itemsPerPage = 4;

  // La función que renderiza el contenido de cada página (tabla con 4 registros)
  const renderPageContent = (pageData: any[]) => {
    return (
      <div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #000', padding: '5px' }}>
                ID Proyecto
              </th>
              <th style={{ border: '1px solid #000', padding: '5px' }}>
                Nombre
              </th>
              <th style={{ border: '1px solid #000', padding: '5px' }}>
                Presupuesto
              </th>
              <th style={{ border: '1px solid #000', padding: '5px' }}>
                Costo Total
              </th>
              <th style={{ border: '1px solid #000', padding: '5px' }}>
                Ajuste
              </th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #000', padding: '5px' }}>
                  {row.idProyecto}
                </td>
                <td style={{ border: '1px solid #000', padding: '5px' }}>
                  {row.Nombre}
                </td>
                <td style={{ border: '1px solid #000', padding: '5px' }}>
                  {row.presupuesto}
                </td>
                <td style={{ border: '1px solid #000', padding: '5px' }}>
                  {row.costoTotal}
                </td>
                <td style={{ border: '1px solid #000', padding: '5px' }}>
                  {row.ajustePresupuesto}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Footer puede definirse de forma simple
  const footer = (pageNumber: number, totalPages: number) => (
    <div style={{ textAlign: 'right' }}>
      Pag {pageNumber}/{totalPages}
    </div>
  );

  return (
    <PaginatedPDFTemplate
      data={data}
      itemsPerPage={itemsPerPage}
      renderPageContent={renderPageContent}
      header={getHeader('REPORTE FINANCIERO', data.length)}
      footer={footer}
    />
  );
};

/** Plantilla PDF para Reporte de Asignación de Recursos */
export const AsignacionRecursosPDFTemplate: React.FC<any> = ({ data }) => {
  const itemsPerPage = 4;
  const header = getHeader('REPORTE DE ASIGNACIÓN DE RECURSOS', data.length);

  const renderPageContent = (pageData: any[]) => {
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: '5px' }}>
              ID Tarea
            </th>
            <th style={{ border: '1px solid #000', padding: '5px' }}>
              Nombre Tarea
            </th>
            <th style={{ border: '1px solid #000', padding: '5px' }}>
              Recursos
            </th>
          </tr>
        </thead>
        <tbody>
          {pageData.map((row, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #000', padding: '5px' }}>
                {row.idTarea}
              </td>
              <td style={{ border: '1px solid #000', padding: '5px' }}>
                {row.NombreTarea}
              </td>
              <td style={{ border: '1px solid #000', padding: '5px' }}>
                {row.Recursos
                  ? row.Recursos.map((r: any) => r.Nombre).join(', ')
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const footer = (pageNumber: number, totalPages: number) => (
    <div style={{ textAlign: 'right' }}>
      Pag {pageNumber}/{totalPages}
    </div>
  );

  return (
    <PaginatedPDFTemplate
      data={data}
      itemsPerPage={itemsPerPage}
      renderPageContent={renderPageContent}
      header={header}
      footer={footer}
    />
  );
};
/** Plantilla PDF para Reporte de Carga de Trabajo por Miembro */
export const CargaTrabajoPDFTemplate: React.FC<any> = ({ data }) => {
  const itemsPerPage = 4;
  const header = getHeader(
    'REPORTE DE CARGA DE TRABAJO POR MIEMBRO',
    data.length
  );

  const renderPageContent = (pageData: any[]) => {
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: '5px' }}>
              ID Usuario
            </th>
            <th style={{ border: '1px solid #000', padding: '5px' }}>Nombre</th>
            <th style={{ border: '1px solid #000', padding: '5px' }}>
              Total Tareas
            </th>
            <th style={{ border: '1px solid #000', padding: '5px' }}>
              Completadas
            </th>
            <th style={{ border: '1px solid #000', padding: '5px' }}>
              En Progreso
            </th>
            <th style={{ border: '1px solid #000', padding: '5px' }}>
              Pendientes
            </th>
          </tr>
        </thead>
        <tbody>
          {pageData.map((row, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #000', padding: '5px' }}>
                {row.idUsuario}
              </td>
              <td style={{ border: '1px solid #000', padding: '5px' }}>
                {row.Nombre}
              </td>
              <td style={{ border: '1px solid #000', padding: '5px' }}>
                {row.totalTareas}
              </td>
              <td style={{ border: '1px solid #000', padding: '5px' }}>
                {row.tareasCompletadas}
              </td>
              <td style={{ border: '1px solid #000', padding: '5px' }}>
                {row.tareasEnProgreso}
              </td>
              <td style={{ border: '1px solid #000', padding: '5px' }}>
                {row.tareasPendientes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const footer = (pageNumber: number, totalPages: number) => (
    <div style={{ textAlign: 'right' }}>
      Pag {pageNumber}/{totalPages}
    </div>
  );

  return (
    <PaginatedPDFTemplate
      data={data}
      itemsPerPage={itemsPerPage}
      renderPageContent={renderPageContent}
      header={header}
      footer={footer}
    />
  );
};

/** Plantilla PDF para Reporte Comparativo de Proyectos */
export const ComparativoPDFTemplate: React.FC<any> = ({ data }) => {
  const itemsPerPage = 4;

  // Genera el header reutilizable usando la función getHeader
  const header = getHeader(
    'REPORTE COMPARATIVO: PROYECTOS PLANIFICADOS VS. EJECUTADOS',
    data.length
  );

  // Función que renderiza la tabla con los registros de cada página
  const renderPageContent = (pageData: any[]) => {
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: '5px' }}>
              ID Proyecto
            </th>
            <th style={{ border: '1px solid #000', padding: '5px' }}>Nombre</th>
            <th style={{ border: '1px solid #000', padding: '5px' }}>
              Total Tareas
            </th>
            <th style={{ border: '1px solid #000', padding: '5px' }}>
              Ejecutadas
            </th>
            <th style={{ border: '1px solid #000', padding: '5px' }}>
              Pendientes
            </th>
          </tr>
        </thead>
        <tbody>
          {pageData.map((row, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #000', padding: '5px' }}>
                {row.idProyecto}
              </td>
              <td style={{ border: '1px solid #000', padding: '5px' }}>
                {row.Nombre}
              </td>
              <td style={{ border: '1px solid #000', padding: '5px' }}>
                {row.totalTareasPlanificadas}
              </td>
              <td style={{ border: '1px solid #000', padding: '5px' }}>
                {row.tareasEjecutadas}
              </td>
              <td style={{ border: '1px solid #000', padding: '5px' }}>
                {row.tareasPendientes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Definición sencilla del footer
  const footer = (pageNumber: number, totalPages: number) => (
    <div style={{ textAlign: 'right' }}>
      Pag {pageNumber}/{totalPages}
    </div>
  );

  return (
    <PaginatedPDFTemplate
      data={data}
      itemsPerPage={itemsPerPage}
      renderPageContent={renderPageContent}
      header={header}
      footer={footer}
    />
  );
};

/** Plantilla PDF para Reporte de Tareas Pendientes y Vencidas */
export const TareasPendientesPDFTemplate: React.FC<any> = ({ data }) => {
  const itemsPerPage = 4;
  const header = getHeader(
    'REPORTE DE TAREAS PENDIENTES Y VENCIDAS',
    data.length
  );

  const renderPageContent = (pageData: any[]) => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000', padding: '5px' }}>ID Tarea</th>
          <th style={{ border: '1px solid #000', padding: '5px' }}>Nombre</th>
          <th style={{ border: '1px solid #000', padding: '5px' }}>
            Fecha Fin
          </th>
          <th style={{ border: '1px solid #000', padding: '5px' }}>Vencida</th>
        </tr>
      </thead>
      <tbody>
        {pageData.map((row, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.idTarea}
            </td>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.Nombre}
            </td>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.FechaFin}
            </td>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.vencida ? 'Sí' : 'No'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const footer = (pageNumber: number, totalPages: number) => (
    <div style={{ textAlign: 'right' }}>
      Pag {pageNumber}/{totalPages}
    </div>
  );

  return (
    <PaginatedPDFTemplate
      data={data}
      itemsPerPage={itemsPerPage}
      renderPageContent={renderPageContent}
      header={header}
      footer={footer}
    />
  );
};

/** Plantilla PDF para Reporte de Proyectos por Estado */
export const ProyectosEstadoPDFTemplate: React.FC<any> = ({ data }) => {
  const itemsPerPage = 4;
  const header = getHeader('REPORTE DE PROYECTOS POR ESTADO', data.length);

  const renderPageContent = (pageData: any[]) => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000', padding: '5px' }}>Estado</th>
          <th style={{ border: '1px solid #000', padding: '5px' }}>Proyecto</th>
        </tr>
      </thead>
      <tbody>
        {pageData.map((row, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.estado}
            </td>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.nombreProyecto}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const footer = (pageNumber: number, totalPages: number) => (
    <div style={{ textAlign: 'right' }}>
      Pag {pageNumber}/{totalPages}
    </div>
  );

  return (
    <PaginatedPDFTemplate
      data={data}
      itemsPerPage={itemsPerPage}
      renderPageContent={renderPageContent}
      header={header}
      footer={footer}
    />
  );
};

/** Plantilla PDF para Reporte de Actividad en el Sistema */
export const ActividadSistemaPDFTemplate: React.FC<any> = ({ data }) => {
  const itemsPerPage = 4;

  // Genera el header usando getHeader
  const header = getHeader('REPORTE DE ACTIVIDAD EN EL SISTEMA', data.length);

  // Función para renderizar la tabla con los datos de cada página
  const renderPageContent = (pageData: any[]) => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000', padding: '5px' }}>
            ID Evento
          </th>
          <th style={{ border: '1px solid #000', padding: '5px' }}>Tiempo</th>
          <th style={{ border: '1px solid #000', padding: '5px' }}>Tabla</th>
          <th style={{ border: '1px solid #000', padding: '5px' }}>Tipo</th>
          <th style={{ border: '1px solid #000', padding: '5px' }}>
            Descripción
          </th>
          <th style={{ border: '1px solid #000', padding: '5px' }}>
            ID Usuario
          </th>
        </tr>
      </thead>
      <tbody>
        {pageData.map((row, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.idEvento}
            </td>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.Tiempo_evento}
            </td>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.Tabla_afectada}
            </td>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.Tipo_evento}
            </td>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.Descripcion}
            </td>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.idUsuario}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Footer simple
  const footer = (pageNumber: number, totalPages: number) => (
    <div style={{ textAlign: 'right' }}>
      Pag {pageNumber}/{totalPages}
    </div>
  );

  return (
    <PaginatedPDFTemplate
      data={data}
      itemsPerPage={itemsPerPage}
      renderPageContent={renderPageContent}
      header={header}
      footer={footer}
    />
  );
};

/** Plantilla PDF para Reporte de Tareas por Fecha de Vencimiento */
export const TareasFechaPDFTemplate: React.FC<any> = ({ data }) => {
  const itemsPerPage = 4;

  const header = getHeader(
    'REPORTE DE TAREAS POR FECHA DE VENCIMIENTO',
    data.length
  );

  const renderPageContent = (pageData: any[]) => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000', padding: '5px' }}>ID Tarea</th>
          <th style={{ border: '1px solid #000', padding: '5px' }}>Nombre</th>
          <th style={{ border: '1px solid #000', padding: '5px' }}>
            Fecha Fin
          </th>
          <th style={{ border: '1px solid #000', padding: '5px' }}>Estado</th>
        </tr>
      </thead>
      <tbody>
        {pageData.map((row, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.idTarea}
            </td>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.Nombre}
            </td>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.FechaFin}
            </td>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.Estado ? row.Estado.NombreEstado : ''}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const footer = (pageNumber: number, totalPages: number) => (
    <div style={{ textAlign: 'right' }}>
      Pag {pageNumber}/{totalPages}
    </div>
  );

  return (
    <PaginatedPDFTemplate
      data={data}
      itemsPerPage={itemsPerPage}
      renderPageContent={renderPageContent}
      header={header}
      footer={footer}
    />
  );
};

/** Plantilla PDF para Reporte de Proyectos Activos vs Inactivos */
export const ProyectosActivosPDFTemplate: React.FC<any> = ({ data }) => {
  const itemsPerPage = 4;
  const header = getHeader(
    'REPORTE DE PROYECTOS ACTIVOS VS INACTIVOS',
    data.length
  );

  const renderPageContent = (pageData: any[]) => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000', padding: '5px' }}>
            Proyectos Activos
          </th>
          <th style={{ border: '1px solid #000', padding: '5px' }}>
            Proyectos Inactivos
          </th>
        </tr>
      </thead>
      <tbody>
        {pageData.map((row, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.activos}
            </td>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.inactivos}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const footer = (pageNumber: number, totalPages: number) => (
    <div style={{ textAlign: 'right' }}>
      Pag {pageNumber}/{totalPages}
    </div>
  );

  return (
    <PaginatedPDFTemplate
      data={data}
      itemsPerPage={itemsPerPage}
      renderPageContent={renderPageContent}
      header={header}
      footer={footer}
    />
  );
};

/** Plantilla PDF para Reporte de Tareas Activas vs Inactivas */
export const TareasActivosPDFTemplate: React.FC<any> = ({ data }) => {
  const itemsPerPage = 4;
  const header = getHeader(
    'REPORTE DE TAREAS ACTIVAS VS INACTIVAS',
    data.length
  );

  const renderPageContent = (pageData: any[]) => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000', padding: '5px' }}>
            Tareas Activas
          </th>
          <th style={{ border: '1px solid #000', padding: '5px' }}>
            Tareas Inactivas
          </th>
        </tr>
      </thead>
      <tbody>
        {pageData.map((row, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.activos}
            </td>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.inactivos}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const footer = (pageNumber: number, totalPages: number) => (
    <div style={{ textAlign: 'right' }}>
      Pag {pageNumber}/{totalPages}
    </div>
  );

  return (
    <PaginatedPDFTemplate
      data={data}
      itemsPerPage={itemsPerPage}
      renderPageContent={renderPageContent}
      header={header}
      footer={footer}
    />
  );
};

/** Plantilla PDF para Reporte de Usuarios Activos vs Inactivos */
export const UsuariosActivosPDFTemplate: React.FC<any> = ({ data }) => {
  const itemsPerPage = 4;
  const header = getHeader(
    'REPORTE DE USUARIOS ACTIVOS VS INACTIVOS',
    data.length
  );

  const renderPageContent = (pageData: any[]) => (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #000', padding: '5px' }}>
            Usuarios Activos
          </th>
          <th style={{ border: '1px solid #000', padding: '5px' }}>
            Usuarios Inactivos
          </th>
        </tr>
      </thead>
      <tbody>
        {pageData.map((row, i) => (
          <tr key={i}>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.activos}
            </td>
            <td style={{ border: '1px solid #000', padding: '5px' }}>
              {row.inactivos}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const footer = (pageNumber: number, totalPages: number) => (
    <div style={{ textAlign: 'right' }}>
      Pag {pageNumber}/{totalPages}
    </div>
  );

  return (
    <PaginatedPDFTemplate
      data={data}
      itemsPerPage={itemsPerPage}
      renderPageContent={renderPageContent}
      header={header}
      footer={footer}
    />
  );
};

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
    filters: [
      { name: 'fechaInicio', label: 'Fecha de Inicio', type: 'date' },
      { name: 'fechaFin', label: 'Fecha de Fin', type: 'date' },
    ],
    tableColumns: [
      { header: 'ID Proyecto', accessor: 'idProyecto' },
      { header: 'Nombre', accessor: 'Nombre' },
      { header: 'Presupuesto', accessor: 'presupuesto' },
      { header: 'Costo Total', accessor: 'costoTotal' },
      { header: 'Ajuste', accessor: 'ajustePresupuesto' },
    ],
    pdfTemplate: FinancieroReportPDFTemplate,
    fetchData: async (filters: any): Promise<any[]> => {
      const response = await getReportFinancieroProyectos(filters);
      return response.data.data;
    },
  },
  {
    id: 'asignacionRecursos',
    label: 'Asignación de Recursos',
    filters: [
      { name: 'fechaInicio', label: 'Fecha de Inicio', type: 'date' },
      { name: 'fechaFin', label: 'Fecha de Fin', type: 'date' },
    ],
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
    fetchData: async (filters: any): Promise<any[]> => {
      const response = await getReportAsignacionRecursos(filters);
      return response.data.data;
    },
  },
  {
    id: 'cargaTrabajo',
    label: 'Carga de Trabajo por Miembro',
    filters: [
      { name: 'fechaInicio', label: 'Fecha de Inicio', type: 'date' },
      { name: 'fechaFin', label: 'Fecha de Fin', type: 'date' },
    ],
    tableColumns: [
      { header: 'ID Usuario', accessor: 'idUsuario' },
      { header: 'Nombre', accessor: 'Nombre' },
      { header: 'Total Tareas', accessor: 'totalTareas' },
      { header: 'Tareas Completadas', accessor: 'tareasCompletadas' },
      { header: 'Tareas en Progreso', accessor: 'tareasEnProgreso' },
      { header: 'Tareas Pendientes', accessor: 'tareasPendientes' },
    ],
    pdfTemplate: CargaTrabajoPDFTemplate,
    fetchData: async (filters: any): Promise<any[]> => {
      const response = await getReportCargaTrabajoPorMiembro(filters);
      return response.data.data;
    },
  },
  {
    id: 'comparativo',
    label: 'Comparativo Proyectos',
    filters: [
      { name: 'fechaInicio', label: 'Fecha de Inicio', type: 'date' },
      { name: 'fechaFin', label: 'Fecha de Fin', type: 'date' },
    ],
    tableColumns: [
      { header: 'ID Proyecto', accessor: 'idProyecto' },
      { header: 'Nombre', accessor: 'Nombre' },
      { header: 'Total Tareas', accessor: 'totalTareasPlanificadas' },
      { header: 'Tareas Ejecutadas', accessor: 'tareasEjecutadas' },
      { header: 'Tareas Pendientes', accessor: 'tareasPendientes' },
    ],
    pdfTemplate: ComparativoPDFTemplate,
    fetchData: async (filters: any): Promise<any[]> => {
      const response = await getReportComparativoProyectos(filters);
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
    filters: [{ name: 'estado', label: 'Estado', type: 'text' }],
    tableColumns: [
      { header: 'Estado', accessor: 'estado' },
      { header: 'Proyecto', accessor: 'nombreProyecto' },
    ],
    pdfTemplate: ProyectosEstadoPDFTemplate,
    fetchData: async (filters: any): Promise<any[]> => {
      const response = await getReportProyectosPorEstado(filters.estado);
      console.log(response.data.data);
      const grouped = response.data.data;

      return grouped;
    },
  },
  {
    id: 'actividadSistema',
    label: 'Actividad en el Sistema',
    filters: [
      { name: 'fechaInicio', label: 'Fecha de Inicio', type: 'date' },
      { name: 'fechaFin', label: 'Fecha de Fin', type: 'date' },
    ],
    tableColumns: [
      { header: 'ID Evento', accessor: 'idEvento' },
      { header: 'Tiempo', accessor: 'Tiempo_evento' },
      { header: 'Tabla', accessor: 'Tabla_afectada' },
      { header: 'Tipo', accessor: 'Tipo_evento' },
      { header: 'Descripción', accessor: 'Descripcion' },
      { header: 'ID Usuario', accessor: 'idUsuario' },
    ],
    pdfTemplate: ActividadSistemaPDFTemplate,
    fetchData: async (filters: any): Promise<any[]> => {
      const response = await getReportActividadSistema(filters);
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
