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

    const NavItem = ({ to, icon, label, disabled }) => {
        const isActive = currentPath === to;
        if (disabled) {
            return (
                <div className="flex flex-col items-center gap-1 opacity-30 cursor-not-allowed">
                    <div className="text-xl text-gray-400">{icon}</div>
                    <span className="text-xs text-gray-400">{label}</span>
                </div>
            );
        }
        return (
            <Link to={to} className={`flex flex-col items-center gap-1 ${isActive ? "text-paleta_3" : "text-gray-300"}`}>
                <div className={`text-xl ${isActive ? "text-paleta_3" : "text-gray-300"}`}>{icon}</div>
                <span className="text-xs">{label}</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-paleta_3" />}
            </Link>
        );
    };

    return (
        <div className="w-full h-20 bg-paleta_1 flex justify-around items-center text-white text-sm md:px-36">
            <NavItem to="/" icon={<FaUser />} label="Home" />
            <NavItem to="/alumnos" icon={<FaGraduationCap />} label="Alumnos" />
            <NavItem to="/ajustes" icon={<FaCog />} label="Ajustes" />
            <NavItem disabled icon={<FaSignOutAlt />} label="Salir" />
        </div>
    );
};

export default Navigation;
