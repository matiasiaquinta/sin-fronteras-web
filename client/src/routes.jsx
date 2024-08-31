import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Cookies from "js-cookie";

export const ProtectedRoute = () => {
    const { isAuthenticated, loading, setLoading } = useAuth();

    // Agrego esto para arreglar bug de loop infinito en Cargando...
    const handleReload = () => {
        Cookies.remove("token");
        setLoading(false);
        window.location.reload(); // recargar pagina
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-3xl font-semibold text-gray-700 mb-6">
                    Cargando...
                </h1>
                <button
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={handleReload}
                >
                    Recargar Sistema
                </button>
            </div>
        );
    }

    if (!isAuthenticated && !loading) return <Navigate to="/login" replace />;

    return <Outlet />;
};
