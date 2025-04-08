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
  createCosto,
} from '../../services/proyecto';
import { getAllEstados } from '../../services/estado';
import { getAllTareas } from '../../services/tarea';
import { Proyecto, Tarea } from '../../services/types';
import { useLoading } from '../../context/LoadingContext';
import dayjs from 'dayjs';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  ActionTable,
  ActionTableColumn,
  CostModal,
  EstadoBadges,
  LoadingOverlay,
} from '../../components';
import { showToast } from '../../services/toastService';

const projectSchema = z.object({
  Nombre: z.string().min(1, 'El nombre es obligatorio'),
  Descripcion: z.string().min(1, 'La descripción es obligatoria'),
  Objetivo: z.string().min(1, 'El objetivo es obligatorio'),
  FechaInicio: z.string().min(1, 'La fecha de inicio es obligatoria'),
  FechaFin: z
    .union([z.string(), z.null()])
    .optional()
    .transform((val) => (val === null || val === '' ? undefined : val)),
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
  const [showCostModal, setShowCostModal] = useState(false);
  // Almacena la data pendiente para actualizar el proyecto a finalizado
  const [pendingFinalizadoData, setPendingFinalizadoData] = useState<any>(null);
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

  // Función que se ejecuta al enviar el formulario de creación/edición de proyecto
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
        // Si se intenta cambiar a "finalizado", guardamos la data pendiente y mostramos el modal de costo
        if (data.Status && data.Status.toLowerCase() === 'finalizado') {
          setPendingFinalizadoData({
            idProyecto: editingProject.idProyecto,
            ...data,
          });
          setShowCostModal(true);
          handleCloseModal();
          return; // Salir para esperar el costo
        } else {
          await updateProyecto({
            idProyecto: editingProject.idProyecto,
            ...data,
          });
        }
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

  // Callback que se llama desde el CostModal cuando se ingresa el costo final
  const handleCostSubmit = async (costData: { CostoTotal: number }) => {
    try {
      setLoading(true);
      // Actualizamos el proyecto a finalizado (usando la data pendiente)
      await updateProyecto(pendingFinalizadoData);
      // Luego agregamos el costo final al proyecto
      await createCosto({
        idProyecto: pendingFinalizadoData.idProyecto,
        CostoTotal: costData.CostoTotal,
      });
      await fetchProjects();
      setPendingFinalizadoData(null);
      setShowCostModal(false);
    } catch (err: any) {
      console.error('Error al agregar el costo final:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCostModalCancel = () => {
    showToast(
      'No se puede cambiar el estado a finalizado sin agregar un costo final'
    );

    setShowCostModal(false);
    setPendingFinalizadoData(null);
  };

  const columns: ActionTableColumn<Proyecto>[] = [
    {
      header: 'Nombre',
      accessor: 'Nombre',
    },
    {
      header: 'Descripción',
      accessor: 'Descripcion',
    },
    {
      header: 'Objetivo',
      accessor: 'Objetivo',
    },
    {
      header: 'Fecha Inicio',
      accessor: (project: Proyecto) =>
        dayjs(project.FechaInicio).format('DD/MM/YYYY'),
    },
    {
      header: 'Fecha Fin',
      accessor: (project: Proyecto) =>
        project.FechaFin ? dayjs(project.FechaFin).format('DD/MM/YYYY') : '-',
    },
    {
      header: 'Presupuesto',
      accessor: (project: Proyecto) => formatCurrency(project.Presupuesto),
    },
    {
      header: 'Estado',
      accessor: (project: Proyecto) => (
        <EstadoBadges estadoId={project.idEstado} />
      ),
    },
    {
      header: 'Acciones',
      accessor: (project: Proyecto) => (
        <>
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
        </>
      ),
    },
  ];

  return (
    <PrivateLayout>
      <div className="p-3">
        <h2>Gestión de Proyectos</h2>
        <Button
          variant="info"
          className="mb-3 text-white"
          onClick={() => handleOpenModal()}
        >
          Agregar Proyecto
        </Button>
        {projects.length === 0 ? (
          <LoadingOverlay />
        ) : (
          <ActionTable
            data={projects.filter((project) => project.Activo)}
            columns={columns}
          />
        )}
      </div>

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
              <Button
                variant="danger"
                className="text-white"
                onClick={handleCloseModal}
              >
                Cancelar
              </Button>
              <SubmitButton variant="success" className="ms-2 text-white">
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

      {showCostModal && pendingFinalizadoData && (
        <CostModal
          show={showCostModal}
          onHide={handleCostModalCancel}
          projectId={pendingFinalizadoData.idProyecto}
          onCostSubmitted={handleCostSubmit}
        />
      )}
    </PrivateLayout>
  );
};
