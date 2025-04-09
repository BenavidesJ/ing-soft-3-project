import React from 'react';

export interface PDFPageProps {
  pageNumber: number;
  totalPages: number;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const PDFPage: React.FC<PDFPageProps> = ({
  pageNumber,
  totalPages,
  children,
  header,
  footer,
}) => {
  return (
    <div
      className="pdf-page"
      style={{
        width: '200mm',
        minHeight: '150mm',
        padding: '10mm',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        margin: 'auto',
        pageBreakAfter: 'always',
      }}
    >
      {/* Cabecera */}
      <div style={{ marginBottom: '10mm' }}>
        {header ? (
          header
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '10px',
              background: '#0b5a5e',
              color: '#fff',
            }}
          >
            <h3 style={{ margin: 0 }}>Dunamys S.A</h3>
            <h4 style={{ textDecoration: 'underline', marginTop: '5px' }}>
              REPORTE
            </h4>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div>{children}</div>

      {/* Pie de Página */}
      <div
        style={{
          textAlign: 'right',
          marginTop: '10mm',
          borderTop: '1px solid #000',
          paddingTop: '5mm',
        }}
      >
        {footer ? (
          footer
        ) : (
          <span>
            Pag {pageNumber}/{totalPages}
          </span>
        )}
      </div>
    </div>
  );
};

export default PDFPage;
