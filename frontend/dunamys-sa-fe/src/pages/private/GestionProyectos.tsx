import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Table,
  Modal,
  Card,
  Form as BSForm,
} from 'react-bootstrap';
import { PrivateLayout } from '../layouts/PrivateLayout';
import {
  Form as CustomForm,
  Input,
  SubmitButton,
  SelectInput,
  MoneyInput,
} from '../../components/Forms';
import { ConfirmModal, EstadoBadges } from '../../components';
import { z } from 'zod';
import {
  getAllProyectos,
  createProyecto,
  updateProyecto,
  deleteProyecto,
  assignTaskToProject,
} from '../../services/proyecto';
import { getAllEstados } from '../../services/estado';
import { getAllTareas } from '../../services/tarea';
import { Proyecto, Tarea } from '../../services/types';
import { useLoading } from '../../context/LoadingContext';
import dayjs from 'dayjs';
import { formatCurrency } from '../../utils/formatCurrency';

const projectSchema = z.object({
  Nombre: z.string().min(1, 'El nombre es obligatorio'),
  Descripcion: z.string().min(1, 'La descripción es obligatoria'),
  Objetivo: z.string().min(1, 'El objetivo es obligatorio'),
  FechaInicio: z.string().min(1, 'La fecha de inicio es obligatoria'),
  FechaFin: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  Presupuesto: z.preprocess(
    (val) => Number(val),
    z.number({ invalid_type_error: 'El presupuesto debe ser un número' })
  ),
  Status: z.string().default('Pendiente'),
});

