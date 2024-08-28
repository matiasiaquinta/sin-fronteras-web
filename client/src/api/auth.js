import Cookies from "js-cookie";
import axios from "./axios";

export const registerRequest = async (user) =>
    axios.post(`/auth/register`, user);

export const loginRequest = async (user) => axios.post(`/auth/login`, user);

export const logoutRequest = async () => axios.post(`/auth/logout`);

export const verifyTokenRequest = async () => {
    const token = Cookies.get("token"); // Obtener el token de la cookie

    if (!token) {
        throw new Error("No token found");
    }

    return axios.get(`/auth/verify`, {
        headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado Authorization
        },
    });
};

/* export const verifyTokenRequest = async () => axios.get(`/auth/verify`); */
