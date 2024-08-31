import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, registerRequest, verifyTokenRequest } from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    } else {
        return context;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    //para saber si ya inicio sesion
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    //para leer los errores del backend
    const [errors, setErrors] = useState([]);
    //para hacer un cargador y evitar errores
    const [loading, setLoading] = useState(true);

    //esto va a recibir los datos del usuario (registro)
    const signup = async (user) => {
        try {
            const res = await registerRequest(user);
            //console.log(res.data);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            //console.log(error);
            //console.log(error.response);
            setErrors(error.response.data);
        }
    };

    //Espera los datos para logearse (login)
    const signin = async (user) => {
        try {
            const res = await loginRequest(user);
            //console.log("res.data", res.data);

            // Obtener el token del servidor
            const { token, ...userData } = res.data;

            console.log("token frontend: ", token);
            console.log("userData: ", userData);

            // Setear el token en una cookie usando js-cookie
            Cookies.set("token", token, { expires: 7, path: "/" });

            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.log(error);
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            } else {
                setErrors([error.response.data.message]);
            }
        }
    };

    //logout
    const logout = () => {
        Cookies.remove("token");
        setIsAuthenticated(false);
        setUser(null);
    };

    //para borrar los errores a los 5 segundos
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    //para que al recargar la web no se pierda la autenticación
    useEffect(() => {
        async function checkLogin() {
            const token = Cookies.get("token"); // Obtener el token de la cookie
            //console.log("token useEfect recargar: ", token);

            // Si no hay token, se establece que el usuario no está autenticado
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                // Hacer la solicitud para verificar el token
                const res = await verifyTokenRequest(token);

                // Si la respuesta es válida, establece que el usuario está autenticado
                if (res.data) {
                    setIsAuthenticated(true);
                    setUser(res.data); // Guardar los datos del usuario
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                // Si ocurre un error, se considera que el usuario no está autenticado
                console.log(error);
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        checkLogin();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                //exporto las variables:
                signup,
                signin,
                logout,
                loading,
                setLoading,
                user,
                isAuthenticated,
                errors,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
