import { useState } from "react";
import { usePlan } from "../../context/PlanContext";

const PlanCard = ({ plan }) => {
    const [editMode, setEditMode] = useState(false);
    const [localPlan, setLocalPlan] = useState({ ...plan });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);

    const { deletePlan, updatePlan } = usePlan();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalPlan((prev) => ({ ...prev, [name]: value }));
    };

    const handleOpenDeleteModal = (id) => {
        setPlanToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        deletePlan(planToDelete);
        setShowDeleteModal(false);
        setPlanToDelete(null);
    };

    const handleCancelEdit = () => {
        setLocalPlan({ ...plan });
        setEditMode(false);
    };

    const handleEdit = () => {
        updatePlan(localPlan._id, localPlan);
        setEditMode(false);
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-gray-800 text-sm">{plan.nombre}</h2>
                    {!editMode && (
                        <div className="flex gap-2">
                            <button
                                className="text-xs border border-red-300 text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                                onClick={() => handleOpenDeleteModal(plan._id)}
                            >
                                Eliminar
                            </button>
                            <button
                                className="text-xs bg-paleta_2 hover:bg-paleta_1 text-white px-3 py-1 rounded-lg transition-colors"
                                onClick={() => setEditMode(true)}
                            >
                                Editar
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Efectivo</p>
                        {editMode ? (
                            <input
                                type="text"
                                name="precioEfectivo"
                                value={localPlan.precioEfectivo}
                                onChange={handleInputChange}
                                className="w-full text-sm font-semibold text-gray-800 bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-paleta_3"
                            />
                        ) : (
                            <p className="text-sm font-semibold text-gray-800">${plan.precioEfectivo}</p>
                        )}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Transferencia</p>
                        {editMode ? (
                            <input
                                type="text"
                                name="precioTransferencia"
                                value={localPlan.precioTransferencia}
                                onChange={handleInputChange}
                                className="w-full text-sm font-semibold text-gray-800 bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-paleta_3"
                            />
                        ) : (
                            <p className="text-sm font-semibold text-gray-800">${plan.precioTransferencia}</p>
                        )}
                    </div>
                </div>

                {editMode && (
                    <div className="flex gap-3 mt-3">
                        <button
                            className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 py-1.5 rounded-lg text-sm transition-colors"
                            onClick={handleCancelEdit}
                        >
                            Cancelar
                        </button>
                        <button
                            className="flex-1 bg-paleta_2 hover:bg-paleta_1 text-white py-1.5 rounded-lg text-sm transition-colors"
                            onClick={handleEdit}
                        >
                            Guardar
                        </button>
                    </div>
                )}
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
                        <p className="text-gray-500 text-sm mb-1">Confirmar acción</p>
                        <h2 className="text-base font-bold text-gray-800 mb-6">
                            ¿Eliminar <span className="text-red-500">{plan.nombre}</span>?
                        </h2>
                        <div className="flex gap-3">
                            <button
                                className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 py-2 rounded-lg text-sm transition-colors"
                                onClick={() => { setShowDeleteModal(false); setPlanToDelete(null); }}
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
        </>
    );
};

export default PlanCard;
