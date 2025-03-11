import { Card } from 'react-bootstrap';
import { PublicLayout } from '../layouts/PublicLayout';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';
import { Form, Input, SubmitButton } from '../../components/Forms';
import { RegisterData, registro } from '../../services/auth';
import { useAuth } from '../../context';
import { useEffect } from 'react';

const registerSchema = z.object({
  Correo: z.string().email('Formato de correo incorrecto'),
  Contrasena: z.string().min(1, 'La contraseña es obligatoria'),
  Nombre: z.string().min(1, 'Este dato es obligatorio'),
  Apellido1: z.string().min(1, 'Este dato es obligatorio'),
  Apellido2: z.string(),
});

export const Register = () => {
  const { startSession, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const onSubmit = async (data: RegisterData) => {
    try {
      const response = await registro(data);
      const user = await response.data;
      startSession(response.data);
      if (user) {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated]);

  return (
    <PublicLayout>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '80vh' }}
      >
        <Card style={{ maxWidth: '400px', width: '100%', padding: '1rem' }}>
          <Card.Body>
            <h3 className="text-center mb-4">Registro</h3>

            <Form schema={registerSchema} onSubmit={onSubmit} mode="onBlur">
              <Input
                type="email"
                name="Correo"
                label=""
                placeholder="Ingrese su correo"
              />
              <Input
                name="Contrasena"
                label=""
                placeholder="Ingrese su contraseña"
                type="password"
              />
              <Input
                name="Nombre"
                label=""
                placeholder="Ingrese su nombre"
                type="text"
              />
              <Input
                name="Apellido1"
                label=""
                placeholder="Ingrese su primer apellido"
                type="text"
              />
              <Input
                name="Apellido2"
                label=""
                placeholder="Ingrese su segundo apellido"
                type="text"
              />

              <SubmitButton className="w-100">Registrar</SubmitButton>
            </Form>
            <div className="text-center mt-3">
              <span>¿Ya tiene cuenta? </span>
              <Link to="/login">Ingrese acá</Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </PublicLayout>
  );
};
