import axios from 'axios'
import {
  adminMetrics,
  adminUsers,
  bookings,
  caregivers,
  caregiverMetrics,
  clientMetrics,
  earningsSeries,
  messageThreads,
  notifications,
  platformSeries,
  reviews,
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
