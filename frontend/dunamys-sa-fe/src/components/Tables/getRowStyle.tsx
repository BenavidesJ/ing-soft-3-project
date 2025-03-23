import dayjs from 'dayjs';
import { Proyecto, Tarea } from '../../services/types';

export const getRowStyle = (row: Proyecto | Tarea): React.CSSProperties => {
  if (!row.FechaFin) return {};

  const diffDays = dayjs(row.FechaFin).diff(dayjs(), 'day');

  const estadoFinalizado = row.idEstado === 3;

  if (!estadoFinalizado) {
    if (diffDays < 0) {
      return { border: '2px solid #9d294a' };
    }
    if (diffDays <= 5) {
      return { border: '2px solid #d1e42f' };
    }
  }
  return {};
};
