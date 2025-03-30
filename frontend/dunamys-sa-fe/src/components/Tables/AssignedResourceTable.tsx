import React, { useState } from 'react';
import { Table, Pagination, Button } from 'react-bootstrap';
import { Recurso } from '../../services/types';

interface AssignedResourcesTableProps {
  resources: Recurso[];
  onEditResource?: (resource: Recurso) => void;
}

export const AssignedResourcesTable: React.FC<AssignedResourcesTableProps> = ({
  resources,
  onEditResource,
}) => {
  const rowsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(resources.length / rowsPerPage);

  const paginatedResources = resources.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            {onEditResource ? <th>Acciones</th> : null}
          </tr>
        </thead>
        <tbody>
          {paginatedResources.map((rec) => (
            <tr key={rec.idRecurso}>
              <td>{rec.idRecurso}</td>
              <td>{rec.Nombre}</td>
              {onEditResource && (
                <td>
                  {onEditResource && (
                    <Button
                      size="sm"
                      variant="info"
                      className="me-2"
                      onClick={() => onEditResource(rec)}
                    >
                      Editar
                    </Button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      {resources.length > rowsPerPage && (
        <Pagination className="justify-content-center">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          />
          {Array.from({ length: totalPages }, (_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={currentPage === idx + 1}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </Pagination>
      )}
    </>
  );
};
