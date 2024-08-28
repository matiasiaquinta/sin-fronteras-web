import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config"; // Cargar variables de entorno. No se si hace falta ponerlo aca

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

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", alumnosRoutes);
app.use("/api", planRoutes);

export default app;
