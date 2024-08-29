/*
    Aca estan todas las funciones relacionadas con obtener
    los datos de los usuarios del backend

    # Token / Cookies del frontend:
    js-cookie
    Aca agrego los token para evitar errores de backend.
    Y los paso al backend a traves del header.

*/

//import { createAlumnoSchema } from "../../../server/src/schemas/alumno.schema";
import Cookies from "js-cookie";
import axios from "./axios";

// Obtiene todos los alumnos
export const getAlumnosRequest = async () => {
    const token = Cookies.get("token"); // Obtener el token de la cookie

    if (!token) {
        throw new Error("No token found");
    }

    try {
        const response = await axios.get("alumnos", {
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

        //console.log("statsResponseData", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los stats de los alumnos:", error);
        throw error;
    }
};

// Obtiene los pagos de todos los alumnos (para mostrar en reportes)
export const getAlumnosPagosRequest = async (mes, año) => {
    const token = Cookies.get("token"); // Obtener el token de la cookie

    if (!token) {
        throw new Error("No token found");
    }

    try {
        const response = await axios.get(`/alumnos/pagos`, {
            params: { mes, año },
            headers: {
                Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
            },
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
    const token = Cookies.get("token"); // Obtener el token de la cookie

    if (!token) {
        throw new Error("No token found");
    }

    try {
        const response = await axios.post("/alumnos", alumno, {
            headers: {
                Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear el alumno:", error);
        throw error;
    }
};

// Actualizar Alumno
export const updateAlumnoRequest = (id, alumno) => {
    const token = Cookies.get("token");

    if (!token) {
        throw new Error("No token found");
    }

    return axios.put(`/alumnos/${id}`, alumno, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

// Eliminar Alumno
export const deleteAlumnoRequest = (id) => {
    const token = Cookies.get("token");

    if (!token) {
        throw new Error("No token found");
    }

    return axios.delete(`/alumnos/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
