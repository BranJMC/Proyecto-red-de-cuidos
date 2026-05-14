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

export interface AccountProfile {
  id: string
  fullName: string
  email: string
  phone: string
  role: UserRole
  avatar: string
}

export interface Zone {
  id: string
  province: string
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
  province: string
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
  serviceCount: number
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  image: string
}

export interface Booking {
  id: string
  caregiverId: string
  caregiverName: string
  clientName: string
  conversationId?: string
  service: string
  zone: string
  addressLine?: string
  date: string
  startTime: string
  endTime?: string
  duration: string
  hours: number
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  amount: number
  notes?: string
  paymentReferenceCode?: string
  shiftStatus?: 'pending-start' | 'in-progress' | 'checked-out'
  checkIn?: string
  checkOut?: string
  serviceState?: 'upcoming' | 'in-progress' | 'completed' | 'missed'
  serviceStateLabel?: string
  paymentDeadlineAt?: string
  paymentProofStatus?: 'Pending Review' | 'Approved' | 'Rejected'
  paymentProofFileUrl?: string
  paymentProofFileName?: string
  paymentProofUploadedAt?: string
}

export interface CaregiverEarningsSummary {
  totalReceived: number
  totalProofs: number
  todayReceived: number
  daily: Array<{
    label: string
    amount: number
  }>
  payments: Array<{
    id: string
    proofId?: string
    bookingId?: string
    date: string
    clientName: string
    amount: number
    method: string
    referenceNumber?: string
    expectedReferenceCode?: string
    status?: 'Pending Review' | 'Approved' | 'Rejected'
    aiDecision?: 'approved' | 'manual-review' | 'rejected'
    reviewedBy?: string
    fileUrl?: string
    fileName?: string
  }>
}

export interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  date?: string
  read: boolean
  type: 'booking' | 'chat' | 'verification' | 'payment' | 'system' | 'alert'
}

export interface MessageThread {
  id: string
  bookingId?: string
  participantId?: string
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

export interface ServiceUpdate {
  id: string
  hourLabel: string
  author: string
  summary: string
  evidenceLabel: string
  status: 'on-track' | 'attention' | 'completed'
}

export interface ShiftLog {
  bookingId: string
  caregiverName: string
  checkIn: string
  checkOut?: string
  status: 'pending-start' | 'in-progress' | 'checked-out'
}

export interface PlatformSettings {
  verificationSlaHours: number
  supportPremiumEnabled: boolean
  paymentAiEnabled: boolean
  pushNotificationsEnabled: boolean
}

export interface CaregiverWorkingHour {
  id?: string
  dayOfWeek: number
  active: boolean
  startTime: string
  endTime: string
}

export interface CaregiverApplicationDocument {
  id: string
  fileId?: string
  documentType: 'national_id_front' | 'national_id_back' | 'face_photo' | 'curriculum' | 'hoja_de_vida' | 'certification'
  label: string
  status: 'pending' | 'approved' | 'rejected'
  fileName: string
  fileUrl?: string
  uploadedAt?: string
  aiSummary?: string
}

export interface CaregiverApplicationStatus {
  verificationId?: string
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  canOfferServices: boolean
  hasRequiredDocuments: boolean
  missingDocuments: string[]
  submittedAt?: string
  reviewedAt?: string
  adminAlerts: string[]
  aiSummary: string
  rejectionReason?: string
  previousRejectionReason?: string
  facePhotoUrl?: string
  documents: CaregiverApplicationDocument[]
}

export interface DashboardMetric {
  label: string
  value: string
  change: string
  accent: AccentTone
}

export interface CaregiverReminder {
  id: string
  conversationId?: string
  date: string
  dateRaw?: string
  time: string
  service: string
  client: string
  status?: Booking['serviceState']
  statusLabel?: string
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
  caregiverName?: string
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
  method?: string
  referenceNumber?: string
  expectedAmount?: number
  expectedReferenceCode?: string
  aiDecision: 'approved' | 'manual-review' | 'rejected'
  aiConfidence: number
  anomaly: string
  reviewedBy: string
  fileUrl?: string
  fileName?: string
}

export interface Complaint {
  id: string
  subject: string
  type: string
  category: string
  urgency: 'urgent' | 'notice' | 'other'
  priority: 'high' | 'medium' | 'low'
  status: 'open' | 'investigating' | 'resolved'
  description?: string
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
  body?: string
}

export interface AuditLog {
  id: string
  actor: string
  action: string
  target: string
  timestamp: string
}

export interface ApprovalDossier {
  id: string
  caregiverId: string
  caregiverName: string
  caregiverAvatar?: string
  status: 'pending' | 'approved' | 'rejected'
  canWork?: boolean
  roleFit: string
  aiDecision: 'recommended' | 'manual-review' | 'reject'
  aiConfidence: number
  aiSummary: string
  flags: string[]
  stepStatuses: VerificationStep[]
  documents: string[]
  rejectionReason?: string
  previousRejectionReason?: string
  submittedAt?: string
  reviewedAt?: string
  profileSummary?: {
    headline?: string
    bio?: string
    languages?: string[]
    yearsExperience?: number
    pricePerHour?: number
    serviceZones?: string[]
    serviceTypes?: string[]
  }
  documentItems?: CaregiverApplicationDocument[]
}

export interface SocialPost {
  id: string
  author: string
  authorRole: UserRole | 'platform'
  avatar: string
  time: string
  content: string
  image?: string
  likes: number
  comments: number
  visibility: 'public' | 'community'
}

export interface BackupRecord {
  id: string
  generatedAt: string
  scope: string
  status: 'ready' | 'in-progress' | 'failed'
  size: string
}

export interface CalendarDayStatus {
  date: string
  day: number
  state: 'booked' | 'available' | 'off' | 'pending' | 'mixed' | 'full'
  serviceType?: string
  timeRange?: string
  reservationCount?: number
  pendingCount?: number
  confirmedCount?: number
  totalReservedHours?: number
  workingHoursCapacity?: number
  hasCapacity?: boolean
  summary?: string
  alert?: string
  reservations?: Array<{
    id: string
    clientName: string
    serviceType: string
    startTime: string
    endTime: string
    hours: number
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  }>
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
