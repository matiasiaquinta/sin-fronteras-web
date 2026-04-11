/*

    Aca se maneja la pagina /alumnos y estan todos los alumnos y se pueden agregar mas. 
    
    ARREGLAR:
    #1: DEPORTE 
    -> revisar si elige deporte y no plan que pasa?
    -> si no selecciona ningun no da error (esta comentado porque se bugea)

*/

import { useEffect, useState } from "react";
import { useAlumnos } from "../context/AlumnosContext";
import { AlumnoCard } from "../components/alumnos/AlumnoCard";
import { ImFileEmpty } from "react-icons/im";
import { Input, Label } from "../components/ui";
import { useForm, Controller } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import {
    FaUser,
    FaTasks,
    FaGraduationCap,
    FaCog,
    FaPlus,
} from "react-icons/fa";
import Navigation from "../components/ui/Navigation";
import Layout from "../components/ui/Layout";

export function Alumnos() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch,
        reset,
    } = useForm();
    const { alumnos, getAlumnos, createAlumno } = useAlumnos();

    // Estado para crear alumno
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [precioEfectivo, setPrecioEfectivo] = useState(0);
    const [precioTransferencia, setPrecioTransferencia] = useState(0);
    const [alumnoToCreate, setAlumnoToCreate] = useState({
        nombre: "",
        mail: "",
        telefono: "",
        deporte: "",
        plan: "",
        fechaComienzo: new Date().toISOString().slice(0, 10),
        fechaPago: "",
        precioEfectivo: 0,
        precioTransferencia: 0,
        abono: false,
        abonoEfectivo: false,
        abonoTransferencia: false,
    });

    // Estados para manejar el Search...
    const [searchTerm, setSearchTerm] = useState("");

    // Muestro todos los alumnos
    useEffect(() => {
        getAlumnos();
    }, []);

    // Definición de opciones de deportes
    const deportes = [
        { value: "Funcional", label: "Funcional" },
        { value: "Running", label: "Running" },
        { value: "TrailRunning", label: "Trail Running" },
        { value: "Ciclismo", label: "Ciclismo" },
        { value: "Natacion", label: "Natación" },
        { value: "Futbol", label: "Fútbol" },
        { value: "FutbolMixto", label: "Fútbol Mixto" },
    ];

    // CHECKBOX DEPORTES
    const [isSubmitted, setIsSubmitted] = useState(false);

    // isSubmitted es para mostrar el error en checkbox deporte
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setIsSubmitted(true);
        }
    }, [errors]);
    // Función para manejar cambios en los checkboxes de deporte
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        let updatedDeportes = [...alumnoToCreate.deporte];

        if (checked) {
            updatedDeportes.push(value);
        } else {
            updatedDeportes = updatedDeportes.filter((d) => d !== value);
        }

        //console.log("Checkbox Change:", { value, checked, updatedDeportes });
        setAlumnoToCreate({ ...alumnoToCreate, deporte: updatedDeportes });
    };

    /*
        LEER
        Con esto funciona que se ponga el . -> pero ver lo de fran
        para agregarlo bien. (lo de las que el plan lo eliga)
        de la pantalla plan.

    */
    /* // Función para formatear números con puntos de miles
    const formatNumber = (value) => {
        if (!value) return "";
        return new Intl.NumberFormat("es-AR").format(value);
    };
    const handlePrecioChange = (e) => {
        const rawValue = e.target.value.replace(/\./g, ""); // Elimina los puntos para convertirlo a número
        const numericValue = Number(rawValue); // Convierte el string a número

        setAlumnoToCreate({
            ...alumnoToCreate,
            precioEfectivo: numericValue, // Guarda el valor numérico
        });
    }; */

    // Para manejar el precio
    useEffect(() => {
        const calcularPrecio = () => {
            // aca va toda la lógica de precios segun plan
            let precioCalculadoEfectivo = 0;
            let precioCalculadoTransferencia = 0;
            //if (alumnoToCreate.deporte.length = 1) {
            //    precioCalculadoEfectivo = "7.000";
            //    precioCalculadoTransferencia = "8.000";
            //}
            if (alumnoToCreate.plan === "Plan Natación") {
                precioCalculadoEfectivo = "13.000";
                precioCalculadoTransferencia = "14.000";
            }
            if (alumnoToCreate.plan === "Plan Distancia + Full + Natación") {
                precioCalculadoEfectivo = "21.000";
                precioCalculadoTransferencia = "22.000";
            }
            if (alumnoToCreate.plan === "Plan Entrenamiento a Distancia") {
                precioCalculadoEfectivo = "12.000";
                precioCalculadoTransferencia = "13.000";
            }
            if (alumnoToCreate.plan === "Plan Personalizado Club") {
                precioCalculadoEfectivo = "16.000";
                precioCalculadoTransferencia = "17.000";
            }
            if (alumnoToCreate.plan === "Plan Full + Natación") {
                precioCalculadoEfectivo = "19.000";
                precioCalculadoTransferencia = "20.000";
            }
            if (alumnoToCreate.plan === "Plan Full") {
                precioCalculadoEfectivo = "12.000";
                precioCalculadoTransferencia = "13.000";
            }

            setPrecioEfectivo(precioCalculadoEfectivo);
            setPrecioTransferencia(precioCalculadoTransferencia);

            setAlumnoToCreate((prevState) => ({
                ...prevState,
                precioEfectivo: precioCalculadoEfectivo,
                precioTransferencia: precioCalculadoTransferencia,
            }));
        };
        calcularPrecio();
    }, [alumnoToCreate.plan]);

    // Ejemplo de cómo manejar cambios en los checkboxes de deporte
    //const handleDeporteChange = (selectedDeportes) => {
    //    setAlumnoToCreate({
    //        ...alumnoToCreate,
    //        deporte: selectedDeportes, // `selectedDeportes` debería ser un array de strings
    //    });
    //};

    // Ejemplo de cómo capturar la fecha de comienzo en el formulario
    //const handleFechaComienzoChange = (e) => {
    //    setAlumnoToCreate({
    //        ...alumnoToCreate,
    //        fechaComienzo: e.target.value, // Asegúrate de que `e.target.value` tenga el formato correcto de fecha
    //    });
    //};

    // Función para manejar el envío del formulario de creación de alumno
    const onSubmit = async (data) => {
        try {
            // Lógica para determinar la fecha de pago
            let fechaPago = "";
            if (data.pagoFrecuencia === "personalizado") {
                fechaPago = data.fechaPersonalizada;
            } else {
                fechaPago = data.pagoFrecuencia;
            }

            const deporteArray = alumnoToCreate.deporte;
            const deporteToString = deporteArray.join(", ");

            // Crear el objeto de datos a enviar
            const alumnoData = {
                nombre: alumnoToCreate.nombre,
                mail: alumnoToCreate.mail,
                telefono: alumnoToCreate.telefono,
                deporte: deporteToString,
                plan: alumnoToCreate.plan,
                fechaComienzo: alumnoToCreate.fechaComienzo,
                fechaPago: fechaPago,
                precioEfectivo: parseFloat(
                    alumnoToCreate.precioEfectivo
                ).toFixed(3),
                precioTransferencia: parseFloat(
                    alumnoToCreate.precioTransferencia
                ).toFixed(3),
                abono: alumnoToCreate.abono,
                abonoEfectivo: alumnoToCreate.abonoEfectivo,
                abonoTransferencia: alumnoToCreate.abonoTransferencia,
            };

            createAlumno(alumnoData);
            setShowCreateModal(false); // Cierra el modal después de crear el alumno
            resetForm(); // Limpia el formulario después de la creación exitosa
        } catch (error) {
            console.error("Error al crear el alumno:", error);
        }
    };

    /*     // Función para manejar cambios en los checkboxes de deporte
    const handleCheckboxChange = (e) => {
        const deporteSeleccionado = e.target.value;
        const isChecked = e.target.checked;

        // Actualizar el estado de alumnoToCreate para incluir o excluir el deporte seleccionado
        if (isChecked) {
            setAlumnoToCreate((prevState) => ({
                ...prevState,
                deporte: [...prevState.deporte, deporteSeleccionado],
            }));
        } else {
            setAlumnoToCreate((prevState) => ({
                ...prevState,
                deporte: prevState.deporte.filter(
                    (d) => d !== deporteSeleccionado
                ),
            }));
        }
    }; */

    // Función para manejar cambio en los planes
    const handlePlanChange = (e) => {
        setAlumnoToCreate((prevState) => ({
            ...prevState,
            plan: e.target.value,
        }));
    };

    // Función para limpiar el formulario después de la creación exitosa
    const resetForm = () => {
        setAlumnoToCreate({
            nombre: "",
            mail: "",
            telefono: "",
            deporte: [],
            plan: "",
            fechaComienzo: "",
            fechaPago: "",
            abono: false,
            abonoEfectivo: false,
            abonoTransferencia: false,
        });
    };

    // Abrir y cerrar el modal de creación de alumno
    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
    };

    // Cerrar modales
    const handleCloseModal = () => {
        setShowCreateModal(false);
        //setValidationErrors({}); // Limpiar errores al cerrar el modal
    };

    // Observa el valor del selector de rango de fechas
    const pagoFrecuencia = watch("pagoFrecuencia", "");

    // Para la navegación
    const location = useLocation();
    const currentPath = location.pathname;

    /* Dashboard - maneja si -> abono:true / abono:false / todos los alumnos */
    const { abono } = location.state || { abono: null }; // null por defecto

    // Función para normalizar y eliminar tildes
    const normalizeText = (text) => {
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    };

    // Filtrado del Search Input -> busca dependiendo si abonaron o no o son todos los alumnos
    const filteredAlumnos = alumnos.filter((user) => {
        const matchesAbono = abono === null || user.abono === abono;
        const matchesSearchTerm = normalizeText(user.nombre).includes(
            normalizeText(searchTerm)
        );

        return matchesAbono && matchesSearchTerm;
    });

    return (
        <Layout>
            <div>
                <div className="max-w-3xl mx-auto w-full">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Alumnos</h1>
                            {abono !== null && (
                                <p className="text-xs text-gray-500">
                                    {abono === true ? "Que abonaron" : "Que no abonaron"}
                                </p>
                            )}
                        </div>
                        <button
                            className="flex items-center gap-2 rounded-lg bg-paleta_2 hover:bg-paleta_1 text-white py-2 px-4 text-sm transition-colors"
                            onClick={handleOpenCreateModal}
                        >
                            <FaPlus />
                            Crear
                        </button>
                    </div>

                    <input
                        type="search"
                        placeholder="Buscar alumno..."
                        className="block px-4 py-2 w-full rounded-lg text-gray-800 border border-gray-200 bg-white focus:outline-none focus:border-paleta_3 mb-4"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-4">
                        {filteredAlumnos.length === 0 ? (
                            <div className="text-center text-gray-400 p-8 col-span-3">
                                <p>No hay alumnos en esta categoría.</p>
                            </div>
                        ) : (
                            filteredAlumnos.map((alumno) => (
                                <AlumnoCard key={alumno._id} alumno={alumno} />
                            ))
                        )}
                    </div>
                </div>

                {/* Modal para crear alumno */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <h2 className="text-base font-bold text-gray-800">Crear alumno</h2>
                                <button
                                    type="button"
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                                    onClick={handleCloseModal}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="overflow-y-auto custom-scrollbar px-5 py-3 flex-1">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* NOMBRE */}
                                <div className="mt-4 mb-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre:</label>
                                    <Input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        placeholder="Escribe el nombre"
                                        {...register("nombre", {
                                            required: "Nombre es requerido",
                                        })}
                                        value={alumnoToCreate.nombre}
                                        onChange={(e) =>
                                            setAlumnoToCreate({
                                                ...alumnoToCreate,
                                                nombre: e.target.value,
                                            })
                                        }
                                    />
                                    {errors.nombre && (
                                        <p className="text-red-500">
                                            {errors.nombre.message}
                                        </p>
                                    )}
                                </div>

                                {/* EMAIL */}
                                <div className="mb-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email:</label>
                                    <Input
                                        type="email"
                                        name="mail"
                                        placeholder="Escribe el email"
                                        {...register("mail", {
                                            required: "Email es requerido",
                                            pattern: {
                                                value: /\S+@\S+\.\S+/,
                                                message: "Email no es válido",
                                            },
                                        })}
                                        value={alumnoToCreate.mail}
                                        onChange={(e) =>
                                            setAlumnoToCreate({
                                                ...alumnoToCreate,
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

                                {/* TELEFONO */}
                                <div className="mb-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Teléfono:
                                    </label>
                                    <Input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        placeholder="Escribe el teléfono"
                                        {...register("telefono", {
                                            required: "Teléfono es requerido",
                                        })}
                                        value={alumnoToCreate.telefono}
                                        onChange={(e) =>
                                            setAlumnoToCreate({
                                                ...alumnoToCreate,
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
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Deporte:
                                    </label>
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
                                                        checked={alumnoToCreate.deporte.includes(
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
                                    {isSubmitted &&
                                        alumnoToCreate.deporte.length === 0 && (
                                            <p className="text-red-500">
                                                Selecciona al menos un deporte
                                            </p>
                                        )}
                                </div>

                                {/* PLAN */}
                                <div className="mb-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan:</label>
                                    <select
                                        {...register("plan", {
                                            required:
                                                "Selecciona una opción de plan",
                                        })}
                                        value={alumnoToCreate.plan}
                                        onChange={handlePlanChange}
                                        className="selectFocus"
                                    >
                                        <option value="">
                                            Selecciona un plan
                                        </option>
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
                                        <option value="Plan Full">
                                            Plan Full
                                        </option>
                                    </select>
                                    {errors.plan && (
                                        <p className="text-red-500">
                                            {errors.plan.message}
                                        </p>
                                    )}
                                </div>

                                {/* FECHA COMIENZO */}
                                <div className="mb-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Fecha de Comienzo:
                                    </label>
                                    <Input
                                        type="date"
                                        name="fechaComienzo"
                                        value={alumnoToCreate.fechaComienzo}
                                        onChange={(e) =>
                                            setAlumnoToCreate({
                                                ...alumnoToCreate,
                                                fechaComienzo: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                {/* SELECTOR FECHA PAGO */}
                                <div className="mb-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Fecha de Pago:
                                    </label>
                                    <select
                                        {...register("pagoFrecuencia", {
                                            required:
                                                "Selecciona una opción de fecha de pago",
                                        })}
                                        className="selectFocus"
                                    >
                                        <option value="">
                                            Seleccione una opción
                                        </option>
                                        <option value="1-5">1 al 5</option>
                                        <option value="1-10">1 al 10</option>
                                        <option value="personalizado">
                                            Personalizado
                                        </option>
                                    </select>
                                    {errors.pagoFrecuencia && (
                                        <p className="text-red-500">
                                            {errors.pagoFrecuencia.message}
                                        </p>
                                    )}
                                </div>

                                {/* CAMPO EXTRA: fecha personalizada */}
                                {pagoFrecuencia === "personalizado" && (
                                    <div className="mb-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Fecha Personalizada:
                                        </label>
                                        <Input
                                            type="number"
                                            {...register("fechaPersonalizada", {
                                                required:
                                                    "Especifica una fecha de pago personalizada",
                                                min: {
                                                    value: 1,
                                                    message:
                                                        "Debe ser entre 1 y 31",
                                                },
                                                max: {
                                                    value: 31,
                                                    message:
                                                        "Debe ser entre 1 y 31",
                                                },
                                            })}
                                            placeholder="Día del mes (1-31)"
                                            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                                        />
                                        {errors.fechaPersonalizada && (
                                            <p className="text-red-500">
                                                {
                                                    errors.fechaPersonalizada
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* PRECIO */}
                                <div className="mb-2 mt-2">
                                    <div className="mb-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Precio Efectivo:
                                        </label>
                                        <div className="flex items-center">
                                            <span className="text-xl text-black ml-2 mr-1 font-bold">
                                                $
                                            </span>
                                            {/* <Input
                                                type="text"
                                                value={formatNumber(
                                                    alumnoToCreate.precioEfectivo
                                                )}
                                                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                                                onChange={handlePrecioChange}
                                            /> */}
                                            <Input
                                                type="text"
                                                value={
                                                    alumnoToCreate.precioEfectivo
                                                }
                                                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                                                onChange={(e) =>
                                                    setAlumnoToCreate({
                                                        ...alumnoToCreate,
                                                        precioEfectivo: Number(
                                                            e.target.value
                                                        ),
                                                    })
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
                                                type="text"
                                                value={
                                                    alumnoToCreate.precioTransferencia
                                                }
                                                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                                                onChange={(e) =>
                                                    setAlumnoToCreate({
                                                        ...alumnoToCreate,
                                                        precioTransferencia:
                                                            Number(
                                                                e.target.value
                                                            ),
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ABONO */}
                                <div className="mt-4 mb-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Abono con:
                                    </label>
                                    <div className="flex justify-center space-x-8 px-2 py-4 border-2 border-black/80 rounded-md">
                                        <div className="flex flex-col items-center">
                                            <div
                                                onClick={() =>
                                                    setAlumnoToCreate({
                                                        ...alumnoToCreate,
                                                        abonoEfectivo:
                                                            !alumnoToCreate.abonoEfectivo,
                                                        abonoTransferencia: false,
                                                    })
                                                }
                                                className={`w-12 h-12 flex items-center justify-center rounded-full cursor-pointer ${
                                                    alumnoToCreate.abonoEfectivo
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                }`}
                                            >
                                                {alumnoToCreate.abonoEfectivo ? (
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
                                                Efectivo
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div
                                                onClick={() =>
                                                    setAlumnoToCreate({
                                                        ...alumnoToCreate,
                                                        abonoTransferencia:
                                                            !alumnoToCreate.abonoTransferencia,
                                                        abonoEfectivo: false, // Desactivar efectivo si se selecciona transferencia
                                                    })
                                                }
                                                className={`w-12 h-12 flex items-center justify-center rounded-full cursor-pointer ${
                                                    alumnoToCreate.abonoTransferencia
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                }`}
                                            >
                                                {alumnoToCreate.abonoTransferencia ? (
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

                                <div className="flex gap-3 pt-4 pb-2">
                                    <button
                                        type="button"
                                        className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 py-2 rounded-lg text-sm transition-colors"
                                        onClick={handleCloseModal}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-paleta_2 hover:bg-paleta_1 text-white py-2 rounded-lg text-sm transition-colors"
                                    >
                                        Crear
                                    </button>
                                </div>
                            </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
