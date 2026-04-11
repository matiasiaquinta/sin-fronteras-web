import { useState } from "react";
import { Popup } from "./PopUp";
import PropTypes from "prop-types";

export function Card({ alumno }) {
    const [openViewMoreModal, setOpenViewMoreModal] = useState(false);
    const isPaid = alumno.abono;

    return (
        <div className="w-full">
            <div className={`bg-white rounded-xl shadow-sm border-l-4 ${isPaid ? "border-green-500" : "border-red-400"} p-4`}>
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-base font-bold text-gray-800 leading-snug">
                        {alumno.nombre}
                    </h2>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ml-2 ${isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {isPaid ? "Abonó" : "Debe"}
                    </span>
                </div>
                {alumno.plan && (
                    <p className="text-xs text-gray-500 mb-0.5">{alumno.plan}</p>
                )}
                {alumno.deporte && (
                    <p className="text-xs text-gray-400">{alumno.deporte}</p>
                )}
                <button
                    className="mt-3 w-full bg-paleta_2 hover:bg-paleta_1 text-white py-1.5 rounded text-sm transition-colors"
                    onClick={() => setOpenViewMoreModal(true)}
                >
                    Ver más
                </button>
                {openViewMoreModal && (
                    <Popup alumno={alumno} onClose={() => setOpenViewMoreModal(false)} />
                )}
            </div>
        </div>
    );
}

Card.propTypes = {
    alumno: PropTypes.shape({
        nombre: PropTypes.string.isRequired,
        mail: PropTypes.string,
        telefono: PropTypes.string,
        deporte: PropTypes.string,
        plan: PropTypes.string,
        fechaComienzo: PropTypes.string,
        precioEfectivo: PropTypes.string,
        precioTransferencia: PropTypes.string,
        abono: PropTypes.bool,
    }).isRequired,
};
