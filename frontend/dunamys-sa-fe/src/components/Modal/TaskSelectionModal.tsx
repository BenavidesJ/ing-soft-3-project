import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Tarea } from '../../services/types';
import { getAllTareas } from '../../services/tarea';

interface TaskSelectionModalProps {
  show: boolean;
  onHide: () => void;
  onAssign: (taskId: number) => void;
}

export const TaskSelectionModal: React.FC<TaskSelectionModalProps> = ({
  show,
  onHide,
  onAssign,
}) => {
  const [tasks, setTasks] = useState<Tarea[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getAllTareas();
        const allTasks: Tarea[] = response.data.data || [];

        const activeTasks = allTasks.filter((task) => task.Activo);
        setTasks(activeTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    if (show) {
      fetchTasks();
    }
  }, [show]);

  const handleAssign = () => {
    if (selectedTaskId !== null) {
      onAssign(selectedTaskId);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Seleccionar Tarea</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="taskSelect">
          <Form.Label>Seleccione una tarea activa:</Form.Label>
          <Form.Select
            onChange={(e) => setSelectedTaskId(Number(e.target.value))}
            defaultValue=""
          >
            <option value="" disabled>
              Seleccione...
            </option>
            {tasks.map((task) => (
              <option key={task.idTarea} value={task.idTarea}>
                {task.Nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" className="text-white" onClick={onHide}>
          Cancelar
        </Button>
        <Button
          variant="success"
          className="text-white"
          onClick={handleAssign}
          disabled={selectedTaskId === null}
        >
          Asignar Recursos
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
