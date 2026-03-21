/*
    DASHBOARD

*/

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAlumnos } from "../context/AlumnosContext";
import Layout from "../components/ui/Layout";
import { FaArrowRight } from "react-icons/fa";

const InfoCard = ({ onClick, count, text }) => (
    <div
        className="bg-paleta_2 my-2 rounded-md shadow-md hover:bg-paleta_1 flex items-center px-4 py-3 lg:py-4"
        onClick={onClick}
    >
        <span className="text-2xl font-bold mr-4">{count}</span>
        <span>{text}</span>
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
            <div className="mt-2 text-white md:w-1/2 md:m-auto">
                <div className="text-center text-xl uppercase text-black block relative w-full before:h-1 before:bg-paleta_3 before:absolute before:w-full before:left-0 before:top-1/2 before:translate-y-1/2 before:z-0">
                    <span className="text-xl relative z-10 bg-white px-2">
                        Información
                    </span>
                </div>

                <InfoCard
                    onClick={() => navigate("/alumnos")}
                    count={totalAlumnos}
                    text="Alumnos Registrados"
                />

                <InfoCard
                    onClick={() =>
                        navigate("/alumnos", { state: { abono: false } })
                    }
                    count={noAbonaron}
                    text="Faltan Abonar"
                />

                <InfoCard
                    onClick={() =>
                        navigate("/alumnos", { state: { abono: true } })
                    }
                    count={abonaron}
                    text="Ya Abonaron"
                />

                <div className="mt-6 text-center text-xl uppercase text-black block relative w-full before:h-1 before:bg-paleta_3 before:absolute before:w-full before:left-0 before:top-1/2 before:translate-y-1/2 before:z-0">
                    <span className="relative z-10 bg-white px-2">Atajos</span>
                </div>

                <InfoCard
                    onClick={() => navigate("/alumnos")}
                    text="Crear Alumno"
                    count={<FaArrowRight className="text-xl" />}
                />

                <InfoCard
                    onClick={() => navigate("/reportes")}
                    text="Ver Reportes"
                    count={<FaArrowRight className="text-xl" />}
                />
            </div>
        </Layout>
    );
};

export default Home;
