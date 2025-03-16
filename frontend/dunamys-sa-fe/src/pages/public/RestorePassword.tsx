import { Card } from 'react-bootstrap';
import { PublicLayout } from '../layouts/PublicLayout';
import { z } from 'zod';
import { Form, Input, SubmitButton } from '../../components/Forms';
import {
  restaurarPassword,
  RestorePasswordInputData,
} from '../../services/auth';
import { Link, useNavigate } from 'react-router';

const restorePasswordSchema = z.object({
  Correo: z.string().email('Formato de correo incorrecto'),
});

export const RestorePassword = () => {
  const nav = useNavigate();
  const onSubmit = async (data: RestorePasswordInputData) => {
    try {
      const response = await restaurarPassword(data);
      if (response.status) {
        nav('/login', { replace: true });
      }
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
            <h3 className="text-center mb-4">Restaurar Contraseña</h3>
            <p>
              Le enviaremos un password temporal a su correo electronico para
              que pueda ingresar, recuerde cambiarlo por uno mas seguro una vez
              ingrese al sistema.
            </p>

            <Form
              schema={restorePasswordSchema}
              onSubmit={onSubmit}
              mode="onBlur"
            >
              <Input
                type="email"
                name="Correo"
                label=""
                placeholder="Ingrese su correo"
              />

              <SubmitButton className="w-100">Enviar</SubmitButton>
            </Form>
            <div className="text-center mt-3">
              <Link to="/login">Volver a login</Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </PublicLayout>
  );
};
