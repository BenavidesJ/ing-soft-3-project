import express from 'express';
import {
  login,
  registro,
  resetearPassword,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', login);

router.post('/registro', registro);

router.post('/resetearPassword', resetearPassword);

export default router;
