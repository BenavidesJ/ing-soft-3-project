import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ReportModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  children: React.ReactNode;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  show,
  onHide,
  title,
  children,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
