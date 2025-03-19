import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { PrivateLayout } from '../layouts/PrivateLayout';
import {
  Form as CustomForm,
  Input,
  SubmitButton,
  SelectInput,
  MoneyInput,
} from '../../components/Forms';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal';
import { z } from 'zod';
import {
  getAllProyectos,
  createProyecto,
  updateProyecto,
  deleteProyecto,
} from '../../services/proyecto';
import { getAllEstados } from '../../services/estado';
import { getAllTareas } from '../../services/tarea';
import { Proyecto, Tarea } from '../../services/types';
import { useLoading } from '../../context/LoadingContext';
import dayjs from 'dayjs';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  CollapsibleTable,
  EstadoBadges,
  LoadingOverlay,
} from '../../components';
import { ProjectDetailsCard } from '../../components/ProjectDetailsCard/ProjectDetailsCard';

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
  const [_tareas, setTareas] = useState<Tarea[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Proyecto | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const { setLoading } = useLoading();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getAllProyectos();
      setProjects(response.data.data || []);
    } catch (err: any) {
      console.error(err);
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
      console.error(err);
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
        console.error(err);
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

  const tableHeader = (
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
  );

  const renderMainRow = (project: Proyecto) => (
    <>
      <td>{project.idProyecto}</td>
      <td>{project.Nombre}</td>
      <td>{project.Descripcion}</td>
      <td>{project.Objetivo}</td>
      <td>{dayjs(project.FechaInicio).format('DD/MM/YYYY')}</td>
      <td>
        {project.FechaFin ? dayjs(project.FechaFin).format('DD/MM/YYYY') : '-'}
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
    </>
  );

  const renderExpandedRow = (project: Proyecto) => (
    <ProjectDetailsCard
      key={`project-details-${project.idProyecto}`}
      project={project}
    />
  );

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
          <LoadingOverlay />
        ) : (
          <CollapsibleTable
            data={projects.filter((project) => project.Activo)}
            header={tableHeader}
            rowKey={(project: Proyecto) => project.idProyecto}
            colSpan={9}
            renderMainRow={renderMainRow}
            renderExpandedRow={renderExpandedRow}
          />
        )}
      </div>

      {/* Modal para crear/editar proyecto */}
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
