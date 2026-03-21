/*
    Esto es el molde de cada página para que se respete siempre el mismo tamaño
    Home - Alumnos - etc
*/

import Navigation from "./Navigation";
import logo from "../../assets/sfLogo.png";
import { useState } from "react";
import { FaBell } from "react-icons/fa";

const Layout = ({ children }) => {
    /* Notificaciones Hacer */
    const [showNotifications, setShowNotifications] = useState(false);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <div className="flex flex-col h-screen text-black">
            {/* Encabezado o barra superior (si la necesitas) */}
            <header className="bg-white w-full h-20 flex items-center px-6 md:px-36">
                <img
                    src={logo}
                    alt="Logo Sin Fronteras"
                    width={50}
                    className="rounded-md"
                />
                <h1 className="uppercase font-bold text-xl mx-auto">
                    Sin Fronteras
                </h1>
                <div className="relative">
                    <FaBell
                        className="text-2xl cursor-pointer"
                        onClick={toggleNotifications}
                    />
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        5
                    </span>
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                            <p className="text-xs font-bold uppercase text-gray-400 px-3 pt-3 pb-1">Notificaciones</p>
                            <ul className="list-none">
                                <li className="px-3 py-2 border-b border-gray-100 text-sm">🔴 Camila Torres no abonó este mes</li>
                                <li className="px-3 py-2 border-b border-gray-100 text-sm">🔴 Sofía Rodríguez no abonó este mes</li>
                                <li className="px-3 py-2 border-b border-gray-100 text-sm">✅ Lucía Fernández abonó por transferencia</li>
                                <li className="px-3 py-2 border-b border-gray-100 text-sm">✅ Martín Gómez abonó en efectivo</li>
                                <li className="px-3 py-2 text-sm">✅ Diego Méndez abonó en efectivo</li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            {/* Contenedor principal con altura fija */}
            <main className="flex-grow bg-white w-full mx-auto p-4">
                {children}
            </main>

            {/* Barra de navegación */}
            <Navigation />
        </div>
    );
};

export default Layout;
