import { useEffect, useState } from 'react';
import { PrivateLayout } from '../layouts/PrivateLayout';
import { Row, Col, Button } from 'react-bootstrap';
import {
  getAllRecursos,
  deleteRecurso,
  updateRecurso,
  createRecurso,
} from '../../services/recurso';
import { getAllTareasWithResources } from '../../services/tarea';
import { Recurso, Tarea } from '../../services/types';
import { assignRecursoToTask } from '../../services/recurso';
import { useLoading } from '../../context/LoadingContext';
import {
  AssignedResourcesTable,
  TaskSelectionModal,
  UnassignedResourcesTable,
} from '../../components';
import { CreateResourceModal } from '../../components/Modal/CreateResourceModal';
import { showToast } from '../../services/toastService';

export const GestionRecursos = () => {
  const [_allRecursos, setAllRecursos] = useState<Recurso[]>([]);
  const [assignedResources, setAssignedResources] = useState<Recurso[]>([]);
  const [unassignedResources, setUnassignedResources] = useState<Recurso[]>([]);
  const [selectedResourceIds, setSelectedResourceIds] = useState<number[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Recurso | null>(null);
  const { setLoading } = useLoading();

  const fetchResources = async () => {
    try {
      setLoading(true);
      const resRecursos = await getAllRecursos();
      const recursos: Recurso[] = resRecursos.data.data || [];

      const resTareas = await getAllTareasWithResources();
      const tareas: Tarea[] = resTareas.data.data || [];

      const assignedResourceIdSet = new Set<number>();
      tareas.forEach((task) => {
        if (task.Recursos && Array.isArray(task.Recursos)) {
          task.Recursos.forEach((rec) => {
            assignedResourceIdSet.add(rec.idRecurso);
          });
        }
      });

      const assigned = recursos.filter((rec) =>
        assignedResourceIdSet.has(rec.idRecurso)
      );
      const unassigned = recursos.filter(
        (rec) => !assignedResourceIdSet.has(rec.idRecurso)
      );

      setAllRecursos(recursos);
      setAssignedResources(assigned);
      setUnassignedResources(unassigned);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleResourceSelectionChange = (selectedIds: number[]) => {
    setSelectedResourceIds(selectedIds);
  };

  const handleOpenTaskModal = () => {
    if (selectedResourceIds.length > 0) {
      setShowTaskModal(true);
    } else {
      showToast('Por favor selecciona un recurso', 'warning');
    }
  };

  const handleAssignResources = async (taskId: number) => {
    try {
      setLoading(true);
      await assignRecursoToTask({
        idTarea: taskId,
        recursos: selectedResourceIds,
      });
      setShowTaskModal(false);
      setSelectedResourceIds([]);
      fetchResources();
    } catch (error) {
      console.error('Error assigning resources:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejador para abrir el modal en modo edición (pasando el recurso a editar)
  const handleEditResource = (resource: Recurso) => {
    setEditingResource(resource);
    setShowResourceModal(true);
  };

  // Manejador para eliminar un recurso
  const handleDeleteResource = async (idRecurso: number) => {
    try {
      setLoading(true);
      await deleteRecurso(idRecurso);
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = () => {
    setEditingResource(null);
    setShowResourceModal(true);
  };

  const handleResourceModalSubmit = async (data: { Nombre: string }) => {
    try {
      setLoading(true);
      if (editingResource) {
        await updateRecurso({ idRecurso: editingResource.idRecurso, ...data });
      } else {
        await createRecurso(data);
      }
      setShowResourceModal(false);
      fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateLayout>
      <div className="p-3">
        <h2>Gestión de Recursos</h2>
        <Button
          variant="info"
          className="mb-3 text-white"
          onClick={handleCreateResource}
        >
          Crear Recurso
        </Button>
        <Row>
          <Col md={6}>
            <h4>Recursos Asignados</h4>
            <AssignedResourcesTable
              resources={assignedResources}
              onEditResource={handleEditResource}
              onDeleteResource={handleDeleteResource}
            />
          </Col>
          <Col md={6}>
            <h4>Recursos No Asignados</h4>
            <UnassignedResourcesTable
              resources={unassignedResources}
              onSelectionChange={handleResourceSelectionChange}
              onEditResource={handleEditResource}
              onDeleteResource={handleDeleteResource}
            />
            <Button
              variant="success"
              className="mt-3 text-white"
              onClick={handleOpenTaskModal}
            >
              Asignar Recursos
            </Button>
          </Col>
        </Row>
      </div>
      <TaskSelectionModal
        show={showTaskModal}
        onHide={() => setShowTaskModal(false)}
        onAssign={handleAssignResources}
      />
      <CreateResourceModal
        show={showResourceModal}
        onHide={() => setShowResourceModal(false)}
        onResourceSubmit={handleResourceModalSubmit}
        resource={editingResource}
      />
    </PrivateLayout>
  );
};
