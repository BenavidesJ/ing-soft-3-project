import dayjs from 'dayjs';
import { Col, Container, Modal, Row } from 'react-bootstrap';

interface DetailsModalProps {
  title?: React.ReactNode | string;
  show: boolean;
  hide: () => void;
  data?: any;
}

export const DetailsModal = ({ show, hide, data }: DetailsModalProps) => {
  console.log('debug data', data);
  return (
    <Modal centered show={show} onHide={hide}>
      <Modal.Header closeButton>
        <Modal.Title>{data?.Nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col xs={12} md={8} style={{ border: '1px solid red' }}>
              Descripcion: {data?.Descripcion}
            </Col>
            <Col xs={6} md={4} style={{ border: '1px solid red' }}>
              Fecha de Inicio: {dayjs(data?.FechaInicio).format('DD/MM/YYYY')}
            </Col>
          </Row>

          <Row>
            <Col xs={6} md={4} style={{ border: '1px solid red' }}>
              Fecha de Finalizacion:{' '}
              {data?.FechaFin
                ? dayjs(data?.FechaFin).format('DD/MM/YYYY')
                : 'No definida'}
            </Col>
            <Col xs={12} md={8} style={{ border: '1px solid red' }}>
              Estado: {data?.Descripcion}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};
