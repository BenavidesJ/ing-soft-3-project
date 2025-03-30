import { Modal } from 'react-bootstrap';
import { DetailsContent } from './TaskDetail/TaskDetail';

interface DetailsModalProps {
  title?: React.ReactNode | string;
  show: boolean;
  hide: () => void;
  data?: any;
}

export const DetailsModal = ({ show, hide, data }: DetailsModalProps) => {
  return (
    <Modal show={show} onHide={hide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{data?.Nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DetailsContent data={data} />
      </Modal.Body>
    </Modal>
  );
};
