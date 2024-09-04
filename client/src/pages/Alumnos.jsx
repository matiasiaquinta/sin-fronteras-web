/*Importing react libraries*/
import { useEffect, useState } from 'react';
import { Input } from '../components/ui';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

/*Import backend stuff*/
import { getPlanesRequest } from '../api/planes';
import { useAlumnos } from '../context/AlumnosContext';

import { AlumnoCard } from '../components/alumnos/AlumnoCard';
import Layout from '../components/ui/Layout';

/*Importing utils*/
import { normalizeText } from '../utils/utils';
import { deportes } from '../utils/constants';

export function Alumnos() {
  const [plans, setPlans] = useState([]); // Correct state declaration
  const [loading, setLoading] = useState(true); // Correct state declaration
  const [fetchError, setFetchError] = useState(null); // Correct state declaration
  const [setSelectedPlan] = useState(); // State for selected plan
  // Estado para crear alumno
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [precioEfectivo, setPrecioEfectivo] = useState(0);
  const [precioTransferencia, setPrecioTransferencia] = useState(0);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getPlanesRequest();
        setPlans(response.data); // Set the fetched plans
        setLoading(false);
      } catch (error) {
        console.error('Error fetching plans:', error);
        setFetchError('Failed to fetch plans. Please try again later.');
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const { alumnos, getAlumnos, createAlumno } = useAlumnos();

  const [alumnoToCreate, setAlumnoToCreate] = useState({
    nombre: '',
    mail: '',
    telefono: '',
    deporte: '',
    plan: '',
    fechaComienzo: new Date().toISOString().slice(0, 10),
    fechaPago: '',
    precioEfectivo: 0,
    precioTransferencia: 0,
    abono: false,
    abonoEfectivo: false,
    abonoTransferencia: false,
  });

  // Estados para manejar el Search...
  const [searchTerm, setSearchTerm] = useState('');

  // Muestro todos los alumnos
  useEffect(() => {
    getAlumnos();
  }, []);

  // Función para manejar cambios en los checkboxes de deporte
  const handleCheckboxChange = e => {
    const { value } = e.target;
    let updatedDeportes = [...alumnoToCreate.deporte];

    if (e.target.checked) {
      updatedDeportes.push(value);
    } else {
      updatedDeportes = updatedDeportes.filter(d => d !== value);
    }

    setAlumnoToCreate({ ...alumnoToCreate, deporte: updatedDeportes });
  };
  // Función para manejar el envío del formulario de creación de alumno
  const onSubmit = async data => {
    try {
      // Lógica para determinar la fecha de pago
      let fechaPago = '';
      if (data.pagoFrecuencia === 'personalizado') {
        fechaPago = data.fechaPersonalizada;
      } else {
        fechaPago = data.pagoFrecuencia;
      }

      const deporteArray = alumnoToCreate.deporte;
      const deporteToString = deporteArray.join(', ');

      // Crear el objeto de datos a enviar
      const alumnoData = {
        nombre: alumnoToCreate.nombre,
        mail: alumnoToCreate.mail,
        telefono: alumnoToCreate.telefono,
        deporte: deporteToString,
        plan: alumnoToCreate.plan,
        fechaComienzo: alumnoToCreate.fechaComienzo,
        fechaPago: fechaPago,
        precioEfectivo: parseFloat(alumnoToCreate.precioEfectivo).toFixed(3),
        precioTransferencia: parseFloat(
          alumnoToCreate.precioTransferencia
        ).toFixed(3),
        abono: alumnoToCreate.abono,
        abonoEfectivo: alumnoToCreate.abonoEfectivo,
        abonoTransferencia: alumnoToCreate.abonoTransferencia,
      };

      await createAlumno(alumnoData); // Llama a la función createAlumno que se pasa como prop
      setShowCreateModal(false); // Cierra el modal después de crear el alumno
      resetForm(); // Limpia el formulario después de la creación exitosa
    } catch (error) {
      console.error('Error al crear el alumno:', error);
    }
  };

  const handlePlanChange = e => {
    const planName = e.target.value; // Get the selected plan name from the event
    const selectedPlan = plans.find(plan => plan.nombre === planName); // Find the selected plan by name

    setSelectedPlan(selectedPlan); // Update the selected plan state

    if (selectedPlan) {
      // Update the transfer price and cash price based on the selected plan
      setPrecioEfectivo(selectedPlan.precioEfectivo); // Update the precioEfectivo state
      setPrecioTransferencia(selectedPlan.precioTransferencia);
      setAlumnoToCreate(prevState => ({
        ...prevState,
        plan: planName,
        precioEfectivo: precioEfectivo,
        precioTransferencia: precioTransferencia,
      }));
    } else {
      setPrecioEfectivo(0);
      setPrecioTransferencia(0);
      setAlumnoToCreate(prevState => ({
        ...prevState,
        plan: '',
        precioEfectivo: 0,
        precioTransferencia: 0,
      }));
    }
  };

  // Función para limpiar el formulario después de la creación exitosa
  const resetForm = () => {
    setAlumnoToCreate({
      nombre: '',
      mail: '',
      telefono: '',
      deporte: [],
      plan: '',
      fechaComienzo: '',
      fechaPago: '',
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
  };

  // Observa el valor del selector de rango de fechas
  const pagoFrecuencia = watch('pagoFrecuencia', '');

  // Para la navegación
  const location = useLocation();

  /* Dashboard - maneja si -> abono:true / abono:false / todos los alumnos */
  const { abono } = location.state || { abono: null }; // null por defecto

  // Filtrado del Search Input -> busca dependiendo si abonaron o no o son todos los alumnos
  const filteredAlumnos = alumnos.filter(user => {
    const matchesAbono = abono === null || user.abono === abono;
    const matchesSearchTerm = normalizeText(user.nombre).includes(
      normalizeText(searchTerm)
    );

    return matchesAbono && matchesSearchTerm;
  });

  return (
    <Layout>
      <div>
        <div className="container mx-auto text-center">
          <h1 className="text-2xl uppercase font-bold">Alumnos</h1>
          <hr className="w-52 m-auto border-2 border-paleta_3 mb-4 mt-2" />

          <div className="flex justify-center">
            <button
              className="flex items-center text-lg rounded bg-paleta_2 text-white py-2 px-4"
              onClick={handleOpenCreateModal}
            >
              <FaPlus className="mr-4" />
              Crear Alumno
            </button>
          </div>

          <div className="container mx-auto">
            <input
              type="search"
              placeholder="Buscar Alumno..."
              className="block p-2 my-4 w-5/6 m-auto rounded-md text-black border-2 border-gray-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <span className="block mt-2 mb-1 text-center text-2xl font-bold">
              {abono === true
                ? 'Alumnos que abonaron:'
                : abono === false
                ? 'Alumnos que no abonaron:'
                : 'Alumnos:'}
            </span>
          </div>

          <div className="custom-scrollbar h-[calc(100vh-450px)] overflow-y-scroll overflow-hidden border-2 border-slate-800 rounded-lg">
            {filteredAlumnos.length === 0 ? (
              <div className="text-center text-gray-500 p-4">
                <p>No hay alumnos en esta categoría.</p>
              </div>
            ) : (
              filteredAlumnos.map(alumno => (
                <AlumnoCard key={alumno._id} alumno={alumno} />
              ))
            )}
          </div>
        </div>

        {/* Modal para crear alumno */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="relative bg-white p-6 rounded-md w-4/5 h-[80vh] overflow-hidden custom-scrollbar overflow-y-scroll">
              <button
                type="button"
                className="absolute top-4 right-4 font-bold rounded-full bg-paleta_3 px-4 py-2"
                onClick={handleCloseModal}
              >
                ✕
              </button>
              <h2 className="text-xl font-bold text-black text-center mr-6">
                Crear alumno
              </h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* NOMBRE */}
                <div className="mt-4 mb-2">
                  <label className="font-bold">Nombre:</label>
                  <Input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Escribe el nombre"
                    {...register('nombre', {
                      required: 'Nombre es requerido',
                    })}
                    value={alumnoToCreate.nombre}
                    onChange={e =>
                      setAlumnoToCreate({
                        ...alumnoToCreate,
                        nombre: e.target.value,
                      })
                    }
                  />
                  {errors.nombre && (
                    <p className="text-red-500">{errors.nombre.message}</p>
                  )}
                </div>

                {/* EMAIL */}
                <div className="mb-2">
                  <label className="font-bold">Email:</label>
                  <Input
                    type="email"
                    name="mail"
                    placeholder="Escribe el email"
                    {...register('mail', {
                      required: 'Email es requerido',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Email no es válido',
                      },
                    })}
                    value={alumnoToCreate.mail}
                    onChange={e =>
                      setAlumnoToCreate({
                        ...alumnoToCreate,
                        mail: e.target.value,
                      })
                    }
                  />
                  {errors.mail && (
                    <p className="text-red-500">{errors.mail.message}</p>
                  )}
                </div>

                {/* TELEFONO */}
                <div className="mb-2">
                  <label className="font-bold">Teléfono:</label>
                  <Input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    placeholder="Escribe el teléfono"
                    {...register('telefono', {
                      required: 'Teléfono es requerido',
                    })}
                    value={alumnoToCreate.telefono}
                    onChange={e =>
                      setAlumnoToCreate({
                        ...alumnoToCreate,
                        telefono: e.target.value,
                      })
                    }
                  />
                  {errors.telefono && (
                    <p className="text-red-500">{errors.telefono.message}</p>
                  )}
                </div>

                {/* DEPORTE */}
                <div className="mb-2">
                  <label className="font-bold">Deporte:</label>
                  <div className="flex justify-center">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2 text-black">
                      {deportes.map(deporte => (
                        <div key={deporte.value}>
                          <input
                            type="checkbox"
                            id={deporte.value}
                            name="deporte"
                            value={deporte.value}
                            onChange={handleCheckboxChange}
                            checked={alumnoToCreate.deporte.includes(
                              deporte.value
                            )}
                            className="ml-2 w-4 h-4"
                            /*                                               {...register("deporte", {
                                                required:
                                                    "Selecciona al menos un deporte",
                                            })} */
                          />
                          <label className="ml-1">{deporte.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  {errors.deporte && (
                    <p className="text-red-500">{errors.deporte.message}</p>
                  )}
                </div>

                {/* PLAN */}
                <div className="mb-2">
                  <label className="font-bold">Plan:</label>
                  {loading ? (
                    <p>Loading plans...</p>
                  ) : fetchError ? (
                    <p className="text-red-500">{fetchError}</p>
                  ) : (
                    <select
                      value={plans.nombre} // Use the `nombre` of the selected plan
                      className="selectFocus w-full bg-white text-black border-2 border-slate-800 px-4 py-2 rounded-md"
                      onChange={handlePlanChange} // Add the onChange event
                    >
                      <option value="">Selecciona un plan</option>
                      {plans.map(plan => (
                        <option key={plan.nombre} value={plan.nombre}>
                          {plan.nombre}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* FECHA COMIENZO */}
                <div className="mb-2">
                  <label className="font-bold">Fecha de Comienzo:</label>
                  <Input
                    type="date"
                    name="fechaComienzo"
                    value={alumnoToCreate.fechaComienzo}
                    onChange={e =>
                      setAlumnoToCreate({
                        ...alumnoToCreate,
                        fechaComienzo: e.target.value,
                      })
                    }
                  />
                </div>

                {/* SELECTOR FECHA PAGO */}
                <div className="mb-2">
                  <label className="font-bold">Fecha de Pago:</label>
                  <select
                    {...register('pagoFrecuencia', {
                      required: 'Selecciona una opción de fecha de pago',
                    })}
                    className="selectFocus w-full bg-white text-black border-2 border-slate-800 px-4 py-2 rounded-md"
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="1-5">1 al 5</option>
                    <option value="1-10">1 al 10</option>
                    <option value="personalizado">Personalizado</option>
                  </select>
                  {errors.pagoFrecuencia && (
                    <p className="text-red-500">
                      {errors.pagoFrecuencia.message}
                    </p>
                  )}
                </div>

                {/* CAMPO EXTRA: fecha personalizada */}
                {pagoFrecuencia === 'personalizado' && (
                  <div className="mb-2">
                    <label className="font-bold">Fecha Personalizada:</label>
                    <Input
                      type="number"
                      {...register('fechaPersonalizada', {
                        required: 'Especifica una fecha de pago personalizada',
                        min: {
                          value: 1,
                          message: 'Debe ser entre 1 y 31',
                        },
                        max: {
                          value: 31,
                          message: 'Debe ser entre 1 y 31',
                        },
                      })}
                      placeholder="Día del mes (1-31)"
                      className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                    />
                    {errors.fechaPersonalizada && (
                      <p className="text-red-500">
                        {errors.fechaPersonalizada.message}
                      </p>
                    )}
                  </div>
                )}

                {/* PRECIO */}
                <div className="mb-2 mt-2">
                  <div className="mb-2">
                    <label className="font-bold ml-6">Precio Efectivo:</label>
                    <div className="flex items-center">
                      <span className="text-xl text-black ml-2 mr-1 font-bold">
                        $
                      </span>
                      <Input
                        type="text"
                        value={precioEfectivo}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                        onChange={e =>
                          setAlumnoToCreate({
                            ...alumnoToCreate,
                            precioEfectivo: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="font-bold ml-6">
                      Precio Transferencia:
                    </label>
                    <div className="flex items-center">
                      <span className="text-xl text-black ml-2 mr-1 font-bold">
                        $
                      </span>
                      <Input
                        type="text"
                        value={precioTransferencia}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                        onChange={e =>
                          setAlumnoToCreate({
                            ...alumnoToCreate,
                            precioTransferencia: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* ABONO */}
                <div className="mb-2">
                  <label className="font-bold ml-6">Abono con:</label>
                  <div className="flex justify-center space-x-8 mt-2">
                    <div className="flex flex-col items-center">
                      <div
                        onClick={() =>
                          setAlumnoToCreate({
                            ...alumnoToCreate,
                            abonoEfectivo: !alumnoToCreate.abonoEfectivo,
                            abonoTransferencia: false,
                          })
                        }
                        className={`w-12 h-12 flex items-center justify-center rounded-full cursor-pointer ${
                          alumnoToCreate.abonoEfectivo
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {alumnoToCreate.abonoEfectivo ? (
                          <span className="text-white font-bold">Si</span>
                        ) : (
                          <span className="text-white">No</span>
                        )}
                      </div>
                      <p className="mt-2 text-sm">Efectivo</p>
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
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {alumnoToCreate.abonoTransferencia ? (
                          <span className="text-white font-bold">Si</span>
                        ) : (
                          <span className="text-white">No</span>
                        )}
                      </div>
                      <p className="mt-2 text-sm">Transferencia</p>
                    </div>
                  </div>
                </div>

                {/*  */}
                <div className="flex justify-center items-center gap-8 mt-8">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Crear
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
