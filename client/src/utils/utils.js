// Mostrar mejor la Fecha Comienzo (de YYYY-MM-DD a DD/MM/YYYY)
export const formatFecha = fecha => {
  if (!fecha) return ''; // Manejo del caso cuando la fecha es null o undefined
  const [year, month, day] = fecha.split('-'); // Dividir la fecha por el guion
  return `${day}/${month}/${year}`; // Formato DD/MM/YYYY
};

// Función para formatear el historial de pagos
export const formatHistorialPagos = pagos => {
  if (pagos.length === 0) {
    return 'No hay pagos registrados';
  }
  const meses = pagos.map(pago => pago.mes);
  return meses.join(', ');
};

// Función para normalizar y eliminar tildes
export const normalizeText = text => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};
