import React, { useState } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import { Recurso } from '../../services/types';

interface UnassignedResourcesTableProps {
  resources: Recurso[];
  onSelectionChange: (selectedIds: number[]) => void;
  onDeleteResource: (idRecurso: number) => void;
  onEditResource: (resource: Recurso) => void;
}

export const UnassignedResourcesTable: React.FC<
  UnassignedResourcesTableProps
> = ({ resources, onSelectionChange, onDeleteResource, onEditResource }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleCheckboxChange = (id: number, checked: boolean) => {
    let newSelected = [...selectedIds];
    if (checked) {
      newSelected.push(id);
    } else {
      newSelected = newSelected.filter((item) => item !== id);
    }
    setSelectedIds(newSelected);
    onSelectionChange(newSelected);
  };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Seleccionar</th>
          <th>ID</th>
          <th>Nombre</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {resources.map((rec) => (
          <tr key={rec.idRecurso}>
            <td>
              <Form.Check
                type="checkbox"
                onChange={(e) =>
                  handleCheckboxChange(rec.idRecurso, e.target.checked)
                }
                checked={selectedIds.includes(rec.idRecurso)}
              />
            </td>
            <td>{rec.idRecurso}</td>
            <td>{rec.Nombre}</td>
            <td>
              <Button
                variant="warning"
                size="sm"
                onClick={() => onEditResource(rec)}
                className="me-2"
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDeleteResource(rec.idRecurso)}
              >
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
