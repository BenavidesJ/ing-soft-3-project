import { Card, Col, Row } from 'react-bootstrap';
import { PrivateLayout } from '../layouts/PrivateLayout';
import { BrandName } from '../../utils/strings';

export const Dashboard = () => {
  return (
    <PrivateLayout>
      <Row className="mb-4">
        <h3 className="mb-3">
          Bienvenido al sistema de gestion de proyectos de {BrandName}
        </h3>
        <Col md={3}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Proyectos activos</Card.Title>
              <h3>2</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Proyectos Completados</Card.Title>
              <h3>8053</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Tareas Activas</Card.Title>
              <h3>0</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Problemas Técnicos</Card.Title>
              <h3>1434</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Ejecuciones Mensuales</Card.Title>

              <div
                style={{
                  height: '300px',
                  backgroundColor: '#f1f1f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span>Placeholder Chart</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Ejecuciones Diarias</Card.Title>

              <div
                style={{
                  height: '300px',
                  backgroundColor: '#f1f1f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span>Placeholder Chart</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </PrivateLayout>
  );
};
