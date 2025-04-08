import { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import dayjs from 'dayjs';
import { PrivateLayout } from '../layouts/PrivateLayout';
import { BrandName } from '../../utils/strings';
import { useAuth } from '../../context';
import { Proyecto, Tarea } from '../../services/types';
import { getProyectoByUser } from '../../services/proyecto';
import { getTareasByMember } from '../../services/tarea';
import {
  EstadoBadges,
  Column,
  SimpleTable,
  getRowStyle,
} from '../../components';

export const Dashboard = () => {
  const { currentUser } = useAuth();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);

  useEffect(() => {
    const fetchProyectos = async () => {
      if (currentUser?.idUsuario) {
        const response = await getProyectoByUser(currentUser.idUsuario);
        const { data } = response;

        let proyectosArray: Proyecto[] = [];
        if (data.data) {
          const temp = Array.isArray(data.data) ? data.data : [data.data];
          proyectosArray = temp.filter(
            (proyecto: Proyecto) => proyecto.idEstado !== 3
          );
        }

        setProyectos(proyectosArray);
      }
    };
    fetchProyectos();
  }, [currentUser]);

  useEffect(() => {
    const fetchTareas = async () => {
      if (currentUser?.idUsuario) {
        const response = await getTareasByMember(currentUser.idUsuario);
        const { data } = response;

        let tareasArray: Tarea[] = [];
        if (data.data) {
          const temp = Array.isArray(data.data) ? data.data : [data.data];
          tareasArray = temp.filter((tarea: Tarea) => tarea.idEstado !== 3);
        }

        setTareas(tareasArray);
      }
    };
    fetchTareas();
  }, [currentUser]);

  const proyectosColumns: Column<Proyecto>[] = [
    { header: 'Nombre', accessor: 'Nombre' },
    { header: 'Descripción', accessor: 'Descripcion' },
    {
      header: 'Fecha Límite',
      accessor: (row) =>
        row.FechaFin ? dayjs(row.FechaFin).format('DD/MM/YYYY') : '-',
    },
    {
      header: 'Días Restantes',
      accessor: (row) => {
        if (!row.FechaFin) return '-';
        const diffDays = dayjs(row.FechaFin).diff(dayjs(), 'day');
        return diffDays;
      },
    },
    {
      header: 'Estado',
      accessor: (row) => <EstadoBadges estadoId={row.idEstado} />,
    },
  ];

  const tareasColumns: Column<Tarea>[] = [
    { header: 'Nombre', accessor: 'Nombre' },
    { header: 'Descripción', accessor: 'Descripcion' },
    {
      header: 'Fecha Límite',
      accessor: (row) =>
        row.FechaFin ? dayjs(row.FechaFin).format('DD/MM/YYYY') : '-',
    },
    {
      header: 'Días Restantes',
      accessor: (row) => {
        if (!row.FechaFin) return '-';
        const diffDays = dayjs(row.FechaFin).diff(dayjs(), 'day');
        return diffDays;
      },
    },
    {
      header: 'Estado',
      accessor: (row) => <EstadoBadges estadoId={row.idEstado} />,
    },
  ];

  return (
    <PrivateLayout>
      <Row className="mb-4 align-items-center">
        <h3 className="mb-3">
          Bienvenido al sistema de gestion de proyectos de {BrandName}
        </h3>
      </Row>

      <Row>
        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>
                Proyectos activos asignados a {currentUser?.Nombre}
              </Card.Title>
              <SimpleTable
                data={proyectos}
                columns={proyectosColumns}
                rowStyle={(row) => getRowStyle(row)}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>
                Tareas activas asignadas a {currentUser?.Nombre}
              </Card.Title>
              <SimpleTable
                data={tareas}
                columns={tareasColumns}
                rowStyle={(row) => getRowStyle(row)}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </PrivateLayout>
  );
};
