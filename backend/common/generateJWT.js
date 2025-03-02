import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const generateJWT = (dataUsuario) => {
  const token = jwt.sign({ dataUsuario }, process.env.JWT_SECRET, {
    expiresIn: '3h',
  });
  return token;
};
