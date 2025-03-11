import { Alert, Table } from 'react-bootstrap';
import { PrivateLayout } from '../layouts/PrivateLayout';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getAllProyectos, getProyectoById } from '../../services/proyecto';
import { Proyecto } from '../../services/types';
import { useLoading } from '../../context/LoadingContext';

export const GestionProyectos = () => {
  const [projects, setProjects] = useState<Proyecto[] | undefined>();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const response = await getAllProyectos();
        setProjects(response.data.data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar proyectos.');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [setLoading]);

  const handleRowClick = async (projectId: number) => {
    try {
      const response = await getProyectoById(projectId);
      navigate(`/proyecto/${projectId}`, { state: response.data.data });
    } catch (err: any) {
      setError(err.message || 'Error al obtener detalles del proyecto.');
    }
  };

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <PrivateLayout>
      {' '}
      <div className="p-3">
        {projects && projects.length === 0 ? (
          <Alert variant="info">No hay proyectos disponibles.</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Objetivo</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Presupuesto</th>
              </tr>
            </thead>
            <tbody>
              {projects &&
                projects.map((project) => (
                  <tr
                    key={project.idProyecto}
                    onClick={() => handleRowClick(project.idProyecto)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{project.idProyecto}</td>
                    <td>{project.Nombre}</td>
                    <td>{project.Descripcion}</td>
                    <td>{project.Objetivo}</td>
                    <td>{project.FechaInicio}</td>
                    <td>{project.FechaFin || '-'}</td>
                    <td>{project.Presupuesto}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </div>
    </PrivateLayout>
  );
};
