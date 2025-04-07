import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table } from 'react-bootstrap';
import { PrivateLayout } from '../layouts/PrivateLayout';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectInput } from '../../components/Forms/SelectInput';
import { Input } from '../../components/Forms/Input';
import { z } from 'zod';
import dayjs from 'dayjs';

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
} from '../../services/reportes';
import { ReportModal } from '../../components';

const reportOptions = [
  { value: 'avance', label: 'Avance por Proyectos', filterType: 'dateRange' },
  { value: 'financiero', label: 'Financiero de Proyectos', filterType: 'none' },
  {
    value: 'asignacionRecursos',
    label: 'Asignación de Recursos',
    filterType: 'none',
  },
  {
    value: 'cargaTrabajo',
    label: 'Carga de Trabajo por Miembro',
    filterType: 'none',
  },
  { value: 'comparativo', label: 'Comparativo Proyectos', filterType: 'none' },
  {
    value: 'tareasPendientes',
    label: 'Tareas Pendientes y Vencidas',
    filterType: 'none',
  },
  {
    value: 'proyectosEstado',
    label: 'Proyectos por Estado',
    filterType: 'estado',
  },
  {
    value: 'actividadSistema',
    label: 'Actividad en el Sistema',
    filterType: 'none',
  },
  {
    value: 'tareasFecha',
    label: 'Tareas por Fecha de Vencimiento',
    filterType: 'none',
  },
  {
    value: 'proyectosActivoInactivo',
    label: 'Proyectos Activos vs Inactivos',
    filterType: 'none',
  },
  {
    value: 'tareasActivoInactivos',
    label: 'Tareas Activos vs Inactivos',
    filterType: 'none',
  },
  {
    value: 'usuariosActivoInactivos',
    label: 'Usuarios Activos vs Inactivos',
    filterType: 'none',
  },
];

const estadoOptions = [
  { value: '', label: 'Seleccione un estado...' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'en progreso', label: 'En Progreso' },
  { value: 'pendiente', label: 'Pendiente' },
];

const reportSchema = z.object({
  reporte: z.string().nonempty('Selecciona un reporte'),
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
  estado: z.string().optional(),
});

