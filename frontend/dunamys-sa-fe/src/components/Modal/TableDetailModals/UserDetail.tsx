import { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Modal,
} from 'react-bootstrap';
import dayjs from 'dayjs';
import { Avatar } from '../../Avatar/Avatar';
import { getTareasByMember } from '../../../services/tarea';
import { SimpleTable } from '../../Tables/SimpleTable';
import { useLoading } from '../../../context/LoadingContext';
import { Form, SubmitButton, SelectInput } from '../../Forms';
import { z } from 'zod';
import { assignRolToUser, getRoles } from '../../../services/roles';

interface DetailsContentProps {
  data: any;
}

const mapUsuarioToUserData = (usuario: any) => ({
  nombre: `${usuario.Nombre} ${usuario.Apellido1}${
    usuario.Apellido2 ? ' ' + usuario.Apellido2 : ''
  }`,
  username: usuario.Correo,
  correo: usuario.Correo,
  imagenPerfil: usuario.Perfil?.urlImagenPerfil,
});

export const UserDetail = ({ data }: DetailsContentProps) => {
  const [tareas, setTareas] = useState<any[]>([]);
  const { setLoading } = useLoading();

  const [userDetail, setUserDetail] = useState<any>(data);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);

  useEffect(() => {
    setUserDetail(data);
  }, [data]);

  useEffect(() => {
    if (data?.idUsuario) {
      getTareasByMember(data.idUsuario)
        .then((response: any) => {
          setTareas(response.data.data || []);
        })
        .catch((error: any) => {
          console.error('Error al obtener las tareas:', error);
        });
    }
  }, [data?.idUsuario]);

  const tareasColumns = [
    { header: 'Nombre', accessor: 'Nombre' },
    {
      header: 'Fecha Inicio',
      accessor: (tarea: any) =>
        tarea.FechaInicio
          ? dayjs(tarea.FechaInicio).format('DD/MM/YYYY')
          : 'N/A',
    },
    {
      header: 'Fecha Fin',
      accessor: (tarea: any) =>
        tarea.FechaFin ? dayjs(tarea.FechaFin).format('DD/MM/YYYY') : 'N/A',
    },
  ];

  const openAddRoleModal = async () => {
    try {
      const response = await getRoles();
      setAvailableRoles(
        Array.isArray(response.data.data) ? response.data.data : []
      );
      setShowAddRoleModal(true);
    } catch (error) {
      console.error('Error al obtener los roles:', error);
    }
  };

  const roleAssignSchema = z.object({
    rolId: z.string().min(1, 'Seleccione un rol'),
  });

  const onSubmitRole = async (formData: any) => {
    try {
      setLoading(true);
      const rolIdNum = parseInt(formData.rolId, 10);
      await assignRolToUser({
        idUsuario: userDetail.idUsuario,
        idRol: rolIdNum,
      });

      const selectedRole = availableRoles.find(
        (rol: any) => rol.idRol === rolIdNum
      );

      if (selectedRole) {
        setUserDetail((prev: any) => {
          const newRoles = prev.Roles
            ? [...prev.Roles, selectedRole.NombreRol]
            : [selectedRole.NombreRol];

          const newPermisos =
            selectedRole.Permisos?.map(
              (permiso: any) => permiso.NombrePermiso
            ) || [];

          const mergedPermisos = prev.Permisos
            ? Array.from(new Set([...prev.Permisos, ...newPermisos]))
            : newPermisos;

          return {
            ...prev,
            Roles: newRoles,
            Permisos: mergedPermisos,
          };
        });
      }
      setShowAddRoleModal(false);
    } catch (error) {
      console.error('Error al asignar rol:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div style={{ position: 'relative' }}>
                  <Avatar
                    user={mapUsuarioToUserData(userDetail)}
                    size={80}
                    backgroundColor="#eee"
                    color="#555"
                  />
                </div>
              </div>

              <div className="mt-3">
                <h4 className="mb-0">{userDetail.Nombre}</h4>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <small>Roles del Usuario</small>
                  {userDetail.Roles && userDetail.Roles.length > 0 ? (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {userDetail.Roles.map((rol: any, index: number) => (
                        <Badge key={index} bg="info" className="text-primary">
                          {rol}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <Badge bg="warning" className="text-dark">
                      Sin roles asignados
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="success"
                    className="text-white"
                    onClick={openAddRoleModal}
                  >
                    Agregar rol
                  </Button>
                </div>
              </div>

              <hr />

              <Row>
                <Col md={6}>
                  <p className="mb-1">
                    <strong>Correo:</strong>
                  </p>
                  <p className="text-muted">{userDetail.Correo}</p>
                  <p className="mb-1">
                    <strong>Nombre de Usuario:</strong>
                  </p>
                  <p className="text-muted">
                    {userDetail.Perfil?.NombreUsuario || 'N/A'}
                  </p>
                  <p className="mb-1">
                    <strong>Estado:</strong>
                  </p>
                  <Badge bg={userDetail.Activo ? 'success' : 'danger'}>
                    {userDetail.Activo ? 'Activo' : 'Desactivado'}
                  </Badge>
                </Col>
                <Col md={6}>
                  <p className="mb-1">
                    <strong>Permisos:</strong>
                  </p>
                  {userDetail.Permisos && userDetail.Permisos.length > 0 ? (
                    <div
                      style={{
                        display: 'flex',
                        gap: '5px',
                        flexWrap: 'wrap',
                      }}
                    >
                      {userDetail.Permisos.map(
                        (permiso: any, index: number) => (
                          <Badge key={index} bg="primary" className="text-info">
                            {permiso}
                          </Badge>
                        )
                      )}
                    </div>
                  ) : (
                    <Badge bg="warning" className="text-dark">
                      Sin permisos asignados
                    </Badge>
                  )}
                </Col>
              </Row>

              <hr />

              <h5>Actividad</h5>
              {tareas.length > 0 ? (
                <SimpleTable columns={tareasColumns} data={tareas} />
              ) : (
                <Card className="mt-3">
                  <Card.Body>Aún no tiene tareas asignadas</Card.Body>
                </Card>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showAddRoleModal}
        onHide={() => setShowAddRoleModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar rol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            schema={roleAssignSchema}
            onSubmit={onSubmitRole}
            defaultValues={{ rolId: '' }}
            mode="onBlur"
          >
            <SelectInput
              name="rolId"
              label="Seleccione un rol"
              options={availableRoles.map((rol: any) => ({
                value: rol.idRol.toString(),
                label: rol.NombreRol,
              }))}
            />
            <div className="d-flex justify-content-end mt-3">
              <Button
                variant="secondary"
                onClick={() => setShowAddRoleModal(false)}
              >
                Cancelar
              </Button>
              <SubmitButton variant="success" className="ms-2">
                Asignar rol
              </SubmitButton>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};
