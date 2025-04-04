import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { db_connection } from './database.js';
import { API_URL } from './common/strings.js';
import { errorHandler } from './middlewares/handleErrors.js';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import statusRoutes from './routes/estado.route.js';
import projectRoutes from './routes/proyecto.route.js';
import resourcesRoutes from './routes/recursos.route.js';
import taskRoutes from './routes/tarea.route.js';
import reportesRoutes from './routes/reportes.route.js';

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
app.use(`${API_URL}/estados`, statusRoutes);
app.use(`${API_URL}/proyectos`, projectRoutes);
app.use(`${API_URL}/tareas`, taskRoutes);
app.use(`${API_URL}/recursos`, resourcesRoutes);
app.use(`${API_URL}/reportes`, reportesRoutes);

import('./hooks/eventTracker.js');

app.use(errorHandler);

app.listen(port, () => {
  db_connection();
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
