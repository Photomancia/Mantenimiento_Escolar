// Valores predeterminados para la DEMO (sin backend).

export const PADRES_INICIALES = [
  { id: 'p1', nombre: 'María González', documento: '30123456', telefono: '11-5555-0101', email: 'maria.gonzalez@mail.com' },
  { id: 'p2', nombre: 'Carlos Pérez', documento: '28987654', telefono: '11-5555-0202', email: 'carlos.perez@mail.com' },
  { id: 'p3', nombre: 'Lucía Fernández', documento: '33456789', telefono: '11-5555-0303', email: 'lucia.fernandez@mail.com' },
  { id: 'p4', nombre: 'Jorge Ramírez', documento: '27654321', telefono: '11-5555-0404', email: 'jorge.ramirez@mail.com' },
]

// estado: 'ausente' | 'presente' | 'retirado'
export const NINOS_INICIALES = [
  { id: 'n1', nombre: 'Sofía González', grado: '1° A', historialMedico: '', padreId: 'p1', estado: 'ausente', entrada: null, salida: null },
  { id: 'n2', nombre: 'Mateo González', grado: '3° B', historialMedico: 'Asma leve — salbutamol inhalador (2 disparos) ante dificultad respiratoria.', padreId: 'p1', estado: 'ausente', entrada: null, salida: null },
  { id: 'n3', nombre: 'Valentina Pérez', grado: '2° A', historialMedico: '', padreId: 'p2', estado: 'presente', entrada: '07:45', salida: null },
  { id: 'n4', nombre: 'Tomás Fernández', grado: 'Sala de 5', historialMedico: 'Alergia a la penicilina. Antihistamínico (cetirizina) 5 ml a las 12:00.', padreId: 'p3', estado: 'presente', entrada: '07:52', salida: null },
  { id: 'n5', nombre: 'Emma Ramírez', grado: '1° B', historialMedico: '', padreId: 'p4', estado: 'ausente', entrada: null, salida: null },
]

export const BITACORA_INICIAL = [
  {
    id: 'i1',
    ninoId: 'n4',
    hora: '09:30',
    tipo: 'Salud',
    descripcion: 'Se quejó de dolor de cabeza; descansó 15 minutos en enfermería y se reincorporó.',
    notificado: true,
  },
]

export const MOVIMIENTOS_INICIALES = [
  { id: 'm1', ninoId: 'n3', tipo: 'Entrada', hora: '07:45', padreId: 'p2' },
  { id: 'm2', ninoId: 'n4', tipo: 'Entrada', hora: '07:52', padreId: 'p3' },
]

export const TIPOS_INCIDENTE = ['Salud', 'Accidente', 'Conducta', 'Pérdida de objeto', 'Otro']

export const horaActual = () =>
  new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })

export const nuevoId = (prefijo) => `${prefijo}${Date.now()}${Math.floor(Math.random() * 1000)}`
