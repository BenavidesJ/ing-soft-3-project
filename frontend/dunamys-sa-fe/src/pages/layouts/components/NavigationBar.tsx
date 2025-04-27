import { Container, Navbar } from 'react-bootstrap';
import { Logo, UserProfile } from '../../../components';
import { BrandName } from '../../../utils/strings';
import { useLocation } from 'react-router';
import { getPageName } from '../../../utils/getPageName';

export const NavigationBar = () => {
  const { pathname } = useLocation();
  return (
    <Navbar bg="brand" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand href={pathname}>
          {pathname === '/login' ||
          pathname === '/register' ||
          pathname === '/forgot-password' ? (
            <Logo text={BrandName} />
          ) : (
            <>
              <Logo text={BrandName} />
              {getPageName(pathname)}
            </>
          )}
        </Navbar.Brand>
        <div>
          {pathname !== '/login' && pathname !== '/registro' && <UserProfile />}
        </div>
      </Container>
    </Navbar>
  );
};