export const Reportes = () => {
  const methods = useForm({
    defaultValues: {
      reporte: reportOptions[0].value,
    },
    resolver: zodResolver(reportSchema),
    mode: 'onBlur',
  });
  const { handleSubmit, watch } = methods;

  const reporteValue = watch('reporte');
  const [results, setResults] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const rowsPerPage = 5;

  const currentReportOption = reportOptions.find(
    (option) => option.value === reporteValue
  );

  useEffect(() => {
    console.log('Reporte seleccionado:', reporteValue);
    setCurrentPage(1);
  }, [reporteValue]);

  const onSubmit = async (data: {
    reporte: string;
    fechaInicio?: string;
    fechaFin?: string;
    estado?: string;
  }) => {
    try {
      let response;
      switch (data.reporte) {
        case 'avance':
          response = await getReportAvancePorProyectos({
            fechaInicio: data.fechaInicio
              ? dayjs(data.fechaInicio).format('YYYY-MM-DD')
              : undefined,
            fechaFin: data.fechaFin
              ? dayjs(data.fechaFin).format('YYYY-MM-DD')
              : undefined,
          });
          break;
        case 'financiero':
          response = await getReportFinancieroProyectos();
          break;
        case 'asignacionRecursos':
          response = await getReportAsignacionRecursos();
          break;
        case 'cargaTrabajo':
          response = await getReportCargaTrabajoPorMiembro();
          break;
        case 'comparativo':
          response = await getReportComparativoProyectos();
          break;
        case 'tareasPendientes':
          response = await getReportTareasPendientesVencidas();
          break;
        case 'proyectosEstado':
          response = await getReportProyectosPorEstado(data.estado);
          break;
        case 'actividadSistema':
          response = await getReportActividadSistema();
          break;
        case 'tareasFecha':
          response = await getReportTareasPorFechaVencimiento();
          break;
        case 'proyectosActivoInactivo':
          response = await getReportProyectosActivosVsInactivos();
          break;
        case 'tareasActivoInactivos':
          response = await getReportTareasActivosVsInactivos();
          break;
        case 'usuariosActivoInactivos':
          response = await getReportUsuariosActivosVsInactivos();
          break;
        default:
          console.log('No se definió un servicio para el reporte seleccionado');
      }

      if (response && response.data) {
        setResults(response.data.data || []);
      }
    } catch (error) {
      console.error('Error al obtener el reporte:', error);
    }
  };

  const totalPages = Math.ceil(results.length / rowsPerPage);
  const displayedResults = results.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const columns =
    results.length > 0 ? Object.keys(results[0]) : ['No hay datos'];

  return (
    <PrivateLayout>
      <div className="p-2">
        <Card className="shadow-sm p-3 mb-3">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row className="align-items-center">
                <Col md={4}>
                  <SelectInput
                    name="reporte"
                    label="Reporte"
                    options={reportOptions.map(({ value, label }) => ({
                      value,
                      label,
                    }))}
                  />
                </Col>

                {currentReportOption?.filterType === 'dateRange' && (
                  <>
                    <Col md={4}>
                      <Input
                        name="fechaInicio"
                        label="Fecha de Inicio"
                        type="date"
                        placeholder="Selecciona la fecha de inicio"
                      />
                    </Col>
                    <Col md={4}>
                      <Input
                        name="fechaFin"
                        label="Fecha de Fin"
                        type="date"
                        placeholder="Selecciona la fecha final"
                      />
                    </Col>
                  </>
                )}

                {currentReportOption?.filterType === 'estado' && (
                  <Col md={4}>
                    <SelectInput
                      name="estado"
                      label="Estado"
                      options={estadoOptions}
                    />
                  </Col>
                )}

                <Col md="auto">
                  <Button
                    type="submit"
                    variant="info"
                    className="text-white me-2"
                  >
                    Consultar
                  </Button>
                  <Button
                    variant="success"
                    className="text-white"
                    onClick={() => setShowModal(true)}
                    type="button"
                  >
                    Generar Reporte
                  </Button>
                </Col>
              </Row>
            </form>
          </FormProvider>
        </Card>

        <Row>
          <Col md={12}>
            <Card className="mb-4 shadow-sm">
              <Card.Header>
                <strong>Resultados del Reporte</strong>
              </Card.Header>
              <Card.Body style={{ maxHeight: '320px', overflowY: 'auto' }}>
                <Table className="table-sm" striped bordered hover responsive>
                  <thead>
                    <tr>
                      {columns.map((col, idx) => (
                        <th key={idx}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayedResults.length > 0 ? (
                      displayedResults.map((item, index) => (
                        <tr key={index}>
                          {columns.map((col, idx) => (
                            <td key={idx}>{item[col]}</td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length} className="text-center">
                          Sin resultados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    Mostrando {(currentPage - 1) * rowsPerPage + 1} a{' '}
                    {Math.min(currentPage * rowsPerPage, results.length)} de{' '}
                    {results.length} elementos
                  </span>
                  <div>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-1 text-primary"
                      onClick={() =>
                        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                      }
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-info"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          prev < totalPages ? prev + 1 : prev
                        )
                      }
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <ReportModal
          show={showModal}
          onHide={() => setShowModal(false)}
          title="Reporte Generado"
        >
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Table className="table-sm" striped bordered hover responsive>
              <thead>
                <tr>
                  {columns.map((col, idx) => (
                    <th key={idx}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? (
                  results.map((item, index) => (
                    <tr key={index}>
                      {columns.map((col, idx) => (
                        <td key={idx}>{item[col]}</td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center">
                      Sin resultados
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </ReportModal>
      </div>
    </PrivateLayout>
  );
};
