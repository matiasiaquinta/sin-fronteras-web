/*
    Aca estan todas las funciones relacionadas con obtener
    los datos de los planes del backend

    # Token / Cookies del frontend:
    js-cookie
    Aca agrego los token para evitar errores de backend.
    Y los paso al backend a traves del header.
*/

//import { createPlanSchema } from "../../../server/src/schemas/plan.schema";
import Cookies from "js-cookie";
import axios from "./axios";

// Obtiene todos los planes
export const getPlanesRequest = () => {
    const token = Cookies.get("token"); // Obtener el token de la cookie

    if (!token) {
        throw new Error("No token found");
    }

    try {
        const response = axios.get("/planes", {
            headers: {
                Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
            },
        });
        return response; // si uso response.data no funciona
    } catch (error) {
        console.error("Error al obtener los planes:", error);
        throw error;
    }
};

// Obtiene un plan específico
export const getPlanRequest = (id) => axios.get(`/planes/${id}`);

// Crear Plan
export const createPlanRequest = async (plan) => {
    const token = Cookies.get("token"); // Obtener el token de la cookie

    if (!token) {
        throw new Error("No token found");
    }

    try {
        const response = await axios.post("/planes", plan, {
            headers: {
                Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
            },
        });
        return response.data;
    } catch (error) {
        console.error(
            "Error al crear el plan:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }
};

// Actualizar Plan
export const updatePlanRequest = (id, plan) => {
    const token = Cookies.get("token");

    if (!token) {
        throw new Error("No token found");
    }

    return axios.put(`/planes/${id}`, plan, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

// Eliminar Plan
export const deletePlanRequest = (id) => {
    const token = Cookies.get("token");

    if (!token) {
        throw new Error("No token found");
    }

    return axios.delete(`/planes/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
