import { useEffect, useState } from 'react';
import { Alert, Button, Table, Modal } from 'react-bootstrap';
import { PrivateLayout } from '../layouts/PrivateLayout';
import { Form, Input, SubmitButton } from '../../components/Forms';
import { z } from 'zod';
import {
  getAllTareas,
  createTarea,
  updateTarea,
  deleteTarea,
} from '../../services/tarea';
import { Tarea } from '../../services/types';
import { useLoading } from '../../context/LoadingContext';
import dayjs from 'dayjs';
import { ConfirmModal, EstadoBadges } from '../../components';

const tareaSchema = z.object({
  Nombre: z.string().min(1, 'El nombre es obligatorio'),
  Descripcion: z.string().min(1, 'La descripción es obligatoria'),
  FechaInicio: z.string().min(1, 'La fecha de inicio es obligatoria'),
  FechaFin: z.string().optional(),
  Status: z.string().min(1, 'El estado es obligatorio'),
});

export const GestionTareas = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTarea, setEditingTarea] = useState<Tarea | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const { setLoading } = useLoading();

  const fetchTareas = async () => {
    try {
      setLoading(true);
      const response = await getAllTareas();
      setTareas(response.data.data || []);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTareas();
  }, []);

  const handleOpenModal = (tarea?: Tarea) => {
    setEditingTarea(tarea || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTarea(null);
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (data.FechaInicio) {
        data.FechaInicio = dayjs(data.FechaInicio).format('DD/MM/YYYY');
      }

      if (data.FechaFin) {
        data.FechaFin = dayjs(data.FechaFin).format('DD/MM/YYYY');
      } else {
        data.FechaFin = null;
      }
      if (editingTarea) {
        await updateTarea({ idTarea: editingTarea.idTarea, ...data });
      } else {
        await createTarea(data);
      }
      await fetchTareas();
      handleCloseModal();
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (idTarea: number) => {
    setTaskToDelete(idTarea);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete !== null) {
      try {
        setLoading(true);
        await deleteTarea(taskToDelete);
        await fetchTareas();
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    setShowDeleteConfirm(false);
    setTaskToDelete(null);
  };

  const cancelDeleteTask = () => {
    setShowDeleteConfirm(false);
    setTaskToDelete(null);
  };

  return (
    <PrivateLayout>
      <div className="p-3">
        <h2>Gestión de Tareas</h2>
        <Button
          variant="primary"
          className="mb-3"
          onClick={() => handleOpenModal()}
        >
          Agregar Tarea
        </Button>
        {tareas.length === 0 ? (
          <Alert variant="info">No hay tareas disponibles.</Alert>
        ) : (
          <Table
            striped
            bordered
            hover
            responsive
            className="text-center align-middle"
          >
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map((tarea) => (
                <>
                  {tarea.Activo && (
                    <tr key={tarea.idTarea}>
                      <td>{tarea.Nombre}</td>
                      <td>{tarea.Descripcion}</td>
                      <td>{dayjs(tarea.FechaInicio).format('DD/MM/YYYY')}</td>
                      <td>
                        {tarea.FechaFin
                          ? dayjs(tarea.FechaFin).format('DD/MM/YYYY')
                          : '-'}
                      </td>
                      <td>
                        <EstadoBadges estadoId={tarea.idEstado} />
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="info"
                          onClick={() => handleOpenModal(tarea)}
                        >
                          Editar
                        </Button>{' '}
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteClick(tarea.idTarea)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTarea ? 'Editar Tarea' : 'Crear Tarea'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            schema={tareaSchema}
            onSubmit={onSubmit}
            defaultValues={
              editingTarea || {
                Nombre: '',
                Descripcion: '',
                FechaInicio: '',
                FechaFin: '',
                Status: '',
              }
            }
            mode="onBlur"
          >
            <Input
              name="Nombre"
              label="Nombre"
              placeholder="Nombre de la tarea"
            />
            <Input
              name="Descripcion"
              label="Descripción"
              placeholder="Descripción de la tarea"
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
            <Input name="Status" label="Estado" placeholder="Estado" />
            <div className="d-flex justify-content-end mt-3">
              <Button variant="danger" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <SubmitButton variant="success" className="ms-2">
                {editingTarea ? 'Actualizar' : 'Crear'}
              </SubmitButton>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <ConfirmModal
        show={showDeleteConfirm}
        title="Confirmar eliminación"
        message="¿Está seguro de eliminar esta tarea?"
        onConfirm={confirmDeleteTask}
        onCancel={cancelDeleteTask}
      />
    </PrivateLayout>
  );
};
