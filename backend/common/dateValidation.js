import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

export const validateDates = (fechaInicio, fechaFin) => {
  const format = 'DD/MM/YYYY';
  const startDate = dayjs(fechaInicio, format, true);
  const endDate = dayjs(fechaFin, format, true);

  if (!fechaFin) {
    if (!startDate.isValid()) {
      throw new Error(
        'El formato de la fecha de inicio no es válido, el formato correcto es (día/mes/año - dd/mmm/yyyy)'
      );
    }
  } else {
    if (!endDate.isValid()) {
      throw new Error(
        'El formato de la fecha de finalización no es válido, el formato correcto es (día/mes/año - dd/mmm/yyyy)'
      );
    }

    if (!endDate.isAfter(startDate)) {
      throw new Error(
        'La fecha de finalización debe ser posterior a la fecha de inicio'
      );
    }
  }
};
