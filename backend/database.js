import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const { DB_NAME, DB_PASSWORD, DB_USER, DB_HOST } = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
});

export const db_connection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log('La conexion ha sido establecida correctamente.');
  } catch (error) {
    console.error('No se puede conectar a la base de datos, Error:', error);
  }
};
