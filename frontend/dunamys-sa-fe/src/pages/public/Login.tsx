import { z } from 'zod';
import { PublicLayout } from '../layouts/PublicLayout';
import { Card } from 'react-bootstrap';
import { Form, Input, SubmitButton } from '../../components/Forms';
import { Link, useNavigate } from 'react-router';
import { login } from '../../services/auth';
import { useLoading } from '../../context/LoadingContext';
import { useAuth } from '../../context';
import { useEffect } from 'react';

const loginSchema = z.object({
  Correo: z
    .string()
    .min(1, 'El correo es obligatorio')
    .email('Formato de correo incorrecto'),
  Contrasena: z.string().min(6, 'La contraseña es obligatoria'),
});

export const Login = () => {
  const { setLoading } = useLoading();
  const { startSession, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: { Correo: string; Contrasena: string }) => {
    try {
      const response = await login(data);
      const user = await response.data;
      setLoading(true);
      startSession(response.data);
      if (user) {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
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
            <h3 className="text-center mb-4">Inicio de Sesión</h3>

            <Form schema={loginSchema} onSubmit={onSubmit} mode="onBlur">
              <Input type="email" name="Correo" label="Correo" />
              <Input name="Contrasena" label="Contrasena" type="password" />

              <div className="text-start mb-4">
                <Link to="/forgot-password">¿Olvidó su contraseña?</Link>
              </div>

              <SubmitButton className="w-100" variant="info">
                Ingresar
              </SubmitButton>
            </Form>
            <div className="text-center mt-3">
              <span>¿Aún no tiene cuenta? </span>
              <Link to="/register">Regístrese acá</Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </PublicLayout>
  );
};
