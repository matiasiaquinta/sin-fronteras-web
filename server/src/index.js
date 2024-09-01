import 'dotenv/config'; // Para cargar la variable del .env
import path from 'path';

import app from './app.js';
import { PORT } from './config.js';
import { connectDB } from './db.js';

export default async function main() {
  try {
    // Conectar a la base de datos
    connectDB().then(() => {
      // Iniciar el servidor solo después de que la conexión a la base de datos esté establecida
      app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
      });
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

main();
