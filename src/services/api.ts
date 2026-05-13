import axios from 'axios'
import {
  adminMetrics,
  adminUsers,
  approvalDossiers,
  backupRecords,
  contentItems,
  bookings,
  caregivers,
  caregiverMetrics,
  clientMetrics,
  earningsSeries,
  hourlyServiceUpdates,
  messageThreads,
  notifications,
  paymentHistory,
  paymentProofs,
  platformSeries,
  complaints,
  reviews,
  savedSearches,
  socialPosts,
  supportTickets,
  fraudAlerts,
  auditLogs,
  caregiverUpcomingReminders,
  calendarDaysByCaregiver,
  verificationSteps,
  zones,
} from './mockData'
import type {
  AccountProfile,
  Booking,
  CaregiverApplicationDocument,
  CaregiverApplicationStatus,
  CalendarDayStatus,
  CaregiverWorkingHour,
  Complaint,
  ContentItem,
  FraudAlert,
  MessageThread,
  NotificationItem,
  PaymentProof,
  CaregiverEarningsSummary,
  PaymentHistoryItem,
  PlatformSettings,
  SavedSearch,
  ServiceUpdate,
  ShiftLog,
  SupportTicket,
  UserRole,
  VerificationStep,
  Zone,
} from '../types'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  config.headers['x-app-source'] = 'red-de-cuidados-web'
  return config
})

const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))
const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false'

async function getResource<T>(path: string, fallback: T): Promise<T> {
  if (useMocks) {
    await wait()
    return fallback
  }

  const response = await api.get<T>(path)
  return response.data
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: UserRole
    title: string
    avatar: string
    phone?: string
    status?: string
  }
}

export interface LoginChallengeResponse {
  requiresTwoFactor: true
  challengeId: string
  emailMasked: string
  role: UserRole
  expiresInMinutes: number
}

export interface RegisterResponse {
  ok: true
  userId: string
  role: UserRole
  message: string
}

