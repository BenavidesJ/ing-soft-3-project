import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  Col,
  Container,
  Row,
  ListGroup,
  Button,
  Card,
  Badge,
  OverlayTrigger,
  Tooltip,
  Dropdown,
} from 'react-bootstrap';
import { EstadoBadges } from '../../StatusProgress/EstadoBadges';
import { useNavigate } from 'react-router';
import { getRecursosByTask } from '../../../services/recurso';
import { getTaskByUser, assignTareaToMember } from '../../../services/tarea';
import { getUserByID, getUsers } from '../../../services/usuario';
import { Avatar } from '../../Avatar/Avatar';
import { Usuario } from '../../../services/types';
import { FaPlus } from 'react-icons/fa';
import '../../../specialClasses.scss';

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

export const UserDetail = ({ data }: DetailsContentProps) => {
  const navigate = useNavigate();

  // Si la data tiene idUsuario, asumimos que es un objeto de usuario
  if (data?.idUsuario) {
    return (
      <Container fluid>
        <Row>
          <Col md={12}>
            <Card className="mb-3">
              <Card.Header>Detalles del Usuario</Card.Header>
              <Card.Body>
                <p>
                  <strong>ID:</strong> {data.idUsuario}
                </p>
                <p>
                  <strong>Nombre:</strong> {data.Nombre} {data.Apellido1}{' '}
                  {data.Apellido2 || ''}
                </p>
                <p>
                  <strong>Correo:</strong> {data.Correo}
                </p>
                <p>
                  <strong>Estado:</strong> {data.Activo ? 'Activo' : 'Inactivo'}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  // Si la data tiene idTarea, asumimos que es el detalle de una tarea
  if (data?.idTarea) {
    const [recursos, setRecursos] = useState<any[]>([]);
    const [members, setMembers] = useState<Usuario[]>([]);
    const [allUsers, setAllUsers] = useState<Usuario[]>([]);

    const fetchMembers = () => {
      getTaskByUser(data.idTarea).then((response: any) => {
        const mapping = response.data.data;
        Promise.all(
          mapping.map(async (item: any) => {
            if (item.userId) {
              const userResponse = await getUserByID(item.userId);
              return userResponse.data.data;
            }
            return null;
          })
        ).then((users) => {
          const filteredUsers = users.filter((u) => u !== null);
          setMembers(filteredUsers);
        });
      });
    };

    useEffect(() => {
      if (data?.idTarea) {
        getRecursosByTask(data.idTarea).then((response: any) => {
          setRecursos(response.data?.data);
        });
        fetchMembers();
      }
    }, [data]);

    useEffect(() => {
      getUsers().then((response: any) => {
        setAllUsers(response.data.data || []);
      });
    }, []);

    const handleAssignMember = (user: Usuario) => {
      assignTareaToMember({
        idTarea: data.idTarea,
        idUsuario: user.idUsuario,
      }).then(() => {
        fetchMembers();
      });
    };

    return (
      <Container fluid>
        <Row>
          <Col md={8}>
            <h5>Descripción</h5>
            <p>
              {data?.descripcion || 'Texto de ejemplo de la descripción...'}
            </p>

            <Card className="mb-3">
              <Card.Header>Personas</Card.Header>
              <Card.Body>
                <div className="d-flex align-items-center">
                  {members.length > 0 ? (
                    members.slice(0, 4).map((member, index) => (
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
                    ))
                  ) : (
                    <Badge bg="info" className="me-1">
                      Sin asignar
                    </Badge>
                  )}

                  <Dropdown>
                    <Dropdown.Toggle
                      variant="success"
                      size="sm"
                      className="no-caret rounded-circle d-flex align-items-center justify-content-center text-white"
                      style={{ width: '35px', height: '35px', padding: 0 }}
                    >
                      <FaPlus size={10} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {allUsers.map((user) => (
                        <Dropdown.Item
                          key={user.idUsuario}
                          onClick={() => handleAssignMember(user)}
                        >
                          {user.Nombre} {user.Apellido1}
                          {user.Apellido2 ? ' ' + user.Apellido2 : ''}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Header>Recursos</Card.Header>
              <Card.Body>
                {recursos.length > 0 ? (
                  <div
                    style={{
                      maxHeight: recursos.length > 3 ? '150px' : 'auto',
                      overflowY: recursos.length > 3 ? 'scroll' : 'visible',
                    }}
                  >
                    <ListGroup variant="flush">
                      {recursos.map((recurso, idx) => (
                        <ListGroup.Item
                          key={idx}
                          className="bg-info text-primary"
                        >
                          {recurso.Nombre}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                ) : (
                  <p>No hay recursos asignados.</p>
                )}

                <Button
                  variant="info"
                  onClick={() => navigate('/gestion-recursos')}
                  className="mt-2"
                >
                  Asignar
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <h6>Fechas</h6>
            <p>
              Inicio:{' '}
              {data?.FechaInicio
                ? dayjs(data.FechaInicio).format('DD/MM/YYYY')
                : 'N/A'}
            </p>
            <p>Actualizado: {data?.fechaActualizacion || 'N/A'}</p>

            <h6>Estado</h6>
            {data?.idEstado ? (
              <EstadoBadges estadoId={data.idEstado} />
            ) : (
              <p>Sin definir</p>
            )}
          </Col>
        </Row>
      </Container>
    );
  }

  return null;
};
