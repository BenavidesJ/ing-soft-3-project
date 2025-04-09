import React from 'react';
import PDFPage from './PDFPage';

export interface PaginatedPDFTemplateProps<T> {
  data: T[];
  itemsPerPage: number;
  renderPageContent: (pageData: T[], pageIndex: number) => React.ReactNode;
  header?: React.ReactNode;
  footer?: (pageNumber: number, totalPages: number) => React.ReactNode;
}

export function PaginatedPDFTemplate<T>({
  data,
  itemsPerPage,
  renderPageContent,
  header,
  footer,
}: PaginatedPDFTemplateProps<T>) {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pages = Array.from({ length: totalPages }).map((_, pageIndex) => {
    const startIndex = pageIndex * itemsPerPage;
    const pageData = data.slice(startIndex, startIndex + itemsPerPage);
    return (
      <PDFPage
        key={pageIndex}
        pageNumber={pageIndex + 1}
        totalPages={totalPages}
        header={header}
        footer={footer ? footer(pageIndex + 1, totalPages) : undefined}
      >
        {renderPageContent(pageData, pageIndex)}
      </PDFPage>
    );
  });
  return <div id="pdf-preview">{pages}</div>;
}
