import type {
  AdminUser,
  AuditLog,
  Booking,
  Caregiver,
  Complaint,
  ContentItem,
  DashboardMetric,
  FraudAlert,
  MessageThread,
  NotificationItem,
  PaymentHistoryItem,
  PaymentProof,
  Review,
  SavedSearch,
  SupportTicket,
  VerificationStep,
  Zone,
} from '../types'

export const zones: Zone[] = [
  { id: 'z1', city: 'San Jose', neighborhood: 'Escazu', demandLevel: 'high', activeCaregivers: 38 },
  { id: 'z2', city: 'San Jose', neighborhood: 'Santa Ana', demandLevel: 'high', activeCaregivers: 29 },
  { id: 'z3', city: 'Heredia', neighborhood: 'Belen', demandLevel: 'medium', activeCaregivers: 17 },
  { id: 'z4', city: 'Alajuela', neighborhood: 'La Guacima', demandLevel: 'emerging', activeCaregivers: 12 },
  { id: 'z5', city: 'Cartago', neighborhood: 'Tres Rios', demandLevel: 'medium', activeCaregivers: 14 },
]

export const caregivers: Caregiver[] = [
  {
    id: 'cg-1',
    slug: 'valeria-rojas',
    name: 'Valeria Rojas',
    specialty: 'Child care and learning support',
    city: 'San Jose',
    neighborhood: 'Escazu',
    zones: ['Escazu', 'Santa Ana', 'Sabana'],
    languages: ['Espanol', 'Ingles'],
    pricePerHour: 18,
    nightShiftFee: 8,
    weekendFee: 6,
    emergencyFee: 12,
    rating: 4.9,
    reviews: 128,
    verified: true,
    urgentAvailability: true,
    availableNow: true,
    availableToday: true,
    nightShiftAvailable: true,
    weekendAvailable: true,
    emergencyService: true,
    experienceYears: 7,
    serviceTypes: ['Child care', 'Overnight care', 'Emergency care'],
    about:
      'Especialista en primera infancia, rutinas seguras y acompanamiento despues de clases con enfoque Montessori.',
    certifications: ['Primeros auxilios', 'Psicologia infantil', 'RCP'],
    availability: ['Hoy 14:00-20:00', 'Manana 08:00-18:00', 'Sabado 09:00-15:00'],
    workingDays: ['Lunes', 'Martes', 'Jueves', 'Viernes', 'Sabado'],
    workingHours: ['07:00-12:00', '14:00-21:00'],
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'cg-2',
    slug: 'daniel-castro',
    name: 'Daniel Castro',
    specialty: 'Elder care and medication routines',
    city: 'Heredia',
    neighborhood: 'Belen',
    zones: ['Belen', 'Heredia Centro', 'Lagunilla'],
    languages: ['Espanol'],
    pricePerHour: 20,
    nightShiftFee: 10,
    weekendFee: 7,
    emergencyFee: 16,
    rating: 4.8,
    reviews: 92,
    verified: true,
    urgentAvailability: false,
    availableNow: false,
    availableToday: true,
    nightShiftAvailable: true,
    weekendAvailable: false,
    emergencyService: false,
    experienceYears: 10,
    serviceTypes: ['Elder care', 'Home assistance'],
    about:
      'Cuidador gerontologico enfocado en movilidad, compania activa y seguimiento de medicacion diaria.',
    certifications: ['Asistente geriatrico', 'Manejo de medicamentos'],
    availability: ['Lunes a Viernes 07:00-17:00'],
    workingDays: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'],
    workingHours: ['07:00-17:00'],
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'cg-3',
    slug: 'monica-arias',
    name: 'Monica Arias',
    specialty: 'Disability support and adaptive routines',
    city: 'Alajuela',
    neighborhood: 'La Guacima',
    zones: ['La Guacima', 'Coyol', 'Belen'],
    languages: ['Espanol', 'Ingles', 'LESCO'],
    pricePerHour: 24,
    nightShiftFee: 12,
    weekendFee: 8,
    emergencyFee: 18,
    rating: 5,
    reviews: 67,
    verified: true,
    urgentAvailability: true,
    availableNow: true,
    availableToday: true,
    nightShiftAvailable: true,
    weekendAvailable: true,
    emergencyService: true,
    experienceYears: 9,
    serviceTypes: ['Disability support', 'Emergency care', 'Home assistance'],
    about:
      'Disena planes de acompanamiento inclusivo para ninos y adultos con necesidades funcionales diversas.',
    certifications: ['Terapia ocupacional', 'Comunicacion aumentativa'],
    availability: ['Disponible 24 horas con reserva'],
    workingDays: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
    workingHours: ['06:00-22:00'],
    image:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'cg-4',
    slug: 'sofia-meneses',
    name: 'Sofia Meneses',
    specialty: 'Home assistance and overnight care',
    city: 'Cartago',
    neighborhood: 'Tres Rios',
    zones: ['Tres Rios', 'Curridabat', 'San Pedro'],
    languages: ['Espanol', 'Ingles'],
    pricePerHour: 19,
    nightShiftFee: 9,
    weekendFee: 7,
    emergencyFee: 15,
    rating: 4.7,
    reviews: 54,
    verified: true,
    urgentAvailability: true,
    availableNow: false,
    availableToday: true,
    nightShiftAvailable: true,
    weekendAvailable: true,
    emergencyService: true,
    experienceYears: 6,
    serviceTypes: ['Home assistance', 'Overnight care', 'Child care'],
    about:
      'Combina soporte del hogar con acompanamiento delicado para rutinas nocturnas y cuidados prolongados.',
    certifications: ['Cuidados paliativos basicos', 'RCP'],
    availability: ['Hoy 18:00-23:00', 'Domingo 08:00-20:00'],
    workingDays: ['Martes', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
    workingHours: ['08:00-23:00'],
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=80',
  },
]

export const bookings: Booking[] = [
  {
    id: 'bk-1',
    caregiverId: 'cg-1',
    caregiverName: 'Valeria Rojas',
    clientName: 'Ana Gutierrez',
    service: 'Child care',
    zone: 'Escazu',
    date: '2026-04-19',
    startTime: '14:00',
    duration: '4 horas',
    hours: 4,
    status: 'confirmed',
    amount: 72,
  },
  {
    id: 'bk-2',
    caregiverId: 'cg-2',
    caregiverName: 'Daniel Castro',
    clientName: 'Familia Robles',
    service: 'Elder care',
    zone: 'Belen',
    date: '2026-04-21',
    startTime: '08:00',
    duration: '8 horas',
    hours: 8,
    status: 'pending',
    amount: 160,
  },
  {
    id: 'bk-3',
    caregiverId: 'cg-3',
    caregiverName: 'Monica Arias',
    clientName: 'Pablo Rojas',
    service: 'Disability support',
    zone: 'La Guacima',
    date: '2026-04-16',
    startTime: '10:00',
    duration: '6 horas',
    hours: 6,
    status: 'completed',
    amount: 144,
  },
  {
    id: 'bk-4',
    caregiverId: 'cg-4',
    caregiverName: 'Sofia Meneses',
    clientName: 'Ana Gutierrez',
    service: 'Overnight care',
    zone: 'Tres Rios',
    date: '2026-04-23',
    startTime: '20:00',
    duration: '10 horas',
    hours: 10,
    status: 'confirmed',
    amount: 235,
  },
]

export const notifications: NotificationItem[] = [
  {
    id: 'nt-1',
    title: 'Nueva solicitud confirmada',
    description: 'Valeria acepto tu reserva para hoy a las 14:00.',
    time: 'Hace 2 min',
    read: false,
    type: 'booking',
  },
  {
    id: 'nt-2',
    title: 'Comprobante recibido',
    description: 'Tu recibo de pago ingreso a revision automatizable por AI.',
    time: 'Hace 18 min',
    read: false,
    type: 'payment',
  },
  {
    id: 'nt-3',
    title: 'Urgencia en Escazu',
    description: 'Hay una nueva solicitud para servicio de emergencia en menos de 2 horas.',
    time: 'Hace 32 min',
    read: true,
    type: 'alert',
  },
  {
    id: 'nt-4',
    title: 'Nuevo mensaje',
    description: 'Monica envio instrucciones previas a la visita.',
    time: 'Hace 3 h',
    read: true,
    type: 'chat',
  },
]

export const messageThreads: MessageThread[] = [
  {
    id: 'th-1',
    participant: 'Valeria Rojas',
    role: 'caregiver',
    status: 'online',
    unread: 2,
    lastMessage: 'Estoy saliendo hacia tu ubicacion.',
    lastMessageAt: '12:41',
    messages: [
      { id: 'm1', author: 'other', content: 'Hola, confirme la reserva.', time: '12:29' },
      { id: 'm2', author: 'me', content: 'Perfecto, te esperamos.', time: '12:32' },
      { id: 'm3', author: 'other', content: 'Estoy saliendo hacia tu ubicacion.', time: '12:41' },
    ],
  },
  {
    id: 'th-2',
    participant: 'Equipo de soporte',
    role: 'admin',
    status: 'online',
    unread: 0,
    lastMessage: 'Tu comprobante esta en revision manual.',
    lastMessageAt: 'Ayer',
    messages: [{ id: 'm4', author: 'other', content: 'Tu comprobante esta en revision manual.', time: 'Ayer' }],
  },
]

export const clientMetrics: DashboardMetric[] = [
  { label: 'Monthly spending', value: '$824', change: '+14% vs mes pasado', accent: 'sky' },
  { label: 'Active bookings', value: '03', change: '2 empiezan esta semana', accent: 'emerald' },
  { label: 'Pending requests', value: '02', change: '1 necesita comprobante', accent: 'amber' },
  { label: 'Most hired caregiver', value: 'Valeria', change: '6 reservas recurrentes', accent: 'rose' },
]

export const caregiverMetrics: DashboardMetric[] = [
  { label: 'Weekly earnings', value: '$640', change: '+11% vs sem anterior', accent: 'emerald' },
  { label: 'Jobs completed', value: '18', change: '4 esta semana', accent: 'sky' },
  { label: 'Rating score', value: '4.9', change: '128 resenas', accent: 'amber' },
  { label: 'Response speed', value: '7 min', change: 'Top 8% de la red', accent: 'rose' },
]

export const adminMetrics: DashboardMetric[] = [
  { label: 'GMV mensual', value: '$148K', change: '+12.8%', accent: 'emerald' },
  { label: 'Usuarios activos', value: '8,420', change: '+640', accent: 'sky' },
  { label: 'Alertas criticas', value: '09', change: 'fraude y soporte', accent: 'amber' },
  { label: 'Take rate', value: '17%', change: '+1.8 pts', accent: 'rose' },
]

export const adminUsers: AdminUser[] = [
  {
    id: 'u-1',
    name: 'Ana Gutierrez',
    email: 'ana@familia.com',
    role: 'client',
    status: 'active',
    joinedAt: '2026-03-12',
    city: 'San Jose',
  },
  {
    id: 'u-2',
    name: 'Monica Arias',
    email: 'monica@cuidados.com',
    role: 'caregiver',
    status: 'pending',
    joinedAt: '2026-04-16',
    city: 'Alajuela',
  },
  {
    id: 'u-3',
    name: 'Carlos Mora',
    email: 'carlos@redcuidados.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2025-11-01',
    city: 'San Jose',
  },
]

export const verificationSteps: VerificationStep[] = [
  {
    id: 'vs-1',
    title: 'Cedula nacional',
    description: 'Sube frente y reverso. OCR listo para conectarse al backend.',
    status: 'pending',
  },
  {
    id: 'vs-2',
    title: 'Foto facial obligatoria',
    description: 'Captura o sube una foto frontal con buena luz.',
    status: 'approved',
  },
  {
    id: 'vs-3',
    title: 'Email verificado',
    description: 'Codigo OTP enviado al correo registrado.',
    status: 'approved',
  },
  {
    id: 'vs-4',
    title: 'SMS verificado',
    description: 'Valida el numero movil con OTP de 6 digitos.',
    status: 'pending',
  },
]

export const reviews: Review[] = [
  {
    id: 'rv-1',
    author: 'Laura Vega',
    rating: 5,
    date: '14 Apr 2026',
    comment: 'Valeria fue increible con mis hijos. Puntual, calida y super profesional.',
  },
  {
    id: 'rv-2',
    author: 'Pablo Rojas',
    rating: 5,
    date: '08 Apr 2026',
    comment: 'Monica entendio rapidamente nuestras necesidades y mejoro la rutina en casa.',
  },
  {
    id: 'rv-3',
    author: 'Marcela Soto',
    rating: 4,
    date: '05 Apr 2026',
    comment: 'Sofia resolvio una noche compleja con mucho criterio y comunicacion.',
  },
]

export const savedSearches: SavedSearch[] = [
  {
    id: 'ss-1',
    title: 'Cuidado nocturno en Escazu',
    filters: ['Escazu', 'Overnight care', 'Verified only'],
    matches: 12,
  },
  {
    id: 'ss-2',
    title: 'Apoyo bilingue de emergencia',
    filters: ['Emergency care', 'Ingles', 'Available now'],
    matches: 7,
  },
]

export const paymentHistory: PaymentHistoryItem[] = [
  { id: 'ph-1', date: '19 Apr 2026', caregiverName: 'Valeria Rojas', amount: 72, method: 'Sinpe', status: 'paid' },
  { id: 'ph-2', date: '17 Apr 2026', caregiverName: 'Monica Arias', amount: 144, method: 'Transferencia', status: 'pending-review' },
  { id: 'ph-3', date: '10 Apr 2026', caregiverName: 'Daniel Castro', amount: 160, method: 'Tarjeta', status: 'paid' },
]

export const paymentProofs: PaymentProof[] = [
  { id: 'pp-1', bookingId: 'bk-1', payer: 'Ana Gutierrez', uploadedAt: '19 Apr 2026 12:10', status: 'Pending Review', amount: 72 },
  { id: 'pp-2', bookingId: 'bk-3', payer: 'Pablo Rojas', uploadedAt: '16 Apr 2026 09:02', status: 'Approved', amount: 144 },
  { id: 'pp-3', bookingId: 'bk-2', payer: 'Familia Robles', uploadedAt: '18 Apr 2026 18:40', status: 'Rejected', amount: 160 },
]

export const complaints: Complaint[] = [
  { id: 'cp-1', subject: 'Llegada tardia', type: 'servicio', priority: 'medium', status: 'investigating' },
  { id: 'cp-2', subject: 'Documento no legible', type: 'verificacion', priority: 'high', status: 'open' },
  { id: 'cp-3', subject: 'Cobro duplicado', type: 'pagos', priority: 'high', status: 'resolved' },
]

export const supportTickets: SupportTicket[] = [
  { id: 'st-1', requester: 'Ana Gutierrez', topic: 'Repetir reserva', channel: 'WhatsApp', sla: '2h', status: 'new' },
  { id: 'st-2', requester: 'Monica Arias', topic: 'Cambio de zona', channel: 'Email', sla: '6h', status: 'in-progress' },
  { id: 'st-3', requester: 'Familia Robles', topic: 'Comprobante rechazado', channel: 'Web', sla: '1h', status: 'waiting' },
]

export const fraudAlerts: FraudAlert[] = [
  {
    id: 'fa-1',
    label: 'Patron anomalo de comprobantes',
    risk: 'critical',
    location: 'Escazu',
    detail: 'Tres recibos editados digitalmente desde el mismo dispositivo.',
  },
  {
    id: 'fa-2',
    label: 'Sesion sospechosa',
    risk: 'high',
    location: 'Belen',
    detail: 'Intentos repetidos de cambio de cuenta bancaria en menos de 30 min.',
  },
  {
    id: 'fa-3',
    label: 'Match de identidad pendiente',
    risk: 'medium',
    location: 'La Guacima',
    detail: 'La selfie no coincide con el ultimo documento actualizado.',
  },
]

export const contentItems: ContentItem[] = [
  { id: 'ct-1', title: 'FAQ onboarding caregivers', section: 'Help center', status: 'published' },
  { id: 'ct-2', title: 'Campana safety week', section: 'Home banner', status: 'scheduled' },
  { id: 'ct-3', title: 'Blog crisis care at night', section: 'Blog', status: 'draft' },
]

export const auditLogs: AuditLog[] = [
  { id: 'al-1', actor: 'Carlos Mora', action: 'Aprobo cuidador', target: 'Monica Arias', timestamp: '2026-04-19 10:18' },
  { id: 'al-2', actor: 'Ops Bot', action: 'Marco alerta', target: 'Comprobante pp-1', timestamp: '2026-04-19 11:02' },
  { id: 'al-3', actor: 'Sara de soporte', action: 'Cerre ticket', target: 'st-2', timestamp: '2026-04-19 12:31' },
]

export const earningsSeries = [
  { name: 'Sem 1', ingresos: 380 },
  { name: 'Sem 2', ingresos: 560 },
  { name: 'Sem 3', ingresos: 610 },
  { name: 'Sem 4', ingresos: 840 },
]

export const spendingSeries = [
  { name: 'Ene', spend: 410 },
  { name: 'Feb', spend: 520 },
  { name: 'Mar', spend: 684 },
  { name: 'Abr', spend: 824 },
]

export const platformSeries = [
  { name: 'Ene', clientes: 1200, cuidadores: 430, reservas: 3900, ingresos: 58000 },
  { name: 'Feb', clientes: 1640, cuidadores: 510, reservas: 4520, ingresos: 77000 },
  { name: 'Mar', clientes: 2130, cuidadores: 620, reservas: 5140, ingresos: 102000 },
  { name: 'Abr', clientes: 2870, cuidadores: 760, reservas: 6380, ingresos: 148000 },
]
