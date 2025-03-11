import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'react-bootstrap';
import { getProyectoById } from '../../services/proyecto';
import { Proyecto } from '../../services/types';
import { PrivateLayout } from '../layouts/PrivateLayout';
import { useLoading } from '../../context/LoadingContext';

export const DetalleProyecto: React.FC = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Proyecto | undefined>();
  const [error, setError] = useState<string | null>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const response = await getProyectoById(Number(id));
        setProject(response.data.data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el proyecto.');
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!project) {
    return <Alert variant="info">Proyecto no encontrado.</Alert>;
  }

  return (
    <PrivateLayout>
      <div className="p-3">
        <h2>Detalles del Proyecto</h2>
        <p>
          <strong>ID:</strong> {project.idProyecto}
        </p>
        <p>
          <strong>Nombre:</strong> {project.Nombre}
        </p>
        <p>
          <strong>Descripción:</strong> {project.Descripcion}
        </p>
        <p>
          <strong>Objetivo:</strong> {project.Objetivo}
        </p>
        <p>
          <strong>Fecha de Inicio:</strong> {project.FechaInicio}
        </p>
        <p>
          <strong>Fecha de Fin:</strong> {project.FechaFin || '-'}
        </p>
        <p>
          <strong>Presupuesto:</strong> {project.Presupuesto}
        </p>
      </div>
    </PrivateLayout>
  );
};
