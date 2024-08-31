import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config"; // Cargar variables de entorno. No se si hace falta ponerlo aca
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import alumnosRoutes from "./routes/alumnos.routes.js";
import planRoutes from "./routes/plan.routes.js";
import { FRONTEND_URL } from "./config.js";

const app = express();

app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
    })
);

// Manejar preflight requests para CORS
app.options("*", cors());

app.get("/", (req, res) => {
    res.json("Hello");
});

// Sirviendo archivos estáticos en producción
if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve(); // Resuelve la ruta absoluta
    app.use(express.static(path.join(__dirname, "dist"))); // Sirve archivos estáticos del frontend

    // Para todas las rutas que no sean de la API, devuelve el archivo index.html
    app.get("/*", (req, res) => {
        res.sendFile(
            path.join(__dirname, "dist", "index.html"),
            function (err) {
                if (err) {
                    res.status(500).send(err);
                }
            }
        );
    });
}

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", alumnosRoutes);
app.use("/api", planRoutes);

export default app;
