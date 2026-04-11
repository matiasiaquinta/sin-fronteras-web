import {
    FaDollarSign,
    FaMoneyBill,
    FaNotesMedical,
    FaPlus,
} from "react-icons/fa";
import Layout from "../components/ui/Layout";
import { usePlan } from "../context/PlanContext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PlanCard from "../components/planes/PlanCard";
import { Input } from "../components/ui";

// Función para formatear números con separadores de miles
const formatNumberWithCommas = (value) => {
    return value
        .replace(/\D/g, "") // Eliminar todo lo que no sea dígito
        .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Agregar puntos como separadores de miles
};

const Planes = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();
    const { planes, getPlanes, createPlan } = usePlan();

    // Mostrar planes
    useEffect(() => {
        getPlanes();
    }, []);

    // Estados para crear planes
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [planToCreate, setPlanToCreate] = useState({
        nombre: "",
        precioEfectivo: "",
        precioTransferencia: "",
    });

    // Abrir modal
    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
    };

    // Cerrar modal
    const handleCloseModal = () => {
        setShowCreateModal(false);
    };

    // Manejar el cambio de input
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Limpiar el valor y formatear con puntos
        const cleanedValue = value.replace(/\./g, "");
        const formattedValue = formatNumberWithCommas(cleanedValue);

        // Actualizar el estado con el valor formateado
        setPlanToCreate({
            ...planToCreate,
            [name]: formattedValue,
        });
    };

    // Función para crear plan
    const onSubmit = async (data) => {
        try {
            // Crear el objeto con los datos correctos
            const planData = {
                nombre: planToCreate.nombre,
                precioEfectivo: planToCreate.precioEfectivo,
                precioTransferencia: planToCreate.precioTransferencia,
            };
            //console.log("Plan a crear", planData);
            await createPlan(planData);
            setShowCreateModal(false);
            //resetForm();
        } catch (error) {
            console.error("Error al crear el plan:", error);
        }
    };

    return (
        <Layout>
            <div className="max-w-xl mx-auto w-full">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-gray-800">Planes</h1>
                    <button
                        className="flex items-center gap-2 rounded-lg bg-paleta_2 hover:bg-paleta_1 text-white py-2 px-4 text-sm transition-colors"
                        onClick={handleOpenCreateModal}
                    >
                        <FaPlus />
                        Crear
                    </button>
                </div>

                {/* Modal para crear plan */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <h2 className="text-base font-bold text-gray-800">Crear Plan</h2>
                                <button
                                    type="button"
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                                    onClick={handleCloseModal}
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-4">
                                <div className="mb-3">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre</label>
                                    <Input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        placeholder="Nombre del plan"
                                        {...register("nombre", { required: "Nombre es requerido" })}
                                        value={planToCreate.nombre}
                                        onChange={(e) => setPlanToCreate({ ...planToCreate, nombre: e.target.value })}
                                    />
                                    {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
                                </div>

                                <div className="mb-3">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Precio Efectivo</label>
                                    <Input
                                        type="text"
                                        id="precioEfectivo"
                                        name="precioEfectivo"
                                        placeholder="0"
                                        {...register("precioEfectivo", { required: "Requerido" })}
                                        value={planToCreate.precioEfectivo}
                                        onChange={handleInputChange}
                                    />
                                    {errors.precioEfectivo && <p className="text-red-500 text-xs mt-1">{errors.precioEfectivo.message}</p>}
                                </div>

                                <div className="mb-4">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Precio Transferencia</label>
                                    <Input
                                        type="text"
                                        id="precioTransferencia"
                                        name="precioTransferencia"
                                        placeholder="0"
                                        {...register("precioTransferencia", { required: "Requerido" })}
                                        value={planToCreate.precioTransferencia}
                                        onChange={handleInputChange}
                                    />
                                    {errors.precioTransferencia && <p className="text-red-500 text-xs mt-1">{errors.precioTransferencia.message}</p>}
                                </div>

                                <div className="flex gap-3">
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
                )}

                <div className="pb-4">
                    {planes.length === 0 ? (
                        <div className="text-center text-gray-400 p-8">
                            <p>No hay planes. Creá uno nuevo.</p>
                        </div>
                    ) : (
                        planes.map((plan) => (
                            <PlanCard key={plan._id} plan={plan} />
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Planes;
