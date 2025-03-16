import { useEffect, useState } from 'react';
import { Alert, Button, Table, Modal } from 'react-bootstrap';
import { PrivateLayout } from '../layouts/PrivateLayout';
import { Form, Input, SubmitButton } from '../../components/Forms';
import { z } from 'zod';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../../services/usuario';
import { Usuario } from '../../services/types';
import { useLoading } from '../../context/LoadingContext';

const userSchema = z.object({
  Nombre: z.string().min(1, 'El nombre es obligatorio'),
  Apellido1: z.string().min(1, 'El primer apellido es obligatorio'),
  Apellido2: z.string().optional(),
  Correo: z.string().email('Formato de correo incorrecto'),
  Contrasena: z.string().optional(),
});

export const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const { setLoading } = useLoading();

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsuarios(response.data.data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleOpenModal = (usuario?: Usuario) => {
    setEditingUsuario(usuario || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUsuario(null);
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (editingUsuario) {
        console.log('modif', { idUsuario: editingUsuario.idUsuario, ...data });
        await updateUser({ idUsuario: editingUsuario.idUsuario, ...data });
      } else {
        console.log('crear', data);
        await createUser(data);
      }
      await fetchUsuarios();
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (idUsuario: number) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        setLoading(true);
        await deleteUser(idUsuario);
        await fetchUsuarios();
      } catch (err: any) {
        setError(err.message || 'Error al eliminar el usuario.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <PrivateLayout>
      <div className="p-3">
        <h2>Gestión de Usuarios</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button
          variant="primary"
          className="mb-3"
          onClick={() => handleOpenModal()}
        >
          Agregar Usuario
        </Button>
        {usuarios.length === 0 ? (
          <Alert variant="info">No hay usuarios disponibles.</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.idUsuario}>
                  <td>{usuario.idUsuario}</td>
                  <td>
                    {usuario.Nombre} {usuario.Apellido1}{' '}
                    {usuario.Apellido2 || ''}
                  </td>
                  <td>{usuario.Correo}</td>
                  <td>{usuario.Activo ? 'Activo' : 'Inactivo'}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => handleOpenModal(usuario)}
                    >
                      Editar
                    </Button>{' '}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(usuario.idUsuario)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUsuario ? 'Editar Usuario' : 'Crear Usuario'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            schema={userSchema}
            onSubmit={onSubmit}
            defaultValues={
              editingUsuario || {
                Nombre: '',
                Apellido1: '',
                Apellido2: '',
                Correo: '',
                Contrasena: '',
              }
            }
            mode="onBlur"
          >
            <Input
              name="Nombre"
              label="Nombre"
              placeholder="Ingrese el nombre"
            />
            <Input
              name="Apellido1"
              label="Primer Apellido"
              placeholder="Ingrese el primer apellido"
            />
            <Input
              name="Apellido2"
              label="Segundo Apellido"
              placeholder="Ingrese el segundo apellido (opcional)"
            />
            <Input
              name="Correo"
              label="Correo"
              placeholder="Ingrese el correo"
              type="email"
            />
            {!editingUsuario && (
              <Input
                name="Contrasena"
                label="Contraseña"
                placeholder="Ingrese la contraseña"
                type="password"
              />
            )}
            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <SubmitButton variant="primary" className="ms-2">
                {editingUsuario ? 'Actualizar' : 'Crear'}
              </SubmitButton>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </PrivateLayout>
  );
};
