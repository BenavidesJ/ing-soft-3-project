import { useEffect, useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
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
import { ActionTable, ActionTableColumn } from '../../components';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

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

  const handleDelete = (idUsuario: number) => {
    setUserToDelete(idUsuario);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (userToDelete === null) return;
    try {
      setLoading(true);
      await deleteUser(userToDelete);
      await fetchUsuarios();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el usuario.');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (editingUsuario) {
        await updateUser({ idUsuario: editingUsuario.idUsuario, ...data });
      } else {
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

  const columns: ActionTableColumn<Usuario>[] = [
    { header: 'ID', accessor: 'idUsuario' },
    {
      header: 'Nombre Completo',
      accessor: (usuario: Usuario) =>
        `${usuario.Nombre} ${usuario.Apellido1} ${usuario.Apellido2 || ''}`,
    },
    { header: 'Correo', accessor: 'Correo' },
    {
      header: 'Estado',
      accessor: (usuario: Usuario) => (usuario.Activo ? 'Activo' : 'Inactivo'),
    },
    {
      header: 'Acciones',
      accessor: (usuario: Usuario) => (
        <>
          <Button
            size="sm"
            variant="info"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal(usuario);
            }}
            className="me-2"
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(usuario.idUsuario);
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
        <h2>Gestión de Usuarios</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button
          variant="info"
          className="mb-3 text-white"
          onClick={() => handleOpenModal()}
        >
          Agregar Usuario
        </Button>
        {usuarios.length === 0 ? (
          <Alert variant="info">No hay usuarios disponibles.</Alert>
        ) : (
          <ActionTable columns={columns} data={usuarios} />
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
              editingUsuario
                ? {
                    Nombre: editingUsuario.NombrePila,
                    Apellido1: editingUsuario.Apellido1,
                    Apellido2: editingUsuario.Apellido2,
                    Correo: editingUsuario.Correo,
                    Contrasena: '',
                  }
                : {
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
              <Button
                variant="danger"
                className="text-white"
                onClick={handleCloseModal}
              >
                Cancelar
              </Button>
              <SubmitButton variant="success" className="ms-2 text-white">
                {editingUsuario ? 'Actualizar' : 'Crear'}
              </SubmitButton>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <ConfirmModal
        show={showDeleteConfirm}
        title="Confirmar eliminación"
        message="¿Está seguro de eliminar este usuario?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </PrivateLayout>
  );
};
