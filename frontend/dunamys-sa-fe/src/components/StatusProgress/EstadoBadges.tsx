import React, { useEffect, useState } from 'react';
import { Badge, Spinner } from 'react-bootstrap';
import { getEstadoById } from '../../services/estado';
import { Estado } from '../../services/types';

interface EstadoBadgesProps {
  estadoId: number;
}

export const EstadoBadges: React.FC<EstadoBadgesProps> = ({ estadoId }) => {
  const [currentEstado, setCurrentEstado] = useState<Estado | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchEstado = async () => {
      setLoading(true);
      try {
        const resCurrent = await getEstadoById(estadoId);
        setCurrentEstado(resCurrent.data.data || null);
      } finally {
        setLoading(false);
      }
    };
    fetchEstado();
  }, [estadoId]);

  const getBadgeVariant = (index: number): string => {
    if (!currentEstado) return 'light';
    const estadoNombre = currentEstado.NombreEstado.toLowerCase();
    if (estadoNombre === 'pendiente') return 'light';
    if (estadoNombre === 'en progreso') return index < 2 ? 'warning' : 'light';
    if (estadoNombre === 'finalizado') return 'success';
    return 'light';
  };

  if (loading) return <Spinner animation="border" />;
  if (!currentEstado) return null;

  return (
    <div style={{ textAlign: 'center' }}>
      <div>
        {[0, 1, 2].map((i) => (
          <Badge
            key={i}
            bg={getBadgeVariant(i)}
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
