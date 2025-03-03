import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const isValidDateFormat = (date) => {
  const formatedDate = dayjs(date, 'DD/MMM/YYYY', true);

  return formatedDate.isValid();
};