export const GestionProyectos = () => {
  const [projects, setProjects] = useState<Proyecto[]>([]);
  const [estados, setEstados] = useState<any[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Proyecto | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(
    null
  );

  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  const { setLoading } = useLoading();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getAllProyectos();
      setProjects(response.data.data || []);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEstados = async () => {
    try {
      const response = await getAllEstados();
      setEstados(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar los estados', error);
    }
  };

  const fetchTareas = async () => {
    try {
      const response = await getAllTareas();
      setTareas(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar las tareas', error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchEstados();
    fetchTareas();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));

    setSelectedTasks([]);
  };

  const handleOpenModal = (project?: Proyecto) => {
    setEditingProject(project || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      if (data.FechaInicio) {
        data.FechaInicio = dayjs(data.FechaInicio, 'DD/MM/YYYY').format(
          'DD/MM/YYYY'
        );
      }
      if (data.FechaFin) {
        data.FechaFin = dayjs(data.FechaFin, 'DD/MM/YYYY').format('DD/MM/YYYY');
      } else {
        data.FechaFin = null;
      }

      if (editingProject) {
        await updateProyecto({
          idProyecto: editingProject.idProyecto,
          ...data,
        });
      } else {
        await createProyecto({ ...data, Status: 'Pendiente' });
      }
      await fetchProjects();
      handleCloseModal();
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (idProyecto: number) => {
    setProjectToDelete(idProyecto);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProject = async () => {
    if (projectToDelete !== null) {
      try {
        setLoading(true);
        await deleteProyecto(projectToDelete);
        await fetchProjects();
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    setShowDeleteConfirm(false);
    setProjectToDelete(null);
  };

  const cancelDeleteProject = () => {
    setShowDeleteConfirm(false);
    setProjectToDelete(null);
  };

  const handleTaskCheck = (taskId: number) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const handleAssignTasks = async (projectId: number) => {
    try {
      setLoading(true);

      await assignTaskToProject({
        idProyecto: projectId,
        idTareas: selectedTasks,
      });
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateLayout>
      <div className="p-3">
        <h2>Gestión de Proyectos</h2>
        <Button
          variant="primary"
          className="mb-3"
          onClick={() => handleOpenModal()}
        >
          Agregar Proyecto
        </Button>

        {projects.length === 0 ? (
          <Alert variant="info">No hay proyectos disponibles.</Alert>
        ) : (
          <Table
            striped
            bordered
            hover
            responsive
            className="table-sm text-center align-middle"
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Objetivo</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Presupuesto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) =>
                project.Activo ? (
                  <React.Fragment key={project.idProyecto}>
                    <tr
                      onClick={() => toggleExpand(project.idProyecto)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{project.idProyecto}</td>
                      <td>{project.Nombre}</td>
                      <td>{project.Descripcion}</td>
                      <td>{project.Objetivo}</td>
                      <td>{dayjs(project.FechaInicio).format('DD/MM/YYYY')}</td>
                      <td>
                        {project.FechaFin
                          ? dayjs(project.FechaFin).format('DD/MM/YYYY')
                          : '-'}
                      </td>
                      <td>{formatCurrency(project.Presupuesto)}</td>
                      <td>
                        <EstadoBadges estadoId={project.idEstado} />
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="info"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(project);
                          }}
                        >
                          Editar
                        </Button>{' '}
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(project.idProyecto);
                          }}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>

                    {expandedProjectId === project.idProyecto && (
                      <tr>
                        <td colSpan={9}>
                          <Card
                            className="mb-3 shadow-sm"
                            style={{
                              backgroundColor: '#f0f0f0f0',
                              borderRadius: '8px',
                              border: 'none',
                            }}
                          >
                            <Card.Body>
                              <Card.Title>Detalles del Proyecto</Card.Title>
                              <Card.Text>
                                <strong>Objetivo:</strong> {project.Objetivo}
                              </Card.Text>
                              <Card.Text>
                                <strong>Presupuesto:</strong>{' '}
                                {formatCurrency(project.Presupuesto)}
                              </Card.Text>

                              <hr />
                              <h6>Asignar Tareas a este Proyecto</h6>
                              <p
                                className="text-muted"
                                style={{ fontSize: 14 }}
                              >
                                Selecciona las tareas que quieras asignar y haz
                                clic en "Asignar".
                              </p>

                              <div
                                style={{
                                  maxHeight: '200px',
                                  overflowY: 'auto',
                                }}
                              >
                                {tareas.length === 0 ? (
                                  <p>No hay tareas disponibles.</p>
                                ) : (
                                  tareas.map((task) => (
                                    <BSForm.Check
                                      key={task.idTarea}
                                      type="checkbox"
                                      id={`task-${task.idTarea}`}
                                      label={task.Nombre}
                                      checked={selectedTasks.includes(
                                        task.idTarea
                                      )}
                                      onChange={() =>
                                        handleTaskCheck(task.idTarea)
                                      }
                                      className="mb-2"
                                    />
                                  ))
                                )}
                              </div>

                              <Button
                                variant="primary"
                                size="sm"
                                className="mt-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignTasks(project.idProyecto);
                                }}
                              >
                                Asignar
                              </Button>
                            </Card.Body>
                          </Card>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ) : null
              )}
            </tbody>
          </Table>
        )}
      </div>

      {/* Modal Crear/Editar Proyecto */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProject ? 'Editar Proyecto' : 'Crear Proyecto'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomForm
            schema={projectSchema}
            onSubmit={onSubmit}
            defaultValues={
              editingProject || {
                Nombre: '',
                Descripcion: '',
                Objetivo: '',
                FechaInicio: '',
                FechaFin: undefined,
                Presupuesto: 0,
                Status: 'Pendiente',
              }
            }
            mode="onBlur"
          >
            <Input
              name="Nombre"
              label="Nombre"
              placeholder="Nombre del proyecto"
            />
            <Input
              name="Descripcion"
              label="Descripción"
              placeholder="Descripción del proyecto"
            />
            <Input
              name="Objetivo"
              label="Objetivo"
              placeholder="Objetivo del proyecto"
            />
            <Input
              name="FechaInicio"
              type="date"
              label="Fecha de Inicio"
              placeholder="DD/MM/YYYY"
            />
            <Input
              name="FechaFin"
              label="Fecha de Fin"
              type="date"
              placeholder="DD/MM/YYYY (opcional)"
            />
            <MoneyInput
              name="Presupuesto"
              label="Presupuesto"
              placeholder="Presupuesto"
              type="number"
            />

            {editingProject && (
              <SelectInput
                name="Status"
                label="Estado"
                options={estados.map((estado) => ({
                  value: estado.NombreEstado,
                  label: estado.NombreEstado,
                }))}
              />
            )}

            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <SubmitButton variant="primary" className="ms-2">
                {editingProject ? 'Actualizar' : 'Crear'}
              </SubmitButton>
            </div>
          </CustomForm>
        </Modal.Body>
      </Modal>

      <ConfirmModal
        show={showDeleteConfirm}
        title="Confirmar eliminación"
        message="¿Está seguro de eliminar este proyecto?"
        onConfirm={confirmDeleteProject}
        onCancel={cancelDeleteProject}
      />
    </PrivateLayout>
  );
};
