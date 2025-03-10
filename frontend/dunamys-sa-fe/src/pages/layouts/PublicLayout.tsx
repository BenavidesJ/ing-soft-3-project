import { LoadingOverlay } from '../../components/Loading/LoadingOverlay';
import { BrandName } from '../../utils/strings';
import { NavigationBar } from './components/NavigationBar';
import './styles/Page.scss';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="layout">
      <NavigationBar />
      <main className="content">{children}</main>
      <footer>
        &copy; {new Date().getFullYear()} {BrandName} | Todos los derechos
        reservados.
      </footer>
      <LoadingOverlay />
    </div>
  );
};
