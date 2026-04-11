/*
    DASHBOARD

*/

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAlumnos } from "../context/AlumnosContext";
import Layout from "../components/ui/Layout";
import { FaArrowRight } from "react-icons/fa";

const InfoCard = ({ onClick, count, text, accent }) => (
    <div
        className="bg-white my-2 rounded-xl shadow-sm border border-gray-100 flex items-center px-5 py-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={onClick}
    >
        <span className={`text-2xl font-bold mr-4 ${accent || "text-paleta_2"}`}>{count}</span>
        <span className="text-gray-700">{text}</span>
    </div>
);

const Home = () => {
    const { alumnos, getAlumnos } = useAlumnos();
    const navigate = useNavigate();

    useEffect(() => {
        getAlumnos();
    }, []);

    const totalAlumnos = alumnos.length;
    const abonaron = alumnos.filter((a) => a.abono === true).length;
    const noAbonaron = alumnos.filter((a) => a.abono === false).length;

    return (
        <Layout>
            <div className="mt-2 max-w-sm mx-auto w-full">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Resumen</p>

                <InfoCard
                    onClick={() => navigate("/alumnos")}
                    count={totalAlumnos}
                    text="Alumnos Registrados"
                    accent="text-paleta_2"
                />
                <InfoCard
                    onClick={() => navigate("/alumnos", { state: { abono: false } })}
                    count={noAbonaron}
                    text="Faltan Abonar"
                    accent="text-red-500"
                />
                <InfoCard
                    onClick={() => navigate("/alumnos", { state: { abono: true } })}
                    count={abonaron}
                    text="Ya Abonaron"
                    accent="text-green-600"
                />

                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mt-6 mb-2">Atajos</p>

                <InfoCard
                    onClick={() => navigate("/alumnos")}
                    text="Crear Alumno"
                    count={<FaArrowRight className="text-paleta_2" />}
                />
                <InfoCard
                    onClick={() => navigate("/reportes")}
                    text="Ver Reportes"
                    count={<FaArrowRight className="text-paleta_2" />}
                />
            </div>
        </Layout>
    );
};

export default Home;
