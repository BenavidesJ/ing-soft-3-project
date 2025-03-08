import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

export const isValidDateFormat = (date) => {
  if (date instanceof Date) {
    if (isNaN(date.getTime())) {
      return false;
    }

    date = dayjs(date).format('DD/MM/YYYY');
  }

  const parsedDate = dayjs(date, 'DD/MM/YYYY', true);
  return parsedDate.isValid();
};
