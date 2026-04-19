export type UserRole = 'client' | 'caregiver' | 'admin'

export type AccentTone = 'emerald' | 'sky' | 'amber' | 'rose'

export interface NavItem {
  label: string
  href: string
  icon?: string
  badge?: string
}

export interface DemoUser {
  name: string
  email: string
  role: UserRole
  title: string
  avatar: string
}

export interface Zone {
  id: string
  city: string
  neighborhood: string
  demandLevel: 'high' | 'medium' | 'emerging'
  activeCaregivers: number
}

export interface Caregiver {
  id: string
  slug: string
  name: string
  specialty: string
  city: string
  neighborhood: string
  zones: string[]
  languages: string[]
  pricePerHour: number
  nightShiftFee: number
  weekendFee: number
  emergencyFee: number
  rating: number
  reviews: number
  verified: boolean
  urgentAvailability: boolean
  availableNow: boolean
  availableToday: boolean
  nightShiftAvailable: boolean
  weekendAvailable: boolean
  emergencyService: boolean
  experienceYears: number
  serviceTypes: string[]
  about: string
  certifications: string[]
  availability: string[]
  workingDays: string[]
  workingHours: string[]
  image: string
}

export interface Booking {
  id: string
  caregiverId: string
  caregiverName: string
  clientName: string
  service: string
  zone: string
  date: string
  startTime: string
  duration: string
  hours: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  amount: number
}

export interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: 'booking' | 'chat' | 'verification' | 'payment' | 'system' | 'alert'
}

export interface MessageThread {
  id: string
  participant: string
  role: UserRole
  status: 'online' | 'offline'
  unread: number
  lastMessage: string
  lastMessageAt: string
  messages: ChatMessage[]
}

export interface ChatMessage {
  id: string
  author: 'me' | 'other'
  content: string
  time: string
  attachment?: string
}

export interface DashboardMetric {
  label: string
  value: string
  change: string
  accent: AccentTone
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: 'active' | 'pending' | 'suspended'
  joinedAt: string
  city: string
}

export interface VerificationStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface PricingPlan {
  name: string
  price: string
  description: string
  features: string[]
  highlighted?: boolean
}

export interface Review {
  id: string
  author: string
  rating: number
  date: string
  comment: string
}

export interface SavedSearch {
  id: string
  title: string
  filters: string[]
  matches: number
}

export interface PaymentHistoryItem {
  id: string
  date: string
  caregiverName: string
  amount: number
  method: string
  status: 'paid' | 'pending-review' | 'rejected'
}

export interface PaymentProof {
  id: string
  bookingId: string
  payer: string
  uploadedAt: string
  status: 'Pending Review' | 'Approved' | 'Rejected'
  amount: number
}

export interface Complaint {
  id: string
  subject: string
  type: string
  priority: 'high' | 'medium' | 'low'
  status: 'open' | 'investigating' | 'resolved'
}

export interface SupportTicket {
  id: string
  requester: string
  topic: string
  channel: string
  sla: string
  status: 'new' | 'in-progress' | 'waiting' | 'closed'
}

export interface FraudAlert {
  id: string
  label: string
  risk: 'critical' | 'high' | 'medium'
  location: string
  detail: string
}

export interface ContentItem {
  id: string
  title: string
  section: string
  status: 'draft' | 'scheduled' | 'published'
}

export interface AuditLog {
  id: string
  actor: string
  action: string
  target: string
  timestamp: string
}

export interface BookingEstimate {
  serviceType: string
  date: string
  startTime: string
  hours: number
  zone: string
  hourlyRate: number
  nightExtra: number
  weekendExtra: number
  emergencyExtra: number
  platformFee: number
  discount: number
  total: number
}
