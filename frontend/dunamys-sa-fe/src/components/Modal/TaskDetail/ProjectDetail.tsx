import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  Col,
  Container,
  Row,
  Card,
  Badge,
  OverlayTrigger,
  Tooltip,
  Table,
  Dropdown,
} from 'react-bootstrap';
import { EstadoBadges } from '../../StatusProgress/EstadoBadges';
import {
  getTaskByUser,
  getTareasByProject,
  getAllTareas,
} from '../../../services/tarea';
import { getUserByID } from '../../../services/usuario';
import { Avatar } from '../../Avatar/Avatar';
import { Usuario, Tarea } from '../../../services/types';
import { formatCurrency } from '../../../utils/formatCurrency';
import { useForm } from 'react-hook-form';
import '../../../specialClasses.scss';
import { assignTaskToProject } from '../../../services/proyecto';

interface DetailsContentProps {
  data: any;
}

const mapUsuarioToUserData = (usuario: Usuario) => ({
  nombre: `${usuario.Nombre} ${usuario.Apellido1}${
    usuario.Apellido2 ? ' ' + usuario.Apellido2 : ''
  }`,
  username: usuario.Correo,
  correo: usuario.Correo,
  imagenPerfil: usuario.Perfil?.urlImagenPerfil,
});

interface FormData {
  selectedTask: string;
}

export const ProjectDetail = ({ data }: DetailsContentProps) => {
  const [assignedTasks, setAssignedTasks] = useState<Tarea[]>([]);
  const [unassignedTasks, setUnassignedTasks] = useState<Tarea[]>([]);
  const [taskMembers, setTaskMembers] = useState<{ [key: number]: Usuario[] }>(
    {}
  );
  const { reset } = useForm<FormData>({ defaultValues: { selectedTask: '' } });

  const fetchAssignedTasks = async () => {
    if (!data?.idProyecto) return;
    try {
      const assignedResponse = await getTareasByProject(data.idProyecto);
      const assigned: Tarea[] = (assignedResponse.data.data || []).filter(
        (task: Tarea) => task.Activo !== false
      );
      setAssignedTasks(assigned);

      const allTasksResponse = await getAllTareas();
      const allTasks: Tarea[] = (allTasksResponse.data.data || []).filter(
        (task: Tarea) => task.Activo !== false
      );

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

  useEffect(() => {
    if (data?.idProyecto) {
      fetchAssignedTasks();
    }
  }, [data]);

  const handleAssignSingleTask = async (selectedTaskId: number) => {
    if (!data?.idProyecto) return;
    try {
      await assignTaskToProject({
        idProyecto: data.idProyecto,
        idTareas: [selectedTaskId],
      });
      reset();
      fetchAssignedTasks();
    } catch (error) {
      console.error('Error al asignar tarea', error);
    }
  };

  const renderAssignedTasksTable = () => {
    if (assignedTasks.length === 0) {
      return <p>No hay tareas asignadas a este proyecto.</p>;
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
              const membersForTask = taskMembers[task.idTarea] || [];
              return (
                <tr key={task.idTarea}>
                  <td>{task.Nombre}</td>
                  <td>
                    {membersForTask.length === 0 ? (
                      <Badge bg="info">Sin asignar</Badge>
                    ) : (
                      <>
                        {membersForTask.slice(0, 4).map((member, index) => (
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
                        {membersForTask.length > 4 && (
                          <Badge bg="primary" className="ms-1">
                            +{membersForTask.length - 4}
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
    <Container fluid>
      <Row>
        <Col md={8}>
          <h5>Descripción</h5>
          <p>{data?.Descripcion}</p>

          <h5>Objetivo</h5>
          <p>{data?.Objetivo || 'No definido'}</p>

          <h5>Presupuesto</h5>
          <p>
            {data?.Presupuesto
              ? formatCurrency(data.Presupuesto)
              : 'No definido'}
          </p>
        </Col>

        <Col md={4}>
          <h6>Fechas</h6>
          <p>
            Inicio:{' '}
            {data?.FechaInicio
              ? dayjs(data.FechaInicio).format('DD/MM/YYYY')
              : 'N/A'}
          </p>
          <p>
            Fecha Fin:{' '}
            {data?.FechaFin ? dayjs(data.FechaFin).format('DD/MM/YYYY') : 'N/A'}
          </p>

          <h6>Estado</h6>
          {data?.idEstado ? (
            <EstadoBadges estadoId={data.idEstado} />
          ) : (
            <p>Sin definir</p>
          )}
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={12}>
          <Card className="mb-3">
            <Card.Header>Tareas del Proyecto</Card.Header>
            <Card.Body>
              {renderAssignedTasksTable()}
              {unassignedTasks.length > 0 && (
                <Dropdown className="mt-3">
                  <Dropdown.Toggle
                    variant="info"
                    id="dropdown-add-task"
                    className="text-primary"
                  >
                    Agregar Tarea
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {unassignedTasks.map((task) => (
                      <Dropdown.Item
                        key={task.idTarea}
                        onClick={() => handleAssignSingleTask(task.idTarea)}
                      >
                        {task.Nombre}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
