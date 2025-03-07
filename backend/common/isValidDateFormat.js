import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const isValidDateFormat = (date) => {
  const [day, month, year] = date.split('/').map(Number);

  if (!day || !month || !year) return false;

  const dateObj = new Date(year, month - 1, day);

  if (
    dateObj.getDate() !== day ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getFullYear() !== year
  ) {
    return false;
  }

  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);

  return date === formattedDate;
};
