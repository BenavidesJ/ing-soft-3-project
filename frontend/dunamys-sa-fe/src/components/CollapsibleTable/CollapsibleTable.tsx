import React, { useState } from 'react';
import { Table } from 'react-bootstrap';

interface CollapsibleTableProps<T> {
  data: T[];

  renderMainRow: (item: T) => React.ReactNode;

  renderExpandedRow: (item: T) => React.ReactNode;

  header: React.ReactNode;

  rowKey: (item: T) => string | number;

  colSpan: number;
}

export function CollapsibleTable<T>({
  data,
  renderMainRow,
  renderExpandedRow,
  header,
  rowKey,
  colSpan,
}: CollapsibleTableProps<T>) {
  const [expandedRow, setExpandedRow] = useState<string | number | null>(null);

  const handleRowClick = (key: string | number) => {
    setExpandedRow((prev) => (prev === key ? null : key));
  };

  return (
    <Table striped bordered hover responsive className="table-sm text-center">
      <thead>{header}</thead>
      <tbody>
        {data.map((item) => {
          const key = rowKey(item);
          return (
            <React.Fragment key={key}>
              <tr
                onClick={() => handleRowClick(key)}
                style={{ cursor: 'pointer' }}
              >
                {renderMainRow(item)}
              </tr>
              {expandedRow === key && (
                <tr>
                  <td colSpan={colSpan}>{renderExpandedRow(item)}</td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </Table>
  );
}
