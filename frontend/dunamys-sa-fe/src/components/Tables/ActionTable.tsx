import React, { useState } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import { DetailsModal } from '../Modal/DetailsModal';

export interface ActionTableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

interface ActionTableProps<T> {
  columns: ActionTableColumn<T>[];
  data: T[];
  rowStyle?: (row: T) => React.CSSProperties;
}

export function ActionTable<T>({
  columns,
  data,
  rowStyle,
}: ActionTableProps<T>) {
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowClick = (row: T) => {
    setSelectedRow(row);
    setShowModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Table bordered responsive hover striped className="table-sm text-center">
        <thead className="primary" style={{ borderRadius: '20px' }}>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              style={rowStyle ? rowStyle(row) : undefined}
              onClick={() => handleRowClick(row)}
            >
              {columns.map((col, colIdx) => {
                let cell;
                if (typeof col.accessor === 'string') {
                  cell = row[col.accessor];
                } else if (typeof col.accessor === 'function') {
                  cell = col.accessor(row);
                }
                return <td key={colIdx}>{cell as React.ReactNode}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />
        {Array.from({ length: totalPages }, (_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={idx + 1 === currentPage}
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

      <DetailsModal
        show={showModal}
        hide={() => setShowModal(false)}
        title="Detalles"
        data={selectedRow}
      />
    </>
  );
}