export const mockApi = {
  async login(payload: { email: string; password: string; role: UserRole }) {
    if (useMocks) {
      await wait()
      if (payload.role === 'admin') {
        return {
          token: 'mock-token',
          user: {
            id: crypto.randomUUID(),
            name: 'Lucia Herrera',
            email: payload.email,
            role: payload.role,
            title: 'Administrador',
            avatar: '',
          },
        } satisfies AuthResponse
      }

      return {
        requiresTwoFactor: true,
        challengeId: crypto.randomUUID(),
        emailMasked: payload.email,
        role: payload.role,
        expiresInMinutes: 10,
      } satisfies LoginChallengeResponse
    }

    const response = await api.post<AuthResponse | LoginChallengeResponse>('/auth/login', payload)
    return response.data
  },
  async register(payload: {
    fullName: string
    email: string
    password: string
    phone?: string
    role: UserRole
  }) {
    if (useMocks) {
      await wait()
      return {
        ok: true,
        userId: crypto.randomUUID(),
        role: payload.role,
        message: 'Cuenta creada. Ahora inicia sesion.',
      } satisfies RegisterResponse
    }

    const response = await api.post<RegisterResponse>('/auth/register', payload)
    return response.data
  },
  async verifyLoginOtp(payload: { challengeId: string; code: string }) {
    if (useMocks) {
      await wait()
      return {
        token: 'mock-token',
        user: {
          id: crypto.randomUUID(),
          name: 'Ana Gutierrez',
          email: 'demo@redcuidados.com',
          role: 'client' as UserRole,
          title: 'Cliente',
          avatar: '',
        },
      } satisfies AuthResponse
    }

    const response = await api.post<AuthResponse>('/auth/login/verify', payload)
    return response.data
  },
  async resendLoginOtp(challengeId: string) {
    if (useMocks) {
      await wait()
      return {
        ok: true,
        challengeId: crypto.randomUUID(),
        emailMasked: 'demo@redcuidados.com',
        expiresInMinutes: 10,
      }
    }

    const response = await api.post<{ ok: boolean; challengeId: string; emailMasked: string; expiresInMinutes: number }>(
      '/auth/login/resend-otp',
      { challengeId },
    )
    return response.data
  },
  async forgotPassword(email: string, role?: UserRole) {
    if (useMocks) {
      await wait()
      return { message: 'Codigo enviado' }
    }

    const response = await api.post<{ message: string }>('/auth/forgot-password', { email, role })
    return response.data
  },
  async resetPassword(payload: { token: string; password: string }) {
    if (useMocks) {
      await wait()
      return { ok: true, message: 'Contrasena actualizada.' }
    }

    const response = await api.post<{ ok: boolean; message: string }>('/auth/reset-password', payload)
    return response.data
  },
  async getAuthConfig() {
    if (useMocks) {
      await wait()
      return { emailEnabled: true, appBaseUrl: 'http://localhost:5173' }
    }

    const response = await api.get<{ emailEnabled: boolean; appBaseUrl: string }>('/auth/config')
    return response.data
  },
  async getUserByEmail(email: string) {
    const encodedEmail = encodeURIComponent(email)
    return getResource(`/users/by-email/${encodedEmail}`, {
      id: crypto.randomUUID(),
      name: 'Demo User',
      email,
      role: 'client' as UserRole,
      title: 'Demo',
      avatar: '',
    })
  },
  async getAccountProfile(userId: string) {
    if (useMocks) {
      await wait()
      return {
        id: userId,
        fullName: 'Ana Gutierrez',
        email: 'ana@familia.com',
        phone: '+50688881111',
        role: 'client' as UserRole,
        avatar: '',
      } satisfies AccountProfile
    }

    const response = await api.get<AccountProfile>('/account/profile', { params: { userId } })
    return response.data
  },
  async updateAccountProfile(payload: { userId: string; fullName: string; phone: string }) {
    if (useMocks) {
      await wait()
      return { ok: true }
    }

    const response = await api.post<{ ok: boolean }>('/account/profile', payload)
    return response.data
  },
  async deleteAccount(userId: string) {
    if (useMocks) {
      await wait()
      return { ok: true, redirectTo: '/' }
    }

    const response = await api.delete<{ ok: boolean; redirectTo: string }>('/account', { data: { userId } })
    return response.data
  },
  async getCaregivers() {
    return getResource('/caregivers', caregivers)
  },
  async getCaregiverBySlug(slug: string) {
    const fallback = caregivers.find((caregiver) => caregiver.slug === slug) ?? caregivers[0]
    return getResource(`/caregivers/${slug}`, fallback)
  },
  async getBookings() {
    return getResource('/bookings', bookings)
  },
  async getBookingsByUser(userId: string, role: UserRole) {
    if (useMocks) {
      await wait()
      return bookings
    }

    const response = await api.get<Booking[]>('/bookings', { params: { userId, role } })
    return response.data
  },
  async createBooking(payload: {
    clientId: string
    caregiverId: string
    serviceType: string
    date: string
    startTime: string
    hours: number
    addressLine: string
    notes: string
  }) {
    if (useMocks) {
      await wait()
      return { id: crypto.randomUUID(), message: 'Reserva creada.', paymentReferenceCode: 'RDC-DEMO1234' }
    }

    const response = await api.post<{ id: string; message: string; paymentReferenceCode: string }>('/bookings', payload)
    return response.data
  },
  async getNotifications() {
    return getResource('/notifications', notifications)
  },
  async getNotificationsByUser(userId: string) {
    if (useMocks) {
      await wait()
      return notifications
    }

    const response = await api.get<NotificationItem[]>('/notifications', { params: { userId } })
    return response.data
  },
  async markNotificationsRead(userId: string) {
    if (useMocks) {
      await wait()
      return { ok: true }
    }

    const response = await api.post<{ ok: boolean }>('/notifications/mark-read', { userId })
    return response.data
  },
  async getThreads() {
    return getResource('/messages/threads', messageThreads)
  },
  async getThreadsByUser(userId: string) {
    if (useMocks) {
      await wait()
      return messageThreads
    }

    const response = await api.get<MessageThread[]>('/messages/threads', { params: { userId } })
    return response.data
  },
  async sendMessage(payload: { conversationId: string; senderId: string; content: string }) {
    if (useMocks) {
      await wait()
      return { id: crypto.randomUUID(), time: 'Ahora' }
    }

    const response = await api.post<{ id: string; time: string }>('/messages/send', payload)
    return response.data
  },
  async startConversation(payload: { requesterId: string; targetUserId: string; bookingId?: string; initialMessage?: string }) {
    if (useMocks) {
      await wait()
      return { conversationId: crypto.randomUUID() }
    }

    const response = await api.post<{ conversationId: string }>('/messages/start', payload)
    return response.data
  },
  async getPaymentProofsByClient(clientId: string) {
    if (useMocks) {
      await wait()
      return paymentProofs
    }

    const response = await api.get<PaymentProof[]>('/payment-proofs', { params: { clientId } })
    return response.data
  },
  async uploadPaymentProof(payload: {
    bookingId: string
    clientId: string
    amount: number
    referenceNumber: string
    receipt: File
  }) {
    if (useMocks) {
      await wait()
      return { ok: true, id: crypto.randomUUID() }
    }

    const formData = new FormData()
    formData.append('bookingId', payload.bookingId)
    formData.append('clientId', payload.clientId)
    formData.append('amount', String(payload.amount))
    formData.append('referenceNumber', payload.referenceNumber)
    formData.append('receipt', payload.receipt)

    const response = await api.post<{ ok: boolean; id: string; paymentReferenceCode: string; fileUrl: string }>('/payment-proofs', formData)
    return response.data
  },
  async getShiftLog(bookingId: string) {
    if (useMocks) {
      await wait()
      return null
    }

    const response = await api.get<ShiftLog | null>('/shift-log', { params: { bookingId } })
    return response.data
  },
  async markShiftCheckIn(bookingId: string, caregiverId: string) {
    if (useMocks) {
      await wait()
      return { bookingId, caregiverName: 'Demo', checkIn: '08:00', status: 'in-progress' as const }
    }

    const response = await api.post<ShiftLog>('/shift-log/check-in', { bookingId, caregiverId })
    return response.data
  },
  async markShiftCheckOut(bookingId: string, caregiverId: string) {
    if (useMocks) {
      await wait()
      return { bookingId, caregiverName: 'Demo', checkIn: '08:00', checkOut: '12:00', status: 'checked-out' as const }
    }

    const response = await api.post<ShiftLog>('/shift-log/check-out', { bookingId, caregiverId })
    return response.data
  },
  async getClientMetrics() {
    return getResource('/dashboard/client/metrics', clientMetrics)
  },
  async getCaregiverMetrics() {
    return getResource('/dashboard/caregiver/metrics', caregiverMetrics)
  },
  async getAdminMetrics() {
    return getResource('/dashboard/admin/metrics', adminMetrics)
  },
  async getAdminUsers() {
    return getResource('/admin/users', adminUsers)
  },
  async getApprovalDossiers() {
    return getResource('/admin/approval-dossiers', approvalDossiers)
  },
  async getPaymentProofs() {
    return getResource('/admin/payment-proofs', paymentProofs)
  },
  async getSocialPosts() {
    return getResource('/social/posts', socialPosts)
  },
  async getSupportTickets() {
    return getResource<SupportTicket[]>('/admin/support-tickets', supportTickets)
  },
  async createBackup() {
    if (useMocks) {
      await wait()
      return { ok: true }
    }

    const response = await api.post<{ ok: boolean }>('/admin/backups')
    return response.data
  },
  async getFraudAlerts() {
    return getResource<FraudAlert[]>('/admin/fraud-alerts', fraudAlerts)
  },
  async getAuditLogs() {
    return getResource<typeof auditLogs>('/admin/audit-logs', auditLogs)
  },
  async getContentItems() {
    return getResource<ContentItem[]>('/admin/content', contentItems)
  },
  async updateContentItem(contentId: string, payload: { title: string; section: string; status: string; body: string }) {
    if (useMocks) {
      await wait()
      return { ok: true }
    }

    const response = await api.post<{ ok: boolean }>(`/admin/content/${contentId}`, payload)
    return response.data
  },
  async getReports() {
    return getResource<Complaint[]>('/reports', complaints)
  },
  async createReport(payload: {
    reporterId: string
    bookingId?: string
    caregiverId?: string
    category: string
    urgency: string
    subject: string
    description: string
  }) {
    if (useMocks) {
      await wait()
      return { ok: true, id: crypto.randomUUID() }
    }

    const response = await api.post<{ ok: boolean; id: string }>('/reports', payload)
    return response.data
  },
  async updateReportStatus(reportId: string, status: string) {
    if (useMocks) {
      await wait()
      return { ok: true }
    }

    const response = await api.post<{ ok: boolean }>(`/reports/${reportId}/status`, { status })
    return response.data
  },
  async getSavedSearches(clientId: string) {
    if (useMocks) {
      await wait()
      return savedSearches
    }

    const response = await api.get<SavedSearch[]>('/saved-searches', { params: { clientId } })
    return response.data
  },
  async createSavedSearch(clientId: string, name: string, filters: Record<string, string | boolean>) {
    if (useMocks) {
      await wait()
      return { ok: true }
    }

    const response = await api.post<{ ok: boolean }>('/saved-searches', { clientId, name, filters })
    return response.data
  },
  async getFavorites(clientId: string) {
    if (useMocks) {
      await wait()
      return caregivers.slice(0, 3).map((caregiver) => caregiver.id)
    }

    const response = await api.get<string[]>('/favorites', { params: { clientId } })
    return response.data
  },
  async toggleFavorite(clientId: string, caregiverId: string) {
    if (useMocks) {
      await wait()
      return { favorite: true }
    }

    const response = await api.post<{ favorite: boolean }>('/favorites/toggle', { clientId, caregiverId })
    return response.data
  },
  async getHourlyServiceUpdates() {
    return getResource('/service-updates/hourly', hourlyServiceUpdates)
  },
  async getHourlyServiceUpdatesForBooking(bookingId: string) {
    if (useMocks) {
      await wait()
      return hourlyServiceUpdates
    }

    const response = await api.get<ServiceUpdate[]>('/service-updates/hourly', { params: { bookingId } })
    return response.data
  },
  async getBackupRecords() {
    return getResource('/admin/backups', backupRecords)
  },
  async decideApproval(dossierId: string, decision: 'approve' | 'reject' | 'suspend', payload?: { reason?: string }) {
    if (useMocks) {
      await wait()
      return { ok: true }
    }

    const response = await api.post<{ ok: boolean }>(`/admin/approval-dossiers/${dossierId}/decision`, {
      decision,
      reason: payload?.reason,
    })
    return response.data
  },
  async decidePaymentProof(proofId: string, decision: 'approve' | 'reject' | 'manual') {
    if (useMocks) {
      await wait()
      return { ok: true }
    }

    const response = await api.post<{ ok: boolean }>(`/admin/payment-proofs/${proofId}/decision`, { decision })
    return response.data
  },
  async getCaregiverReminders(caregiverId: string) {
    if (useMocks) {
      await wait()
      return caregiverUpcomingReminders
    }

    const response = await api.get('/caregiver/reminders', { params: { caregiverId } })
    return response.data as typeof caregiverUpcomingReminders
  },
  async getCaregiverCalendar(caregiverId: string) {
    if (useMocks) {
      await wait()
      return calendarDaysByCaregiver['cg-3'] ?? []
    }

    const response = await api.get<CalendarDayStatus[]>('/caregiver/calendar', { params: { caregiverId } })
    return response.data
  },
  async getCaregiverProfileById(caregiverId: string) {
    if (useMocks) {
      await wait()
      return caregivers.find((item) => item.id === caregiverId) ?? caregivers[0]
    }

    const response = await api.get(`/caregiver/profile/${caregiverId}`)
    return response.data
  },
  async getCaregiverWorkingHours(caregiverId: string) {
    if (useMocks) {
      await wait()
      return [
        { dayOfWeek: 1, active: true, startTime: '08:00', endTime: '20:00' },
        { dayOfWeek: 2, active: true, startTime: '08:00', endTime: '20:00' },
      ] satisfies CaregiverWorkingHour[]
    }

    const response = await api.get<CaregiverWorkingHour[]>('/caregiver/working-hours', { params: { caregiverId } })
    return response.data
  },
  async updateCaregiverWorkingHours(caregiverId: string, workingHours: CaregiverWorkingHour[]) {
    if (useMocks) {
      await wait()
      return { ok: true }
    }

    const response = await api.post<{ ok: boolean }>('/caregiver/working-hours', { caregiverId, workingHours })
    return response.data
  },
  async getCaregiverServiceZones(caregiverId: string) {
    if (useMocks) {
      await wait()
      return []
    }

    const response = await api.get<string[]>('/caregiver/service-zones', { params: { caregiverId } })
    return response.data
  },
  async updateCaregiverServiceZones(caregiverId: string, zoneIds: string[]) {
    if (useMocks) {
      await wait()
      return { ok: true }
    }

    const response = await api.post<{ ok: boolean }>('/caregiver/service-zones', { caregiverId, zoneIds })
    return response.data
  },
  async updateCaregiverProfile(
    caregiverId: string,
    payload: { pricePerHour: number; nightShiftFee: number; weekendFee: number; emergencyFee: number; about: string },
  ) {
    if (useMocks) {
      await wait()
      return { ok: true }
    }

    const response = await api.post<{ ok: boolean }>(`/caregiver/profile/${caregiverId}`, payload)
    return response.data
  },
  async decideBooking(bookingId: string, caregiverId: string, decision: 'accept' | 'reject') {
    if (useMocks) {
      await wait()
      return { ok: true }
    }

    const response = await api.post<{ ok: boolean }>(`/bookings/${bookingId}/decision`, { caregiverId, decision })
    return response.data
  },
  async getVerificationSteps() {
    return getResource('/caregiver/verification-steps', verificationSteps)
  },
  async getVerificationStepsByCaregiver(caregiverId: string) {
    if (useMocks) {
      await wait()
      return verificationSteps
    }

    const response = await api.get<VerificationStep[]>('/caregiver/verification-steps', { params: { caregiverId } })
    return response.data
  },
  async getCaregiverApplicationStatus(caregiverId: string) {
    if (useMocks) {
      await wait()
      return {
        status: 'draft',
        canOfferServices: false,
        hasRequiredDocuments: false,
        missingDocuments: ['Frente de cedula', 'Reverso de cedula', 'Curriculum', 'Hoja de vida'],
        adminAlerts: [],
        aiSummary: 'Aun no has enviado el expediente.',
        documents: [],
      } satisfies CaregiverApplicationStatus
    }

    const response = await api.get<CaregiverApplicationStatus>('/caregiver/application-status', { params: { caregiverId } })
    return response.data
  },
  async uploadCaregiverDocument(payload: {
    caregiverId: string
    documentType: CaregiverApplicationDocument['documentType']
    file: File
  }) {
    if (useMocks) {
      await wait()
      return { ok: true, documentId: crypto.randomUUID() }
    }

    const formData = new FormData()
    formData.append('caregiverId', payload.caregiverId)
    formData.append('documentType', payload.documentType)
    formData.append('file', payload.file)

    const response = await api.post<{ ok: boolean; documentId: string }>('/caregiver/documents', formData)
    return response.data
  },
  async submitCaregiverVerification(payload: { caregiverId: string; idNumber: string }) {
    if (useMocks) {
      await wait()
      return { ok: true }
    }

    const response = await api.post<{ ok: boolean }>('/caregiver/verification', payload)
    return response.data
  },
  async submitCaregiverApplication(payload: { caregiverId: string; idNumber: string }) {
    if (useMocks) {
      await wait()
      return { ok: true, missingDocuments: [] }
    }

    const response = await api.post<{ ok: boolean; missingDocuments: string[] }>('/caregiver/apply', payload)
    return response.data
  },
  async cancelCaregiverApplication(caregiverId: string) {
    if (useMocks) {
      await wait()
      return { ok: true }
    }

    const response = await api.post<{ ok: boolean }>('/caregiver/application/cancel', { caregiverId })
    return response.data
  },
  async requestCaregiverServiceRemoval(caregiverId: string) {
    if (useMocks) {
      await wait()
      return { ok: true }
    }

    const response = await api.post<{ ok: boolean }>('/caregiver/service-removal-request', { caregiverId })
    return response.data
  },
  async getReviews() {
    return getResource('/reviews', reviews)
  },
  async createReview(payload: {
    bookingId: string
    clientId: string
    caregiverId: string
    rating: number
    comment: string
  }) {
    if (useMocks) {
      await wait()
      return { ok: true }
    }

    const response = await api.post<{ ok: boolean }>('/reviews', payload)
    return response.data
  },
  async getEarningsSeries() {
    return getResource('/analytics/earnings', earningsSeries)
  },
  async getCaregiverEarnings(caregiverId: string) {
    if (useMocks) {
      await wait()
      return {
        totalReceived: 520,
        totalProofs: 4,
        todayReceived: 108,
        daily: [
          { label: '2026-05-10', amount: 148 },
          { label: '2026-05-11', amount: 264 },
          { label: '2026-05-12', amount: 108 },
        ],
        payments: [],
      } satisfies CaregiverEarningsSummary
    }

    const response = await api.get<CaregiverEarningsSummary>('/caregiver/earnings', { params: { caregiverId } })
    return response.data
  },
  async getPlatformSeries() {
    return getResource('/analytics/platform', platformSeries)
  },
  async getPaymentHistory(clientId: string) {
    if (useMocks) {
      await wait()
      return paymentHistory
    }

    const response = await api.get<PaymentHistoryItem[]>('/payment-history', { params: { clientId } })
    return response.data
  },
  async getZones() {
    return getResource<Zone[]>('/zones', zones)
  },
  async getPlatformSettings() {
    if (useMocks) {
      await wait()
      return {
        verificationSlaHours: 6,
        supportPremiumEnabled: true,
        paymentAiEnabled: true,
        pushNotificationsEnabled: true,
      } satisfies PlatformSettings
    }

    const response = await api.get<PlatformSettings>('/admin/platform-settings')
    return response.data
  },
  async updatePlatformSettings(payload: PlatformSettings & { updatedBy?: string }) {
    if (useMocks) {
      await wait()
      return { ok: true }
    }

    const response = await api.post<{ ok: boolean }>('/admin/platform-settings', payload)
    return response.data
  },
}
