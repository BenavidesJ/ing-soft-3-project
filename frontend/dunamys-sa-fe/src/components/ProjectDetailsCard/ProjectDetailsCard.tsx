import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Badge,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import dayjs from 'dayjs';
import { useForm, FormProvider } from 'react-hook-form';

import {
  getTareasByProject,
  getAllTareas,
  getTaskByUser,
} from '../../services/tarea';
import { assignTaskToProject } from '../../services/proyecto';
import { getUserByID } from '../../services/usuario';
import { EstadoBadges } from '../StatusProgress/EstadoBadges';
import { formatCurrency } from '../../utils/formatCurrency';
import { Proyecto, Tarea, Usuario } from '../../services/types';
import { SelectInput } from '../Forms/SelectInput';
import { Avatar } from '../Avatar/Avatar';

interface ProjectDetailsCardProps {
  project: Proyecto;
}

interface FormData {
  selectedTask: string;
}

interface UserData {
  nombre: string;
  username: string;
  correo: string;
  imagenPerfil?: string;
}

const mapUsuarioToUserData = (usuario: Usuario): UserData => ({
  nombre: `${usuario.Nombre} ${usuario.Apellido1}${
    usuario.Apellido2 ? ' ' + usuario.Apellido2 : ''
  }`,
  username: usuario.Correo,
  correo: usuario.Correo,
  imagenPerfil: usuario.Perfil?.urlImagenPerfil,
});

