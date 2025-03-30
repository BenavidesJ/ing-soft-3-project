import React from 'react';
import { Modal } from 'react-bootstrap';
import { useLocation } from 'react-router';
import { ProjectDetail } from './TableDetailModals/ProjectDetail';
import { TaskDetail } from './TableDetailModals/TaskDetail';
import { UserDetail } from './TableDetailModals/UserDetail';

interface DetailsModalProps<T = any> {
  title?: React.ReactNode | string;
  show: boolean;
  hide: () => void;
  data?: T;
}

export const DetailsModal = <T,>({
  show,
  hide,
  data,
}: DetailsModalProps<T>) => {
  const location = useLocation();

  let ContentComponent: React.ComponentType<{ data: T }> | null = null;

  if (location.pathname.includes('gestion-proyectos')) {
    ContentComponent = ProjectDetail;
  } else if (location.pathname.includes('gestion-tareas')) {
    ContentComponent = TaskDetail;
  } else if (location.pathname.includes('gestion-usuarios')) {
    ContentComponent = UserDetail;
  }

  return (
    <Modal show={show} onHide={hide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{(data as any)?.Nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {ContentComponent ? (
          <ContentComponent data={data!} />
        ) : (
          <div>No se encontró componente para esta ruta</div>
        )}
      </Modal.Body>
    </Modal>
  );
};
