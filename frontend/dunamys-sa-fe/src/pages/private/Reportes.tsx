import React, { useState, useEffect } from 'react';
import { reportConfigurations } from '../layouts/components/reports/reportsConfig';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Modal, Table, Form, Row, Col, Alert } from 'react-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PrivateLayout } from '../layouts/PrivateLayout';
import { ReportConfig } from '../layouts/components/reports/types';

interface ReportFormValues {
  reportId: string;
  filters?: { [key: string]: any };
}

const baseSchema = z.object({
  reportId: z.string().nonempty('Selecciona un reporte'),
  filters: z.record(z.any()).optional(),
});

export const Reportes: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReportConfig | null>(
    null
  );
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const methods = useForm<ReportFormValues>({
    defaultValues: { reportId: '', filters: {} },
    resolver: zodResolver(baseSchema),
  });

  const { register, handleSubmit, watch } = methods;

  const selectedReportId = watch('reportId');
  useEffect(() => {
    const report =
      reportConfigurations.find((r) => r.id === selectedReportId) || null;
    setSelectedReport(report);
  }, [selectedReportId]);

  const onSubmit = async (data: ReportFormValues) => {
    if (!selectedReport) return;
    setLoading(true);
    setError(null);
    try {
      const fetchedData = await selectedReport.fetchData(data.filters || {});
      setReportData(fetchedData);
    } catch (err: any) {
      setError(err.message || 'Error al obtener datos del reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePreview = () => {
    if (reportData.length === 0) {
      setError('No hay datos para generar el reporte.');
      return;
    }
    setShowPreview(true);
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById('pdf-preview');
    if (!input) return;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${selectedReport?.label}.pdf`);
    });
  };

  return (
    <PrivateLayout>
      <div className="container">
        <h2 className="mt-4">Reportes</h2>
        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Reporte:
              </Form.Label>
              <Col sm={10}>
                <Form.Select {...register('reportId')}>
                  <option value="">Selecciona un reporte</option>
                  {reportConfigurations.map((report) => (
                    <option key={report.id} value={report.id}>
                      {report.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>

            {selectedReport &&
              selectedReport.filters.length > 0 &&
              selectedReport.filters.map((filter: any) => (
                <Form.Group as={Row} className="mb-3" key={filter.name}>
                  <Form.Label column sm={2}>
                    {filter.label}:
                  </Form.Label>
                  <Col sm={10}>
                    {filter.type === 'date' && (
                      <Form.Control
                        type="date"
                        {...register(`filters.${filter.name}`)}
                      />
                    )}
                    {filter.type === 'text' && (
                      <Form.Control
                        type="text"
                        {...register(`filters.${filter.name}`)}
                      />
                    )}
                    {filter.type === 'select' && (
                      <Form.Select {...register(`filters.${filter.name}`)}>
                        <option value="">Seleccione</option>
                        {filter.options &&
                          filter.options.map((option: any) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                      </Form.Select>
                    )}
                  </Col>
                </Form.Group>
              ))}

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Cargando...' : 'Consultar'}
            </Button>
          </Form>
        </FormProvider>

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}

        {reportData.length > 0 && (
          <div className="mt-4">
            <h4>Resultados:</h4>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  {selectedReport?.tableColumns.map(
                    (col: any, index: number) => (
                      <th key={index}>{col.header}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {selectedReport?.tableColumns.map(
                      (col: any, colIndex: number) => (
                        <td key={colIndex}>
                          {typeof col.accessor === 'function'
                            ? col.accessor(row)
                            : row[col.accessor]}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>

            <Button variant="secondary" onClick={handleGeneratePreview}>
              Generar Reporte
            </Button>
          </div>
        )}

        <Modal
          show={showPreview}
          onHide={() => setShowPreview(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedReport?.label} - Vista Previa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div id="pdf-preview">
              {selectedReport && (
                <selectedReport.pdfTemplate data={reportData} />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleDownloadPDF}>
              Descargar PDF
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </PrivateLayout>
  );
};
