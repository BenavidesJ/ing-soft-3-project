import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { z } from 'zod';
import { Form, Input, SubmitButton } from '../Forms';
import { Recurso } from '../../services/types';

const recursoSchema = z.object({
  Nombre: z.string().min(1, 'El nombre es obligatorio'),
});

interface CreateResourceModalProps {
  show: boolean;
  onHide: () => void;
  onResourceSubmit: (data: { Nombre: string }) => Promise<void>;
  resource: Recurso | null;
}

export const CreateResourceModal: React.FC<CreateResourceModalProps> = ({
  show,
  onHide,
  onResourceSubmit,
  resource,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {resource ? 'Editar Recurso' : 'Crear Recurso'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          schema={recursoSchema}
          onSubmit={async (data) => {
            await onResourceSubmit(data);
          }}
          defaultValues={
            resource ? { Nombre: resource.Nombre } : { Nombre: '' }
          }
          mode="onBlur"
        >
          <Input
            name="Nombre"
            label="Nombre"
            placeholder="Nombre del recurso"
          />
          <div className="d-flex justify-content-end mt-3">
            <Button variant="danger" className="text-white" onClick={onHide}>
              Cancelar
            </Button>
            <SubmitButton variant="success" className="ms-2 text-white">
              {resource ? 'Actualizar' : 'Crear'}
            </SubmitButton>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
