import dotenv from 'dotenv';
import express from 'express';
import { sequelize } from './database.js';
import { Usuario } from './models/Usuario.js';

dotenv.config();

const app = express();
const port = process.env.APP_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/users', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const db_connection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

app.listen(port, () => {
  db_connection();
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
