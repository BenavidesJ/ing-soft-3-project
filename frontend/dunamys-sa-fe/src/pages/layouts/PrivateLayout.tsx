import { Container } from 'react-bootstrap';
import { Sidebar } from './components/sidebar/Sidebar';
import './styles/Dashboard.scss';
import { NavigationBar } from './components/NavigationBar';
import { LoadingOverlay } from '../../components';
import { BrandName } from '../../utils/strings';

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  return (
    <div className="wrapper" style={{ height: '100vh' }}>
      <Sidebar />

      <main className="flex-grow-1">
        <NavigationBar />
        <Container fluid className="p-3">
          {children}
        </Container>
        <footer>
          &copy; {new Date().getFullYear()} {BrandName} | Todos los derechos
          reservados.
        </footer>
        <LoadingOverlay />
      </main>
    </div>
  );
};
