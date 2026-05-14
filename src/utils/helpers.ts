export function currency(value: number) {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function roleLabel(role: string) {
  switch (role) {
    case 'client':
      return 'Cliente'
    case 'caregiver':
      return 'Cuidador'
    case 'admin':
      return 'Admin'
    default:
      return role
  }
}

export function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function statusTone(status: string) {
  if (
    status.includes('Approved') ||
    status.includes('approved') ||
    status.includes('recommended') ||
    status.includes('ready') ||
    status.includes('paid') ||
    status.includes('active') ||
    status.includes('completed') ||
    status.includes('resolved')
  ) {
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300'
  }

  if (
    status.includes('Rejected') ||
    status.includes('rejected') ||
    status.includes('cancelled') ||
    status.includes('suspended') ||
    status.includes('critical')
  ) {
    return 'bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300'
  }

  return 'bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300'
}

export function bookingOperationalTone(status?: string) {
  switch (status) {
    case 'completed':
    case 'Finalizado':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300'
    case 'in-progress':
    case 'En progreso':
      return 'bg-sky-100 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300'
    case 'missed':
      return 'bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300'
    default:
      return 'bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300'
  }
}

export function paymentProofStatusLabel(status?: string) {
  switch (status) {
    case 'Approved':
      return 'Aprobado'
    case 'Rejected':
      return 'Rechazado'
    case 'Pending Review':
      return 'Pendiente de revision'
    default:
      return status ?? 'Pendiente'
  }
}

export function aiDecisionLabel(decision?: string) {
  switch (decision) {
    case 'approved':
      return 'Aprobado'
    case 'recommended':
      return 'Recomendado'
    case 'manual-review':
      return 'Revision manual'
    case 'reject':
    case 'rejected':
      return 'Rechazado'
    default:
      return decision ?? 'Pendiente'
  }
}

export function serviceLabel(service?: string) {
  switch (service) {
    case 'Elder care':
      return 'Cuidado de adulto mayor'
    case 'Child care':
      return 'Cuidado infantil'
    case 'Disability support':
      return 'Apoyo a discapacidad'
    case 'Home assistance':
      return 'Asistencia en el hogar'
    case 'Overnight care':
      return 'Cuidado nocturno'
    case 'Emergency care':
      return 'Cuidado de emergencia'
    default:
      return service ?? 'Servicio'
  }
}
