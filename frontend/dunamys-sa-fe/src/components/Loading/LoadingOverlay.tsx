import { Spinner } from 'react-bootstrap';
import './LoadingOverlay.scss';
import { useLoading } from '../../context/LoadingContext';

export const LoadingOverlay = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <Spinner
        animation="border"
        variant="primary"
        role="status"
        style={{ width: 100, height: 100, borderWidth: 20 }}
      >
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
    </div>
  );
};
