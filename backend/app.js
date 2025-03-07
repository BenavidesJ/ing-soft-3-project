import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { db_connection } from './database.js';
import { API_URL } from './common/strings.js';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';

dotenv.config();

const app = express();
const port = process.env.APP_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use(`${API_URL}/auth`, authRoutes);
app.use(`${API_URL}/usuarios`, userRoutes);

app.listen(port, () => {
  db_connection();
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
