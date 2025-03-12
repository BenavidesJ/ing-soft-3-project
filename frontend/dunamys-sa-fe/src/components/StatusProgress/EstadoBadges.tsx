import React, { useEffect, useState } from 'react';
import { Badge, Spinner } from 'react-bootstrap';
import { getEstadoById, getAllEstados } from '../../services/estado';
import { Estado } from '../../services/types';

interface EstadoBadgesProps {
  estadoId: number;
}

export const EstadoBadges: React.FC<EstadoBadgesProps> = ({ estadoId }) => {
  const [allEstados, setAllEstados] = useState<Estado[]>([]);
  const [currentEstado, setCurrentEstado] = useState<Estado | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchEstados = async () => {
      setLoading(true);
      try {
        const resAll = await getAllEstados();
        setAllEstados(resAll.data.data || []);

        const resCurrent = await getEstadoById(estadoId);
        setCurrentEstado(resCurrent.data.data || null);
      } catch (err: any) {
      } finally {
        setLoading(false);
      }
    };

    fetchEstados();
  }, [estadoId]);

  const getBadgeVariant = (estado: Estado) => {
    if (!currentEstado) return 'light';

    if (currentEstado.idEstado === 1) {
      return 'light';
    } else if (currentEstado.idEstado === 2) {
      return estado.idEstado === 2 ? 'warning' : 'light';
    } else if (currentEstado.idEstado === 3) {
      return 'success';
    }
    return 'light';
  };

  if (loading) return <Spinner animation="border" />;
  if (!currentEstado) return null;

  return (
    <div style={{ textAlign: 'center' }}>
      <div>
        {allEstados.map((estado) => (
          <Badge
            key={estado.idEstado}
            bg={getBadgeVariant(estado)}
            pill
            style={{
              marginRight: '4px',
              width: '25px',
              height: '10px',
              borderRadius: '50%',
              border: '1px solid black',
              display: 'inline-block',
            }}
          />
        ))}
      </div>
      <small>{currentEstado.NombreEstado}</small>
    </div>
  );
};
