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
