/*
    Aca estan todas las funciones relacionadas con obtener
    los datos de los usuarios del backend

*/

//import { createAlumnoSchema } from "../../../server/src/schemas/alumno.schema";
import Cookies from "js-cookie";
import axios from "./axios";

// Obtiene todos los alumnos
export const getAlumnosRequest = () => axios.get("alumnos");

export const getAlumnosStatsRequest = async () => {
    const token = Cookies.get("token"); // Obtener el token de la cookie

    if (!token) {
        throw new Error("No token found");
    }

    try {
        const response = await axios.get("/alumnos/stats", {
            headers: {
                Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener los alumnos:", error);
        throw error;
    }
};

// Obtiene los pagos de todos los alumnos (para mostrar en reportes)
export const getAlumnosPagosRequest = async (mes, año) => {
    try {
        const response = await axios.get(`/alumnos/pagos`, {
            params: { mes, año },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener los pagos:", error);
        throw error;
    }
};

// Obtiene un alumno especifico
export const getAlumnoRequest = (id) => axios.get(`/alumnos/${id}`);

// Crear Alumno
export const createAlumnoRequest = async (alumno) => {
    try {
        // Validar los datos del alumno usando el esquema de Zod
        //createAlumnoSchema.parse(alumno);

        // Si pasa la validación, enviar la solicitud al servidor
        const response = await axios.post("/alumnos", alumno);
        return response.data;
    } catch (error) {
        console.error(
            "Error al crear el alumno:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }
};

// Actualizar Alumno
export const updateAlumnoRequest = (id, alumno) =>
    axios.put(`/alumnos/${id}`, alumno);

// Eliminar Alumno
export const deleteAlumnoRequest = (id) => axios.delete(`/alumnos/${id}`);
