/*
    Cree este componente porque sino habia muchisimo codigo en AlumnoCard.jsx
    Esto contiene toda la información dentro de cada CARD -> ej: Nombre: Pedro.
*/

export const InfoItem = ({ label, value }) => {
    return (
        <div className="flex justify-between items-start py-2.5 border-b border-gray-100 last:border-0">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-2/5 shrink-0">
                {label}
            </span>
            <p className="text-sm text-gray-800 text-right w-3/5">
                {value}
            </p>
        </div>
    );
};
