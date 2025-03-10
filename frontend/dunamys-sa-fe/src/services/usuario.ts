import api from './api';

export const getUserByID = (userID: number) => {
  return api.get(`usuarios/${userID}`);
};
