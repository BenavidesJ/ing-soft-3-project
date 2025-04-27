import React from 'react';
import { Modal, Button, Form as RBForm, Alert } from 'react-bootstrap';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuth } from '../../context/AuthContext';
import { changePassword } from '../../services/usuario';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Ingrese su contraseña actual'),
    newPassword: z
      .string()
      .min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirme la contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas nuevas deben coincidir',
    path: ['confirmPassword'],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
  show: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  show,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const methods = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      await changePassword({
        idUsuario: currentUser.idUsuario,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cambiar Contraseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormProvider {...methods}>
          <RBForm onSubmit={methods.handleSubmit(onSubmit)}>
            {error && <Alert variant="danger">{error}</Alert>}
            <RBForm.Group className="mb-3" controlId="currentPassword">
              <RBForm.Label>Contraseña Actual</RBForm.Label>
              <RBForm.Control
                type="password"
                {...methods.register('currentPassword')}
              />
              {methods.formState.errors.currentPassword && (
                <small className="text-danger">
                  {methods.formState.errors.currentPassword.message}
                </small>
              )}
            </RBForm.Group>
            <RBForm.Group className="mb-3" controlId="newPassword">
              <RBForm.Label>Nueva Contraseña</RBForm.Label>
              <RBForm.Control
                type="password"
                {...methods.register('newPassword')}
              />
              {methods.formState.errors.newPassword && (
                <small className="text-danger">
                  {methods.formState.errors.newPassword.message}
                </small>
              )}
            </RBForm.Group>
            <RBForm.Group className="mb-3" controlId="confirmPassword">
              <RBForm.Label>Confirmar Nueva Contraseña</RBForm.Label>
              <RBForm.Control
                type="password"
                {...methods.register('confirmPassword')}
              />
              {methods.formState.errors.confirmPassword && (
                <small className="text-danger">
                  {methods.formState.errors.confirmPassword.message}
                </small>
              )}
            </RBForm.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button
                variant="success"
                type="submit"
                className="ms-2"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </RBForm>
        </FormProvider>
      </Modal.Body>
    </Modal>
  );
};
