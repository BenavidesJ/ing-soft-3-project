import { useState, useEffect } from 'react';
import { Dropdown, Modal, Button, Placeholder, Card } from 'react-bootstrap';
import { Form, Input, SubmitButton } from '../Forms';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../Avatar/Avatar';
import { z } from 'zod';

export const userProfileSchema = z.object({
  Nombre: z.string().min(1, 'El nombre es obligatorio'),
  Username: z.string().min(1, 'El usuario es obligatorio'),
  Correo: z.string().email('Formato de correo inválido'),
  Contrasena: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export function UserProfile() {
  const { currentUser, endSession } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const [formValues, setFormValues] = useState({
    Nombre: '',
    Username: '',
    Correo: '',
    Contrasena: '',
  });

  useEffect(() => {
    if (currentUser) {
      setFormValues({
        Nombre: currentUser.Nombre,
        Username: currentUser.Perfil?.NombreUsuario || '',
        Correo: currentUser.Correo,
        Contrasena: currentUser.Contrasena || '',
      });
    }
  }, [currentUser]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const onSubmit = (data: any) => {
    console.log('Datos del formulario:', data);
    setFormValues({
      Nombre: data.Nombre,
      Username: data.Username,
      Correo: data.Correo,
      Contrasena: data.Contrasena,
    });
    handleCloseModal();
  };

  if (!currentUser) {
    return <Placeholder as={Card} xs={10} size="lg" />;
  }

  return (
    <div className="card p-1">
      <Dropdown>
        <Dropdown.Toggle
          variant="link"
          className="text-white p-0 border-0 d-flex align-items-center"
          style={{ textDecoration: 'none' }}
        >
          <Avatar
            user={{
              nombre: formValues.Nombre,
              username: formValues.Username,
              correo: formValues.Correo,
            }}
            size={40}
            backgroundColor="#3a3a3a"
            color="#fff"
          />
          <div className="ms-2">
            <small>{formValues.Nombre}</small>
          </div>
        </Dropdown.Toggle>

        <Dropdown.Menu className="p-3" align="end">
          <div className="mb-2">
            <small>nombre: {formValues.Nombre}</small>
            <br />
            <small>username: {formValues.Username}</small>
            <br />
            <small>correo: {formValues.Correo}</small>
          </div>
          <Dropdown.Divider />
          <Dropdown.Item
            className="bg-info text-white rounded mb-1"
            onClick={handleOpenModal}
          >
            Editar perfil
          </Dropdown.Item>
          <Dropdown.Item
            className="bg-danger text-white rounded"
            onClick={endSession}
          >
            Cerrar Sesión
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            schema={userProfileSchema}
            onSubmit={onSubmit}
            defaultValues={formValues}
            mode="onBlur"
          >
            <Input name="Nombre" label="Nombre" />
            <Input name="Username" label="Usuario" />
            <Input name="Correo" label="Correo" type="email" />
            <Input name="Contrasena" label="Contraseña" type="password" />

            <div className="d-flex justify-content-end mt-3">
              <Button
                variant="danger"
                className="text-white"
                onClick={handleCloseModal}
              >
                Cerrar
              </Button>
              <SubmitButton variant="success" className=" text-white ms-2">
                Guardar
              </SubmitButton>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
