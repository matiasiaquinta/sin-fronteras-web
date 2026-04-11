/*
    Esto es el molde de cada página para que se respete siempre el mismo tamaño
    Home - Alumnos - etc
*/

import Navigation from "./Navigation";
import logo from "../../assets/sfLogo.png";
import { useState } from "react";
import { FaBell, FaCog, FaGraduationCap, FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname;

    const navLinks = [
        { to: "/", label: "Home", icon: <FaUser /> },
        { to: "/alumnos", label: "Alumnos", icon: <FaGraduationCap /> },
        { to: "/ajustes", label: "Ajustes", icon: <FaCog /> },
    ];

    return (
        <div className="flex flex-col h-screen text-black">
            <header className="relative bg-white w-full h-16 flex items-center px-5 shadow-sm border-b border-gray-100">
                {/* Izquierda: logo + título */}
                <div className="flex items-center gap-2 shrink-0">
                    <img src={logo} alt="Logo Sin Fronteras" width={36} className="rounded-lg" />
                    <h1 className="uppercase font-bold text-sm tracking-wide text-gray-800 hidden md:block">
                        Sin Fronteras
                    </h1>
                    {/* Título centrado solo en mobile */}
                    <h1 className="uppercase font-bold text-sm tracking-wide text-gray-800 md:hidden absolute left-1/2 -translate-x-1/2">
                        Sin Fronteras
                    </h1>
                </div>

                {/* Centro: nav links — solo en desktop */}
                <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                currentPath === link.to
                                    ? "bg-paleta_2 text-white"
                                    : "text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Derecha: campana */}
                <div className="relative ml-auto md:ml-0 shrink-0">
                    <FaBell
                        className="text-xl cursor-pointer text-gray-500 hover:text-paleta_2 transition-colors"
                        onClick={() => setShowNotifications(!showNotifications)}
                    />
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        5
                    </span>
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-lg z-50">
                            <p className="text-xs font-bold uppercase text-gray-400 px-4 pt-3 pb-1">Notificaciones</p>
                            <ul>
                                <li className="px-4 py-2 border-b border-gray-50 text-sm">🔴 Camila Torres no abonó</li>
                                <li className="px-4 py-2 border-b border-gray-50 text-sm">🔴 Sofía Rodríguez no abonó</li>
                                <li className="px-4 py-2 border-b border-gray-50 text-sm">✅ Lucía Fernández abonó</li>
                                <li className="px-4 py-2 border-b border-gray-50 text-sm">✅ Martín Gómez abonó</li>
                                <li className="px-4 py-2 text-sm">✅ Diego Méndez abonó</li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-grow bg-gray-50 w-full mx-auto p-4 overflow-auto">
                {children}
            </main>

            {/* Barra de navegación — solo en mobile */}
            <div className="md:hidden">
                <Navigation />
            </div>
        </div>
    );
};

export default Layout;
