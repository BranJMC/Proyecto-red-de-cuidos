import type { NavItem, PricingPlan, UserRole } from '../types'

export const publicNav: NavItem[] = [
  { label: 'Como funciona', href: '/how-it-works' },
  { label: 'Confianza y seguridad', href: '/trust-safety' },
  { label: 'Ayuda', href: '/help' },
]

export const footerNav: NavItem[] = [
  { label: 'Blog', href: '/blog' },
  { label: 'Testimonios', href: '/testimonials' },
  { label: 'Carreras', href: '/careers' },
  { label: 'Privacidad', href: '/privacy' },
  { label: 'Terminos', href: '/terms' },
  { label: 'Soporte', href: '/support' },
]

export const dashboardNav: Record<UserRole, NavItem[]> = {
  client: [
    { label: 'Inicio', href: '/client/home' },
    { label: 'Reservar servicio', href: '/client/booking' },
    { label: 'Reservas activas', href: '/client/bookings' },
    { label: 'Servicios proximos', href: '/client/upcoming' },
    { label: 'Mensajes', href: '/client/messages' },
    { label: 'Notificaciones', href: '/client/notifications' },
    { label: 'Pagos', href: '/client/payments' },
    { label: 'Resenas dadas', href: '/client/reviews' },
    { label: 'Reportes', href: '/client/reports' },
    { label: 'Ajustes', href: '/client/settings' },
  ],
  caregiver: [
    { label: 'Inicio', href: '/caregiver/home' },
    { label: 'Solicitudes y trabajos', href: '/caregiver/jobs' },
    { label: 'Calendario', href: '/caregiver/calendar' },
    { label: 'Mensajes', href: '/caregiver/messages' },
    { label: 'Notificaciones', href: '/caregiver/notifications' },
    { label: 'Ganancias', href: '/caregiver/earnings' },
    { label: 'Resenas', href: '/caregiver/reviews' },
    { label: 'Perfil', href: '/caregiver/documents' },
    { label: 'Tarifas y zonas', href: '/caregiver/settings' },
  ],
  admin: [
    { label: 'Resumen', href: '/admin/overview' },
    { label: 'Usuarios', href: '/admin/users' },
    { label: 'Aprobaciones', href: '/admin/approvals' },
    { label: 'Comprobantes', href: '/admin/payment-proofs' },
    { label: 'Reportes', href: '/admin/reports' },
    { label: 'Notificaciones', href: '/admin/notifications' },
    { label: 'Auditoria', href: '/admin/audit-logs' },
    { label: 'Backup y ajustes', href: '/admin/settings' },
  ],
}

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Hogar',
    price: '$0',
    description: 'Para familias que desean explorar, comparar y reservar servicios puntuales.',
    features: [
      'Busqueda avanzada por zonas y tarifas',
      'Chat y notificaciones en tiempo real',
      'Carga de comprobantes y seguimiento',
      'Historial de reservas y favoritos',
    ],
  },
  {
    name: 'Premium Family',
    price: '$39/mes',
    description: 'Para hogares con reservas recurrentes, urgencias y alta exigencia operativa.',
    features: [
      'Todo lo del plan Hogar',
      'Repetir ultima reserva con un clic',
      'Soporte prioritario y SLA mejorado',
      'Descuentos y cupones especiales',
    ],
    highlighted: true,
  },
  {
    name: 'Ops Enterprise',
    price: 'Custom',
    description: 'Para programas sociales, aseguradoras, residencias y empresas con volumen.',
    features: [
      'Panel admin multi-equipo',
      'Analitica de zonas y riesgo',
      'Workflow de soporte y fraude',
      'Configuraciones y contenido administrable',
    ],
  },
]
