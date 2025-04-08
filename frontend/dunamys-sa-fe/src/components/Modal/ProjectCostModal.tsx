// CostModal.tsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Form } from '../../components/Forms/Form';
import { MoneyInput } from '../../components/Forms/MoneyInput';
import { z } from 'zod';

const costSchema = z.object({
  CostoTotal: z
    .string()
    .min(1, 'El costo es obligatorio')
    .transform((val) => Number(val)),
});

interface CostModalProps {
  show: boolean;
  onHide: () => void;
  projectId?: number;
  onCostSubmitted: (data: { CostoTotal: number }) => void;
}

export const CostModal: React.FC<CostModalProps> = ({
  show,
  onHide,
  onCostSubmitted,
}) => {
  const handleCostSubmit = async (data: { CostoTotal: number }) => {
    onCostSubmitted(data);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Costo Final del Proyecto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form schema={costSchema} onSubmit={handleCostSubmit} mode="onBlur">
          <MoneyInput
            name="CostoTotal"
            label="Costo Final"
            placeholder="Ingrese el costo final"
          />
          <div className="d-flex justify-content-end mt-3">
            <Button variant="danger" className="text-white" onClick={onHide}>
              Cancelar
            </Button>
            <Button type="submit" variant="success" className="ms-2 text-white">
              Guardar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
