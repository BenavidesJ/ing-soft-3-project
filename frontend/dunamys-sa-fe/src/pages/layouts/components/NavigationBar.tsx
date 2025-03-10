import { Container, Navbar } from 'react-bootstrap';
import { Logo } from '../../../components';
import { BrandName } from '../../../utils/strings';

export const NavigationBar = () => {
  return (
    <Navbar bg="brand" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">
          <Logo text={BrandName} />
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};
