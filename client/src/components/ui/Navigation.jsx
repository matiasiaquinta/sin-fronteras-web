/*
    Navegación pensada para mobile.
    Es la barra de abajo que me lleva a -> Home, alumnos, ajustes, salir
*/

import {
    FaCog,
    FaGraduationCap,
    FaSignOutAlt,
    FaUser,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className="w-full h-28 bg-blue-950 flex justify-around items-center text-white text-sm md:px-36">
            <Link
                to="/"
                className={`flex flex-col items-center ${
                    currentPath === "/" ? "text-blue-300" : ""
                }`}
            >
                <div
                    className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center ${
                        currentPath === "/"
                            ? "bg-blue-400 text-white"
                            : "bg-white text-blue-950"
                    }`}
                >
                    <FaUser />
                </div>
                <span className="mt-2">Home</span>
            </Link>

            <Link
                to="/alumnos"
                className={`flex flex-col items-center ${
                    currentPath === "/alumnos" ? "text-blue-300" : ""
                }`}
            >
                <div
                    className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center ${
                        currentPath === "/alumnos"
                            ? "bg-blue-400 text-white"
                            : "bg-white text-blue-950"
                    }`}
                >
                    <FaGraduationCap />
                </div>
                <span className="mt-2">Alumnos</span>
            </Link>

            <Link
                to="/ajustes"
                className={`flex flex-col items-center ${
                    currentPath === "/ajustes" ? "text-blue-300" : ""
                }`}
            >
                <div
                    className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center ${
                        currentPath === "/ajustes"
                            ? "bg-blue-400 text-white"
                            : "bg-white text-blue-950"
                    }`}
                >
                    <FaCog />
                </div>
                <span className="mt-2">Ajustes</span>
            </Link>

            <div className="flex flex-col items-center opacity-40 cursor-not-allowed">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center bg-gray-400 text-gray-600">
                    <FaSignOutAlt />
                </div>
                <span className="mt-2 text-gray-400">Salir</span>
            </div>
        </div>
    );
};

export default Navigation;
