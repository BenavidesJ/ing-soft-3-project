import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Card,
  Badge,
  Form as RBForm,
  Container,
  Row,
  Col,
  Placeholder,
} from 'react-bootstrap';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../Avatar/Avatar';
import { Input, SubmitButton } from '../Forms';
import { uploadImage } from '../../services/cloudinary';
import { updateUser, getUserByID } from '../../services/usuario';
import { ChangePasswordModal } from '../Modal/ChangePasswordModal';

const userProfileSchema = z.object({
  Nombre: z.string().min(1, 'El nombre es obligatorio'),
  Apellido1: z.string().min(1, 'El apellido es obligatorio'),
  Apellido2: z.string().optional(),
  Username: z.string().min(1, 'El usuario es obligatorio'),
  Correo: z.string().email('Formato de correo inválido'),
});

type UserProfileForm = z.infer<typeof userProfileSchema>;

export function UserProfile() {
  const { currentUser, endSession, setCurrentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string>('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formValues, setFormValues] = useState({
    Nombre: '',
    Apellido1: '',
    Apellido2: '',
    Username: '',
    Correo: '',
    imagenURL: '',
  });

  const methods = useForm<UserProfileForm>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      Nombre: '',
      Apellido1: '',
      Apellido2: '',
      Username: '',
      Correo: '',
    },
  });

  useEffect(() => {
    if (currentUser) {
      getUserByID(currentUser.idUsuario)
        .then((response) => {
          const usuario = response.data.data;
          if (usuario) {
            const valores = {
              Nombre: usuario.Nombre,
              Apellido1: usuario.Apellido1,
              Apellido2: usuario.Apellido2 || '',
              Username: usuario.Perfil?.NombreUsuario || '',
              Correo: usuario.Correo,
              imagenURL: usuario.Perfil?.urlImagenPerfil || '',
            };
            setFormValues(valores);
            methods.reset({
              Nombre: valores.Nombre,
              Apellido1: valores.Apellido1,
              Apellido2: valores.Apellido2,
              Username: valores.Username,
              Correo: valores.Correo,
            });
            if (valores.imagenURL) {
              setPreviewURL(valores.imagenURL);
            }
          }
        })
        .catch((error) =>
          console.error('Error al obtener usuario actualizado', error)
        );
    }
  }, [currentUser, methods]);

  const handleOpenModal = () => {
    setShowModal(true);
    setEditMode(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPreviewURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onSubmit = async (data: UserProfileForm) => {
    try {
      let imagenURL = formValues.imagenURL;
      if (selectedFile) {
        const response = await uploadImage(selectedFile);
        imagenURL = response?.data.secure_url;
      }
      if (currentUser) {
        const updateData = {
          idUsuario: currentUser.idUsuario,
          Nombre: data.Nombre,
          Apellido1: data.Apellido1,
          Apellido2: data.Apellido2 || '',
          Correo: data.Correo,
          Username: data.Username,
          imagenURL,
        };
        setCurrentUser({
          ...currentUser,
          ...updateData,
          Perfil: {
            ...currentUser.Perfil,
            urlImagenPerfil: updateData.imagenURL,
            NombreUsuario: updateData.Username,
            idPerfilUsuario: updateData.idUsuario,
          },
        });
        await updateUser(updateData);
        setFormValues({
          ...data,
          Apellido2: data.Apellido2 || '',
          imagenURL,
        });
        handleCloseModal();
      }
    } catch (error: any) {
      console.error('Error al actualizar usuario', error);
    }
  };

  if (!currentUser) {
    return <Placeholder as={Card} xs={10} size="lg" />;
  }

  return (
    <Container fluid>
      <div
        className="card p-2 d-flex flex-row justify-content-evenly align-items-center"
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}
        onClick={handleOpenModal}
      >
        <div
          style={{
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: '#3a3a3a',
          }}
        >
          <Avatar
            user={{
              nombre: `${currentUser.Nombre} ${currentUser.Apellido1}`,
              username: currentUser.Perfil?.NombreUsuario || '',
              correo: currentUser.Correo,
              imagenPerfil: currentUser.Perfil?.urlImagenPerfil || '',
            }}
            size={35}
          />
        </div>
        <div className="ms-2">
          <small>
            {currentUser.Nombre} {currentUser.Apellido1}
          </small>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Perfil de Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!editMode ? (
            <div>
              <Row className="mb-3">
                <Col md={3} className="text-center">
                  {previewURL ? (
                    <img
                      src={previewURL}
                      alt="Foto de perfil"
                      style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                      }}
                    />
                  ) : (
                    <Avatar
                      user={{
                        nombre: currentUser.Nombre,
                        username: currentUser.Perfil?.NombreUsuario || '',
                        correo: currentUser.Correo,
                        imagenPerfil: currentUser.Perfil?.urlImagenPerfil || '',
                      }}
                      size={80}
                    />
                  )}
                </Col>
                <Col md={9}>
                  <p>
                    <strong>Nombre:</strong> {currentUser.Nombre}
                  </p>
                  <p>
                    <strong>Primer Apellido:</strong> {currentUser.Apellido1}
                  </p>
                  {currentUser.Apellido2 && (
                    <p>
                      <strong>Segundo Apellido:</strong> {currentUser.Apellido2}
                    </p>
                  )}
                  <p>
                    <strong>Usuario:</strong>{' '}
                    {currentUser.Perfil?.NombreUsuario || 'N/A'}
                  </p>
                  <p>
                    <strong>Correo:</strong> {currentUser.Correo}
                  </p>
                  <strong>Roles del Usuario</strong>
                  {currentUser.Roles && currentUser.Roles.length > 0 ? (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {currentUser.Roles.map((rol: any, index: number) => (
                        <Badge key={index} bg="info" className="text-primary">
                          {rol}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <Badge bg="warning" className="text-white">
                      Sin roles asignados
                    </Badge>
                  )}
                  <Button
                    variant="info"
                    className="mt-2 text-white"
                    onClick={handleEdit}
                  >
                    Editar perfil
                  </Button>
                </Col>
              </Row>
            </div>
          ) : (
            <FormProvider {...methods}>
              <RBForm onSubmit={methods.handleSubmit(onSubmit)}>
                <Row className="mb-3">
                  <Col md={3} className="text-center">
                    {previewURL ? (
                      <img
                        src={previewURL}
                        alt="Foto de perfil"
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '50%',
                        }}
                      />
                    ) : (
                      <Avatar
                        user={{
                          nombre: currentUser.Nombre,
                          username: currentUser.Perfil?.NombreUsuario || '',
                          correo: currentUser.Correo,
                          imagenPerfil:
                            currentUser.Perfil?.urlImagenPerfil || '',
                        }}
                        size={80}
                      />
                    )}
                    <RBForm.Group controlId="imagenPerfil" className="mt-2">
                      <RBForm.Control
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </RBForm.Group>
                  </Col>
                  <Col md={9}>
                    <Input name="Nombre" label="Nombre" />
                    <Input name="Apellido1" label="Primer Apellido" />
                    <Input name="Apellido2" label="Segundo Apellido" />
                    <Input name="Username" label="Usuario" />
                    <Input name="Correo" label="Correo" type="email" />
                    <Button
                      variant="warning"
                      className="mt-2 text-white"
                      onClick={() => setShowChangePassword(true)}
                    >
                      Cambiar Contraseña
                    </Button>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end mt-3">
                  <Button
                    variant="info"
                    className="text-white"
                    onClick={() => setEditMode(false)}
                  >
                    Cancelar
                  </Button>
                  <SubmitButton variant="success" className="ms-2 text-white">
                    Guardar
                  </SubmitButton>
                </div>
              </RBForm>
            </FormProvider>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" className="text-white" onClick={endSession}>
            Cerrar Sesión
          </Button>
        </Modal.Footer>
      </Modal>
      <ChangePasswordModal
        show={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </Container>
  );
}
