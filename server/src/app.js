import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config'; // Cargar variables de entorno. No se si hace falta ponerlo aca
import path from 'path';
import { fileURLToPath } from 'url'; // Correctly import fileURLToPath

import authRoutes from './routes/auth.routes.js';
import alumnosRoutes from './routes/alumnos.routes.js';
import planRoutes from './routes/plan.routes.js';
import { FRONTEND_URL } from './config.js';
const app = express();

// Resolve the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, 'build')));

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// Manejar preflight requests para CORS
app.options('*', cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api', alumnosRoutes);
app.use('/api', planRoutes);

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

export default app;
