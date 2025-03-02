import dotenv from 'dotenv';
import express from 'express';
import { db_connection } from './database.js';
import { API_URL } from './common/strings.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();
const port = process.env.APP_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${API_URL}/auth`, authRoutes);

app.listen(port, () => {
  db_connection();
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
