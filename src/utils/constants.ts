import type { DemoUser, NavItem, PricingPlan, UserRole } from '../types'

export const publicNav: NavItem[] = [
  { label: 'Como funciona', href: '/how-it-works' },
  { label: 'Trust & Safety', href: '/trust-safety' },
  { label: 'Help', href: '/help' },
]

export const footerNav: NavItem[] = [
  { label: 'Blog', href: '/blog' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Careers', href: '/careers' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Support', href: '/support' },
]

export const dashboardNav: Record<UserRole, NavItem[]> = {
  client: [
    { label: 'Inicio', href: '/client/home' },
    { label: 'Reservar servicio', href: '/client/booking' },
    { label: 'Reservas activas', href: '/client/bookings' },
    { label: 'Servicios proximos', href: '/client/upcoming' },
    { label: 'Favoritos', href: '/client/favorites' },
    { label: 'Busquedas guardadas', href: '/client/saved-searches' },
    { label: 'Mensajes', href: '/client/messages', badge: '3' },
    { label: 'Notificaciones', href: '/client/notifications' },
    { label: 'Pagos', href: '/client/payments' },
    { label: 'Resenas dadas', href: '/client/reviews' },
    { label: 'Reportes', href: '/client/reports' },
    { label: 'Ajustes', href: '/client/settings' },
  ],
  caregiver: [
    { label: 'Inicio', href: '/caregiver/home' },
    { label: 'Solicitudes', href: '/caregiver/jobs', badge: '5' },
    { label: 'Trabajos aceptados', href: '/caregiver/accepted-jobs' },
    { label: 'Calendario', href: '/caregiver/calendar' },
    { label: 'Mensajes', href: '/caregiver/messages', badge: '8' },
    { label: 'Notificaciones', href: '/caregiver/notifications' },
    { label: 'Ganancias', href: '/caregiver/earnings' },
    { label: 'Resenas', href: '/caregiver/reviews' },
    { label: 'Documentos', href: '/caregiver/documents' },
    { label: 'Tarifas y zonas', href: '/caregiver/settings' },
  ],
  admin: [
    { label: 'Overview', href: '/admin/overview' },
    { label: 'Usuarios', href: '/admin/users' },
    { label: 'Aprobaciones', href: '/admin/approvals', badge: '12' },
    { label: 'Comprobantes', href: '/admin/payment-proofs' },
    { label: 'Reportes', href: '/admin/reports' },
    { label: 'Tickets', href: '/admin/support' },
    { label: 'Fraude', href: '/admin/fraud-alerts' },
    { label: 'Notificaciones', href: '/admin/notifications' },
    { label: 'Analitica', href: '/admin/analytics' },
    { label: 'Contenido', href: '/admin/content' },
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

export const demoUsers: Record<UserRole, DemoUser> = {
  client: {
    name: 'Ana Gutierrez',
    email: 'ana@familia.com',
    role: 'client',
    title: 'Madre premium • cliente demo',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  caregiver: {
    name: 'Monica Arias',
    email: 'monica@cuidados.com',
    role: 'caregiver',
    title: 'Cuidadora verificada • demo',
    avatar:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80',
  },
  admin: {
    name: 'Carlos Mora',
    email: 'carlos@redcuidados.com',
    role: 'admin',
    title: 'Platform ops lead • demo',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
}
