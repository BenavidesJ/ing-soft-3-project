import { Container, Nav } from 'react-bootstrap';
import { BrandName } from '../../utils/strings';
import { Link } from 'react-router';
import { UserProfile } from '../../components/UserProfile/UserProfile';

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      <aside
        className="bg-brand text-white p-3 d-flex flex-column"
        style={{ width: '250px' }}
      >
        <div className="mb-4">
          <h4>{BrandName}</h4>
        </div>

        <Nav className="flex-column" defaultActiveKey="/dashboard">
          <Nav.Link
            as={Link}
            eventKey={'dashboard'}
            to="/dashboard"
            className="text-white"
          >
            Dashboard
          </Nav.Link>
          <Nav.Link
            as={Link}
            eventKey={'gestion-proyectos'}
            to="/gestion-proyectos"
            className="text-white"
          >
            Gestión de Proyectos
          </Nav.Link>
          <Nav.Link as={Link} to="/gestion-tareas" className="text-white">
            Gestión de Tareas
          </Nav.Link>
          <Nav.Link as={Link} to="/gestion-usuarios" className="text-white">
            Gestión de Usuarios
          </Nav.Link>
          <Nav.Link as={Link} to="/reportes" className="text-white">
            Reportes
          </Nav.Link>
        </Nav>

        <div className="mt-auto">
          <UserProfile />
        </div>
      </aside>

      <main className="flex-grow-1" style={{ overflowY: 'auto' }}>
        <Container fluid className="p-3">
          {children}
        </Container>
      </main>
    </div>
  );
};
