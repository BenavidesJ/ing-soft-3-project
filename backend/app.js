import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const app = express();
const port = process.env.APP_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Servidor express');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
