import { Container, Navbar } from 'react-bootstrap';
import { Logo, UserProfile } from '../../../components';
import { BrandName } from '../../../utils/strings';
import { useLocation } from 'react-router';

export const NavigationBar = () => {
  const { pathname } = useLocation();
  return (
    <Navbar bg="brand" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand href="/">
          {pathname !== '/dashboard' && <Logo text={BrandName} />}
        </Navbar.Brand>
        <div>
          {pathname !== '/login' && pathname !== '/registro' && <UserProfile />}
        </div>
      </Container>
    </Navbar>
  );
};
