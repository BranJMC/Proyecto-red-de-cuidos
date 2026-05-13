import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash)
}

export function hashToken(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex')
}

export function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function generateSecureToken() {
  return crypto.randomBytes(32).toString('hex')
}

export function maskEmail(email) {
  const [localPart = '', domain = ''] = String(email).split('@')
  if (!localPart || !domain) {
    return email
  }

  const visibleStart = localPart.slice(0, 2)
  const visibleEnd = localPart.length > 4 ? localPart.slice(-1) : ''
  const maskedSection = '*'.repeat(Math.max(2, localPart.length - visibleStart.length - visibleEnd.length))
  return `${visibleStart}${maskedSection}${visibleEnd}@${domain}`
}

export function mapBookingStatus(status) {
  const statusMap = {
    draft: 'pending',
    pending_payment: 'pending',
    payment_review: 'pending',
    requested: 'pending',
    confirmed: 'confirmed',
    in_progress: 'confirmed',
    completed: 'completed',
    cancelled: 'cancelled',
    rejected: 'cancelled',
  }

  return statusMap[status] ?? 'pending'
}

export function mapPaymentProofStatus(status) {
  const statusMap = {
    pending_review: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected',
    refunded: 'Rejected',
  }

  return statusMap[status] ?? 'Pending Review'
}

export function mapAiDecision(decision) {
  const decisionMap = {
    approved: 'approved',
    manual_review: 'manual-review',
    rejected: 'rejected',
  }

  return decisionMap[decision] ?? 'manual-review'
}

export function formatCurrencyValue(value) {
  return Number(value ?? 0)
}

export function formatTimeLabel(dateValue) {
  return new Intl.DateTimeFormat('es-CR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateValue))
}

export function formatDateLabel(dateValue) {
  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(dateValue))
}

export function formatDateInputValue(dateValue) {
  if (!dateValue) {
    return ''
  }

  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue
  }

  return new Date(dateValue).toISOString().slice(0, 10)
}