export const ProjectDetailsCard: React.FC<ProjectDetailsCardProps> = ({
  project,
}) => {
  const [assignedTasks, setAssignedTasks] = useState<Tarea[]>([]);
  const [unassignedTasks, setUnassignedTasks] = useState<Tarea[]>([]);
  const [taskMembers, setTaskMembers] = useState<{ [key: number]: Usuario[] }>(
    {}
  );

  const methods = useForm<FormData>({ defaultValues: { selectedTask: '' } });

  useEffect(() => {
    if (project?.idProyecto) {
      fetchAssignedTasks();
    }
  }, [project]);

  const fetchAssignedTasks = async () => {
    try {
      const assignedResponse = await getTareasByProject(project.idProyecto);
      const assigned: Tarea[] = assignedResponse.data.data || [];
      setAssignedTasks(assigned);

      const allTasksResponse = await getAllTareas();
      const allTasks: Tarea[] = allTasksResponse.data.data || [];
      const tasksNotAssigned = allTasks.filter(
        (t) => !t.Proyectos || t.Proyectos.length === 0
      );
      setUnassignedTasks(tasksNotAssigned);

      if (assigned.length > 0) {
        const membersMapPromises = assigned.map(async (task) => {
          const memberResponse = await getTaskByUser(task.idTarea);
          const taskMembersData = memberResponse.data.data;

          const usersPromises = taskMembersData.map(async (mapping: any) => {
            if (mapping.userId) {
              const userResponse = await getUserByID(mapping.userId);
              if (!userResponse.status) return null;
              return userResponse.data.data as Usuario;
            }
            return null;
          });
          const usersResults = await Promise.all(usersPromises);
          const users = usersResults.filter(
            (user): user is Usuario => user !== null
          );
          return { taskId: task.idTarea, users };
        });

        const membersMapArray = await Promise.all(membersMapPromises);

        const newTaskMembers: { [key: number]: Usuario[] } = {};
        for (const { taskId, users } of membersMapArray) {
          newTaskMembers[taskId] = users;
        }

        setTaskMembers(newTaskMembers);
      }
    } catch (error) {
      console.error('Error al cargar tareas asignadas', error);
    }
  };

  const handleAssignSingleTask = async (selectedTaskId: number) => {
    if (!project?.idProyecto) return;
    try {
      await assignTaskToProject({
        idProyecto: project.idProyecto,
        idTareas: [selectedTaskId],
      });
      methods.reset();

      fetchAssignedTasks();
    } catch (error) {
      console.error('Error al asignar tarea', error);
    }
  };

  const renderAssignedTasksTable = () => {
    if (assignedTasks.length === 0) {
      return (
        <>
          <p>No hay tareas asignadas a este proyecto.</p>
          {unassignedTasks.length === 0 ? (
            <p>No hay tareas disponibles para asignar.</p>
          ) : (
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit((data) => {
                  const selectedTaskId = parseInt(data.selectedTask, 10);
                  handleAssignSingleTask(selectedTaskId);
                })}
              >
                <SelectInput
                  name="selectedTask"
                  label="Selecciona una tarea para asignar"
                  options={unassignedTasks.map((task) => ({
                    value: task.idTarea.toString(),
                    label: task.Nombre,
                  }))}
                />
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-2"
                  type="submit"
                >
                  Asignar
                </Button>
              </form>
            </FormProvider>
          )}
        </>
      );
    } else {
      return (
        <Table hover responsive className="small-task-table align-middle">
          <thead>
            <tr>
              <th>Tarea</th>
              <th>Equipo</th>
              <th>Estado</th>
              <th>Fecha Límite</th>
            </tr>
          </thead>
          <tbody>
            {assignedTasks.map((task) => {
              const members = taskMembers[task.idTarea] || [];
              return (
                <tr key={task.idTarea}>
                  <td>{task.Nombre}</td>
                  <td>
                    {members.length === 0 ? (
                      <Badge bg="info">Sin asignar</Badge>
                    ) : (
                      <>
                        {members.slice(0, 4).map((member, index) => (
                          <OverlayTrigger
                            key={`member-${member.idUsuario}-${index}`}
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-${member.idUsuario}`}>
                                {member.Nombre} {member.Apellido1}
                                {member.Apellido2 ? ' ' + member.Apellido2 : ''}
                              </Tooltip>
                            }
                          >
                            <div style={{ display: 'inline-block' }}>
                              <Avatar
                                user={mapUsuarioToUserData(member)}
                                size={35}
                                className="me-1"
                              />
                            </div>
                          </OverlayTrigger>
                        ))}
                        {members.length > 4 && (
                          <Badge bg="primary" className="ms-1">
                            +{members.length - 4}
                          </Badge>
                        )}
                      </>
                    )}
                  </td>
                  <td>
                    <EstadoBadges estadoId={task.idEstado} />
                  </td>
                  <td>
                    {task.FechaFin
                      ? dayjs(task.FechaFin, 'DD/MM/YYYY').format('DD/MM/YYYY')
                      : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      );
    }
  };

  return (
    <Card
      key={project.idProyecto}
      className="mb-3 shadow-sm"
      style={{
        backgroundColor: '#d6efd8',
        borderRadius: '8px',
        border: 'none',
      }}
    >
      <Card.Body>
        <Card.Title className="mb-3">Detalles del Proyecto</Card.Title>
        <Card.Text>
          <strong>Nombre:</strong> {project.Nombre}
        </Card.Text>
        <Card.Text>
          <strong>Descripción:</strong> {project.Descripcion}
        </Card.Text>
        <Card.Text>
          <strong>Objetivo:</strong> {project.Objetivo}
        </Card.Text>
        <Card.Text>
          <strong>Fecha Inicio:</strong>{' '}
          {dayjs(project.FechaInicio, 'DD/MM/YYYY').format('DD/MM/YYYY')}
        </Card.Text>
        <Card.Text>
          <strong>Fecha Fin:</strong>{' '}
          {project.FechaFin
            ? dayjs(project.FechaFin, 'DD/MM/YYYY').format('DD/MM/YYYY')
            : '-'}
        </Card.Text>
        <Card.Text>
          <strong>Presupuesto:</strong> {formatCurrency(project.Presupuesto)}
        </Card.Text>
        <Card.Text>
          <strong>Estado:</strong>
        </Card.Text>
        <EstadoBadges estadoId={project.idEstado} />
        <Card.Text>
          <strong>Costo:</strong>
        </Card.Text>
        <hr />
        <h6>Tareas del Proyecto</h6>
        {renderAssignedTasksTable()}
      </Card.Body>
    </Card>
  );
};
