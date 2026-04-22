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
  baseURL: import.meta.env.VITE_API_URL ?? 'https://api.redcuidados.local',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  config.headers['x-app-source'] = 'red-de-cuidados-web'
  return config
})

const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockApi = {
  async getCaregivers() {
    await wait()
    return caregivers
  },
  async getCaregiverBySlug(slug: string) {
    await wait()
    return caregivers.find((caregiver) => caregiver.slug === slug) ?? caregivers[0]
  },
  async getBookings() {
    await wait()
    return bookings
  },
  async getNotifications() {
    await wait()
    return notifications
  },
  async getThreads() {
    await wait()
    return messageThreads
  },
  async getClientMetrics() {
    await wait()
    return clientMetrics
  },
  async getCaregiverMetrics() {
    await wait()
    return caregiverMetrics
  },
  async getAdminMetrics() {
    await wait()
    return adminMetrics
  },
  async getAdminUsers() {
    await wait()
    return adminUsers
  },
  async getApprovalDossiers() {
    await wait()
    return approvalDossiers
  },
  async getPaymentProofs() {
    await wait()
    return paymentProofs
  },
  async getSocialPosts() {
    await wait()
    return socialPosts
  },
  async getHourlyServiceUpdates() {
    await wait()
    return hourlyServiceUpdates
  },
  async getBackupRecords() {
    await wait()
    return backupRecords
  },
  async getVerificationSteps() {
    await wait()
    return verificationSteps
  },
  async getReviews() {
    await wait()
    return reviews
  },
  async getEarningsSeries() {
    await wait()
    return earningsSeries
  },
  async getPlatformSeries() {
    await wait()
    return platformSeries
  },
}
