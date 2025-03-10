import { z } from 'zod';
import { PublicLayout } from '../layouts/PublicLayout';
import { Card } from 'react-bootstrap';
import { Form, Input, SubmitButton } from '../../components/Forms';
import { Link } from 'react-router';
import { login } from '../../services/auth';

const loginSchema = z.object({
  Correo: z.string().email('Formato de correo incorrecto'),
  Contrasena: z.string().min(1, 'La contraseña es obligatoria'),
});

export const Login = () => {
  const onSubmit = async (data: { Correo: string; Contrasena: string }) => {
    try {
      const response = await login(data);
      console.log('Login exitoso:', response.data);
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <PublicLayout>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '80vh' }}
      >
        <Card style={{ maxWidth: '400px', width: '100%', padding: '1rem' }}>
          <Card.Body>
            <div className="text-center mb-3">
              <img
                src="/img/user-icon.png"
                alt="Icono de usuario"
                width="80"
                height="80"
              />
            </div>

            <h3 className="text-center mb-4">Bienvenido</h3>

            <Form schema={loginSchema} onSubmit={onSubmit} mode="onBlur">
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

              <div className="text-center mb-3">
                <Link to="/forgot-password">¿Olvidó su contraseña?</Link>
              </div>

              <SubmitButton className="w-100">Ingresar</SubmitButton>
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
