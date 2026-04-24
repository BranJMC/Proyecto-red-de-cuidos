import axios from 'axios'
import {
  adminMetrics,
  adminUsers,
  approvalDossiers,
  backupRecords,
  bookings,
  caregivers,
  caregiverMetrics,
  clientMetrics,
  earningsSeries,
  hourlyServiceUpdates,
  messageThreads,
  notifications,
  paymentProofs,
  platformSeries,
  reviews,
  socialPosts,
  verificationSteps,
} from './mockData'

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

export const mockApi = {
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
  async getNotifications() {
    return getResource('/notifications', notifications)
  },
  async getThreads() {
    return getResource('/messages/threads', messageThreads)
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
  async getHourlyServiceUpdates() {
    return getResource('/service-updates/hourly', hourlyServiceUpdates)
  },
  async getBackupRecords() {
    return getResource('/admin/backups', backupRecords)
  },
  async getVerificationSteps() {
    return getResource('/caregiver/verification-steps', verificationSteps)
  },
  async getReviews() {
    return getResource('/reviews', reviews)
  },
  async getEarningsSeries() {
    return getResource('/analytics/earnings', earningsSeries)
  },
  async getPlatformSeries() {
    return getResource('/analytics/platform', platformSeries)
  },
}
