import { useEffect, useState } from "react";
import { useAlumnos } from "../../context/AlumnosContext";
import { InfoItem } from "./InfoItem";
import { formatHistorialPagos, formatFecha } from "../../utils/utils";
import { Input } from "./Input";
import { deportes } from "../../utils/constants";

export function Popup({ onClose, alumno }) {
    const { deleteAlumno, updateAlumno } = useAlumnos();
    const [showEditModal, setShowEditModal] = useState(false);
    const [alumnoToDelete, setAlumnoToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editedAlumno, setEditedAlumno] = useState(alumno);
    const [errors] = useState({});

    //setPagos(pagos);
    const pagos = alumno.historicoPagos || [];
    // Estado para almacenar los pagos
    //const [pagos, setPagos] = useState([]);

    // Inicializa isCustom solo si editedAlumno existe
    const [isCustom, setIsCustom] = useState(
        editedAlumno && editedAlumno.fechaPago === "personalizado"
    );

    useEffect(() => {
        // Actualiza isCustom cuando editedAlumno cambia
        if (editedAlumno) {
            setIsCustom(editedAlumno.fechaPago === "personalizado");
        }
    }, [editedAlumno]);

    const handleFechaPagoChange = (e) => {
        const value = e.target.value;
        if (value === "personalizado") {
            setIsCustom(true);
            setEditedAlumno({ ...editedAlumno, fechaPago: "" });
        } else {
            setIsCustom(false);
            setEditedAlumno({ ...editedAlumno, fechaPago: value });
        }
    };

    const handleCustomFechaPagoChange = (e) => {
        setEditedAlumno({ ...editedAlumno, fechaPago: e.target.value });
    };

    // Verifica si editedAlumno está disponible antes de hacer el cálculo
    const mostrarCampoPersonalizado = editedAlumno
        ? editedAlumno.pagoFrecuencia === "personalizado" ||
          (!["1-5", "1-10"].includes(editedAlumno.pagoFrecuencia) &&
              !isNaN(editedAlumno.fechaPago))
        : false;

    // Función para manejar cambios en los checkboxes de deportes
    const handleCheckboxChange = (e) => {
        const { value } = e.target;
        let updatedDeportes;

        //console.log(value);

        if (editedAlumno.deporte.includes(value)) {
            // Si el deporte ya está seleccionado, removerlo
            updatedDeportes = editedAlumno.deporte.filter((d) => d !== value);
        } else {
            // Si el deporte no está seleccionado, agregarlo
            updatedDeportes = [...editedAlumno.deporte, value];
        }

        setEditedAlumno({
            ...editedAlumno,
            deporte: updatedDeportes,
        });
    };
    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setShowEditModal(false);
        setAlumnoToDelete(null);
        onClose();
    };

    // Guardar los datos actualizados
    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log("Alumno editado:", editedAlumno);

        // Convertir el array deportes a una cadena
        const deporteArray = editedAlumno.deporte;
        const deporteToString = deporteArray.join(", ");

        // Determinar si el alumno abonó
        const abono =
            editedAlumno.abonoEfectivo || editedAlumno.abonoTransferencia;

        // Creo el objeto actualizado incluyendo variables
        const updatedAlumno = {
            ...editedAlumno,
            deporte: deporteToString,
            abonoEfectivo: editedAlumno.abonoEfectivo,
            abonoTransferencia: editedAlumno.abonoTransferencia,
            abono,
        };

        await updateAlumno(editedAlumno._id, updatedAlumno);
        setShowEditModal(false);
        setEditedAlumno(null);
    };

    //Editar info de transferencia
    const handleChangePrecioTransferencia = (e) => {
        const { value } = e.target;

        // Formatear el valor con comas mientras el usuario escribe
        const formattedValue = value.replace(/\D/g, "");

        // Actualizar el estado
        setEditedAlumno({
            ...editedAlumno,
            precioTransferencia: formattedValue,
        });
    };

    // Función para manejar cambios en el selector de plan
    const handlePlanChange = (e) => {
        const { value } = e.target;
        setEditedAlumno({
            ...editedAlumno,
            plan: value,
        });
    };

    // Función para ajustar el input de precio
    const handleChangePrecioEfectivo = (e) => {
        const { value } = e.target;

        // Formatear el valor con comas mientras el usuario escribe
        const formattedValue = value.replace(/\D/g, "");

        // Actualizar el estado
        setEditedAlumno({
            ...editedAlumno,
            precioEfectivo: formattedValue,
        });
    };

    // -- ELIMINAR -- \\
    // Abrir modal confirmar eliminar alumno
    const handleOpenDeleteModal = (id) => {
        setAlumnoToDelete(id);
        setShowDeleteModal(true);
    };
    // Eliminar alumno confirmado
    const handleDelete = () => {
        deleteAlumno(alumnoToDelete);
        setShowDeleteModal(false);
        setAlumnoToDelete(null);
    };

    // -- EDITAR -- \\
    // Abrir modal editar alumno
    const handleOpenEditModal = (alumno) => {
        // Convertir el campo deporte a array si es una cadena (sin esto se bugea)
        const deporteArray =
            typeof alumno.deporte === "string"
                ? alumno.deporte.split(", ")
                : alumno.deporte;

        setEditedAlumno({
            ...alumno,
            deporte: deporteArray,
        });
        setShowEditModal(true);
    };

    // Mostrar mas prolija la información de Fecha Pago
    let textoFechaPago = "";
    if (alumno.fechaPago === "1-5") {
        textoFechaPago = "Del 1 al 5";
    } else if (alumno.fechaPago === "1-10") {
        textoFechaPago = "Del 1 al 10";
    } else if (!isNaN(alumno.fechaPago)) {
        // Verifica si fechaPago es un número
        textoFechaPago = `Todos los ${alumno.fechaPago}`;
    } else if (alumno.fechaPago === "personalizado") {
        // Maneja el caso personalizado si es necesario
        textoFechaPago = "Personalizado";
    } else {
        textoFechaPago = alumno.fechaPago; // Default a mostrar el valor directamente
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-xl">
                {/* Header del popup */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="font-bold text-gray-800 text-base">{alumno.nombre}</h2>
                        <span className={`text-xs font-medium ${alumno.abono ? "text-green-600" : "text-red-500"}`}>
                            {alumno.abono ? "Abonó este mes" : "Pendiente de pago"}
                        </span>
                    </div>
                    <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                        onClick={handleCloseModal}
                    >
                        ✕
                    </button>
                </div>

                {/* Contenido scrolleable */}
                <div className="overflow-y-auto custom-scrollbar px-5 py-3 flex-1">
                    <InfoItem label="Mail" value={alumno.mail} />
                    <InfoItem label="Teléfono" value={alumno.telefono} />
                    <InfoItem label="Deporte" value={alumno.deporte} />
                    <InfoItem label="Plan" value={alumno.plan} />
                    <InfoItem label="Fecha inicio" value={formatFecha(alumno.fechaComienzo)} />
                    <InfoItem label="Fecha de pago" value={textoFechaPago} />
                    <InfoItem label="Precio efectivo" value={`$${alumno.precioEfectivo}`} />
                    <InfoItem label="Precio transferencia" value={`$${alumno.precioTransferencia}`} />
                    <InfoItem label="Abonó con" value={alumno.abonoEfectivo ? "Efectivo" : alumno.abonoTransferencia ? "Transferencia" : "No abonó"} />
                    <InfoItem label="Meses abonados" value={formatHistorialPagos(pagos)} />
                </div>

                {/* Botones */}
                <div className="flex gap-3 px-5 py-4 border-t border-gray-100">
                    <button
                        className="flex-1 border border-red-300 text-red-500 hover:bg-red-50 py-2 rounded-lg text-sm transition-colors"
                        onClick={() => handleOpenDeleteModal(alumno._id)}
                    >
                        Eliminar
                    </button>
                    <button
                        className="flex-1 bg-paleta_2 hover:bg-paleta_1 text-white py-2 rounded-lg text-sm transition-colors"
                        onClick={() => handleOpenEditModal(alumno)}
                    >
                        Editar
                    </button>
                    <button
                        className="flex-1 border border-gray-300 text-gray-500 hover:bg-gray-50 py-2 rounded-lg text-sm transition-colors"
                        onClick={() => onClose()}
                    >
                        Cerrar
                    </button>
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-60 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
                        <p className="text-gray-500 text-sm mb-1">Confirmar acción</p>
                        <h2 className="text-base font-bold text-gray-800 mb-6">
                            ¿Eliminar a <span className="text-red-500">{alumno.nombre}</span>?
                        </h2>
                        <div className="flex gap-3">
                            <button
                                className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 py-2 rounded-lg text-sm transition-colors"
                                onClick={handleCloseModal}
                            >
                                Cancelar
                            </button>
                            <button
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm transition-colors"
                                onClick={handleDelete}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 text-black flex justify-center items-center z-50 p-4">
                    <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <h2 className="text-base font-bold text-gray-800">Editar alumno</h2>
                            <button
                                type="button"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                                onClick={handleCloseModal}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="overflow-y-auto custom-scrollbar px-5 py-3 flex-1">
                        <form onSubmit={handleSubmit}>
                            {/* Nombre */}
                            <div className="mt-4 mb-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre:</label>
                                <Input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={editedAlumno.nombre}
                                    onChange={(e) =>
                                        setEditedAlumno({
                                            ...editedAlumno,
                                            nombre: e.target.value,
                                        })
                                    }
                                    className="w-full bg-white text-black border-2 border-slate-800 px-4 py-2 rounded-md"
                                />
                            </div>

                            {/* Email */}
                            <div className="mb-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email:</label>
                                <Input
                                    type="email"
                                    name="mail"
                                    value={editedAlumno.mail}
                                    onChange={(e) =>
                                        setEditedAlumno({
                                            ...editedAlumno,
                                            mail: e.target.value,
                                        })
                                    }
                                />
                                {errors.mail && (
                                    <p className="text-red-500">
                                        {errors.mail.message}
                                    </p>
                                )}
                            </div>

                            {/* Teléfono */}
                            <div className="mb-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Teléfono:</label>
                                <Input
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    value={editedAlumno.telefono}
                                    onChange={(e) =>
                                        setEditedAlumno({
                                            ...editedAlumno,
                                            telefono: e.target.value,
                                        })
                                    }
                                />
                                {errors.telefono && (
                                    <p className="text-red-500">
                                        {errors.telefono.message}
                                    </p>
                                )}
                            </div>

                            {/* DEPORTE */}
                            <div className="mb-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Deporte:</label>
                                <div className="flex justify-center">
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2 text-black">
                                        {deportes.map((deporte) => (
                                            <div key={deporte.value}>
                                                <input
                                                    type="checkbox"
                                                    id={deporte.value}
                                                    name="deporte"
                                                    value={deporte.value}
                                                    onChange={
                                                        handleCheckboxChange
                                                    }
                                                    checked={editedAlumno.deporte.includes(
                                                        deporte.value
                                                    )}
                                                    className="ml-2 w-4 h-4"
                                                />
                                                <label
                                                    htmlFor={deporte.value}
                                                    className="ml-1"
                                                >
                                                    {deporte.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {editedAlumno.deporte.length === 0 && (
                                    <p className="text-red-500">
                                        Selecciona al menos un deporte
                                    </p>
                                )}
                            </div>

                            {/* Plan */}
                            <div className="mb-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan:</label>
                                <select
                                    value={editedAlumno.plan}
                                    onChange={handlePlanChange}
                                    className="selectFocus"
                                >
                                    <option value="">Selecciona un plan</option>
                                    <option value="Plan Natación">
                                        Plan Natación
                                    </option>
                                    <option value="Plan Distancia + Full + Natación">
                                        Plan Distancia + Full + Natación
                                    </option>
                                    <option value="Plan Entrenamiento a Distancia">
                                        Plan Entrenamiento a Distancia
                                    </option>
                                    <option value="Plan Personalizado Club">
                                        Plan Personalizado Club
                                    </option>
                                    <option value="Plan Full + Natación">
                                        Plan Full + Natación
                                    </option>
                                    <option value="Plan Full">Plan Full</option>
                                </select>
                                {errors.plan && (
                                    <p className="text-red-500">
                                        {errors.plan.message}
                                    </p>
                                )}
                            </div>

                            {/* Fecha Comienzo */}
                            <div className="mb-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Fecha de Comienzo:
                                </label>
                                <Input
                                    type="date"
                                    name="fechaComienzo"
                                    value={editedAlumno.fechaComienzo}
                                    onChange={(e) =>
                                        setEditedAlumno({
                                            ...editedAlumno,
                                            fechaComienzo: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Selector Fecha Pago */}
                            <div className="mb-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Fecha de Pago:
                                </label>
                                <select
                                    value={
                                        editedAlumno
                                            ? editedAlumno.fechaPago === ""
                                                ? "personalizado"
                                                : editedAlumno.fechaPago
                                            : ""
                                    }
                                    onChange={handleFechaPagoChange}
                                    className="selectFocus"
                                >
                                    <option value="">
                                        Selecciona una opción
                                    </option>
                                    <option value="1-5">1 al 5</option>
                                    <option value="1-10">1 al 10</option>
                                    <option value="personalizado">
                                        Personalizado
                                    </option>
                                </select>
                                {isCustom && (
                                    <input
                                        type="text"
                                        value={
                                            editedAlumno
                                                ? editedAlumno.fechaPago || ""
                                                : ""
                                        }
                                        onChange={handleCustomFechaPagoChange}
                                        className="mt-2 w-full bg-white text-black border-2 border-slate-800 px-4 py-2 rounded-md"
                                    />
                                )}
                                {errors.fechaPago && (
                                    <p className="text-red-500">
                                        {errors.fechaPago.message}
                                    </p>
                                )}
                            </div>

                            {/* Campo Extra: Fecha Personalizada */}
                            {mostrarCampoPersonalizado && (
                                <div className="mb-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Fecha Personalizada:
                                    </label>
                                    <Input
                                        type="number"
                                        value={editedAlumno.fechaPago || ""}
                                        onChange={(e) =>
                                            setEditedAlumno({
                                                ...editedAlumno,
                                                fechaPago: e.target.value,
                                            })
                                        }
                                        placeholder="Día del mes (1-31)"
                                        className="w-full bg-white text-black px-4 py-2 my-2 rounded-md"
                                        min="1"
                                        max="31"
                                    />
                                    {errors.fechaPersonalizada && (
                                        <p className="text-red-500">
                                            {errors.fechaPersonalizada.message}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Precio */}
                            <div className="mb-2 mt-2">
                                <div className="mb-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Precio Efectivo:
                                    </label>
                                    <div className="flex items-center">
                                        <span className="text-xl text-black ml-2 mr-1 font-bold">
                                            $
                                        </span>
                                        <Input
                                            type="text"
                                            value={editedAlumno.precioEfectivo}
                                            className="w-72 bg-white text-black px-4 py-2 my-2 rounded-md"
                                            onChange={
                                                handleChangePrecioEfectivo
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Precio Transferencia:
                                    </label>
                                    <div className="flex items-center">
                                        <span className="text-xl text-black ml-2 mr-1 font-bold">
                                            $
                                        </span>
                                        <Input
                                            type="number"
                                            value={
                                                editedAlumno.precioTransferencia
                                            }
                                            className="w-72 bg-white text-black px-4 py-2 my-2 rounded-md"
                                            onChange={
                                                handleChangePrecioTransferencia
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Abono */}
                            <div className="mt-4 mb-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Abono con:</label>
                                <div className="flex justify-center space-x-8 px-2 py-4 border-2 border-black/80 rounded-md">
                                    <div className="flex flex-col items-center">
                                        <div
                                            onClick={() =>
                                                setEditedAlumno({
                                                    ...editedAlumno,
                                                    abonoEfectivo:
                                                        !editedAlumno.abonoEfectivo,
                                                    abonoTransferencia: false, // Desactivar transferencia si se selecciona efectivo
                                                })
                                            }
                                            className={`w-12 h-12 flex items-center justify-center rounded-full cursor-pointer ${
                                                editedAlumno.abonoEfectivo
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        >
                                            {editedAlumno.abonoEfectivo ? (
                                                <span className="text-white font-bold">
                                                    Si
                                                </span>
                                            ) : (
                                                <span className="text-white">
                                                    No
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-2 text-sm">Efectivo</p>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div
                                            onClick={() =>
                                                setEditedAlumno({
                                                    ...editedAlumno,
                                                    abonoTransferencia:
                                                        !editedAlumno.abonoTransferencia,
                                                    abonoEfectivo: false, // Desactivar efectivo si se selecciona transferencia
                                                })
                                            }
                                            className={`w-12 h-12 flex items-center justify-center rounded-full cursor-pointer ${
                                                editedAlumno.abonoTransferencia
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        >
                                            {editedAlumno.abonoTransferencia ? (
                                                <span className="text-white font-bold">
                                                    Si
                                                </span>
                                            ) : (
                                                <span className="text-white">
                                                    No
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-2 text-sm">
                                            Transferencia
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4 pb-2">
                                <button
                                    onClick={handleCloseModal}
                                    className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 py-2 rounded-lg text-sm transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-paleta_2 hover:bg-paleta_1 text-white py-2 rounded-lg text-sm transition-colors"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* Popup.propTypes = {
    onClose: PropTypes.func.isRequired,
    alumno: PropTypes.shape({
        nombre: PropTypes.string.isRequired,
        mail: PropTypes.string,
        telefono: PropTypes.string,
        deporte: PropTypes.string,
        plan: PropTypes.string,
        fechaComienzo: PropTypes.string,
        precioEfectivo: PropTypes.number,
        precioTransferencia: PropTypes.number,
        abono: PropTypes.bool,
        _id: PropTypes.string,
        fechaPago: PropTypes.string,
    }).isRequired,
};
 */
