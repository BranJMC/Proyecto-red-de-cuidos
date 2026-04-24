import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { PublicLayout } from '../layouts/PublicLayout'
import { ProtectedRoute } from '../routes/ProtectedRoute'
import { AboutPage } from '../pages/public/AboutPage'
import { ContactPage } from '../pages/public/ContactPage'
import { FaqPage } from '../pages/public/FaqPage'
import { HowItWorksPage } from '../pages/public/HowItWorksPage'
import { LandingPage } from '../pages/public/LandingPage'
import { PricingPage } from '../pages/public/PricingPage'
import { HelpCenterPage } from '../pages/public/HelpCenterPage'
import { SupportPage } from '../pages/public/SupportPage'
import { TermsPage } from '../pages/public/TermsPage'
import { PrivacyPage } from '../pages/public/PrivacyPage'
import { CareersPage } from '../pages/public/CareersPage'
import { BlogPage } from '../pages/public/BlogPage'
import { TestimonialsPage } from '../pages/public/TestimonialsPage'
import { TrustSafetyPage } from '../pages/public/TrustSafetyPage'
import { DemoPage } from '../pages/public/DemoPage'
import { CommunityPage } from '../pages/public/CommunityPage'
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage'
import { RoleAccessPage } from '../pages/auth/RoleAccessPage'
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage'
import { EmailVerificationPage } from '../pages/auth/EmailVerificationPage'
import { SmsVerificationPage } from '../pages/auth/SmsVerificationPage'
import { BookingPage } from '../pages/shared/BookingPage'
import { ClientHomePage } from '../pages/client/ClientHomePage'
import { SearchCaregiversPage } from '../pages/client/SearchCaregiversPage'
import { FavoritesPage } from '../pages/client/FavoritesPage'
import { ClientMessagesPage } from '../pages/client/ClientMessagesPage'
import { ClientNotificationsPage } from '../pages/client/ClientNotificationsPage'
import { ClientBookingsPage } from '../pages/client/ClientBookingsPage'
import { ClientPaymentsPage } from '../pages/client/ClientPaymentsPage'
import { ClientSettingsPage } from '../pages/client/ClientSettingsPage'
import { UpcomingServicesPage } from '../pages/client/UpcomingServicesPage'
import { SavedSearchesPage } from '../pages/client/SavedSearchesPage'
import { ClientReviewsPage } from '../pages/client/ClientReviewsPage'
import { ClientReportsPage } from '../pages/client/ClientReportsPage'
import { CaregiverHomePage } from '../pages/caregiver/CaregiverHomePage'
import { JobRequestsPage } from '../pages/caregiver/JobRequestsPage'
import { CalendarPage } from '../pages/caregiver/CalendarPage'
import { CaregiverMessagesPage } from '../pages/caregiver/CaregiverMessagesPage'
import { EarningsPage } from '../pages/caregiver/EarningsPage'
import { ReviewsPage } from '../pages/caregiver/ReviewsPage'
import { DocumentsPage } from '../pages/caregiver/DocumentsPage'
import { CaregiverSettingsPage } from '../pages/caregiver/CaregiverSettingsPage'
import { AcceptedJobsPage } from '../pages/caregiver/AcceptedJobsPage'
import { CaregiverNotificationsPage } from '../pages/caregiver/CaregiverNotificationsPage'
import { AdminOverviewPage } from '../pages/admin/AdminOverviewPage'
import { UsersManagementPage } from '../pages/admin/UsersManagementPage'
import { CaregiverApprovalsPage } from '../pages/admin/CaregiverApprovalsPage'
import { ReportsCenterPage } from '../pages/admin/ReportsCenterPage'
import { AdminNotificationsPage } from '../pages/admin/AdminNotificationsPage'
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage'
import { PaymentProofsPage } from '../pages/admin/PaymentProofsPage'
import { SupportTicketsPage } from '../pages/admin/SupportTicketsPage'
import { FraudAlertsPage } from '../pages/admin/FraudAlertsPage'
import { AnalyticsPage } from '../pages/admin/AnalyticsPage'
import { ContentManagementPage } from '../pages/admin/ContentManagementPage'
import { AuditLogsPage } from '../pages/admin/AuditLogsPage'
import { CaregiverProfilePage } from '../pages/shared/CaregiverProfilePage'
import { NotFoundPage } from '../pages/shared/NotFoundPage'
import { OfflinePage } from '../pages/shared/OfflinePage'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/how-it-works', element: <HowItWorksPage /> },
      { path: '/pricing', element: <PricingPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/faq', element: <FaqPage /> },
      { path: '/demo', element: <DemoPage /> },
      { path: '/search', element: <SearchCaregiversPage /> },
      { path: '/community', element: <CommunityPage /> },
      { path: '/booking', element: <BookingPage /> },
      { path: '/help', element: <HelpCenterPage /> },
      { path: '/support', element: <SupportPage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/careers', element: <CareersPage /> },
      { path: '/blog', element: <BlogPage /> },
      { path: '/testimonials', element: <TestimonialsPage /> },
      { path: '/trust-safety', element: <TrustSafetyPage /> },
      { path: '/caregivers/:slug', element: <CaregiverProfilePage /> },
      { path: '/offline', element: <OfflinePage /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'access/:role', element: <RoleAccessPage /> },
      { path: 'login', element: <Navigate to="/" replace /> },
      { path: 'register', element: <Navigate to="/" replace /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'verify-email', element: <EmailVerificationPage /> },
      { path: 'verify-phone', element: <SmsVerificationPage /> },
    ],
  },
  {
    path: '/client',
    element: (
      <ProtectedRoute allowedRoles={['client']}>
        <DashboardLayout role="client" />
      </ProtectedRoute>
    ),
    children: [
      { path: 'home', element: <ClientHomePage /> },
      { path: 'booking', element: <BookingPage /> },
      { path: 'search', element: <SearchCaregiversPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'upcoming', element: <UpcomingServicesPage /> },
      { path: 'saved-searches', element: <SavedSearchesPage /> },
      { path: 'messages', element: <ClientMessagesPage /> },
      { path: 'notifications', element: <ClientNotificationsPage /> },
      { path: 'bookings', element: <ClientBookingsPage /> },
      { path: 'payments', element: <ClientPaymentsPage /> },
      { path: 'reviews', element: <ClientReviewsPage /> },
      { path: 'reports', element: <ClientReportsPage /> },
      { path: 'settings', element: <ClientSettingsPage /> },
    ],
  },
  {
    path: '/caregiver',
    element: (
      <ProtectedRoute allowedRoles={['caregiver']}>
        <DashboardLayout role="caregiver" />
      </ProtectedRoute>
    ),
    children: [
      { path: 'home', element: <CaregiverHomePage /> },
      { path: 'jobs', element: <JobRequestsPage /> },
      { path: 'accepted-jobs', element: <AcceptedJobsPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'messages', element: <CaregiverMessagesPage /> },
      { path: 'notifications', element: <CaregiverNotificationsPage /> },
      { path: 'earnings', element: <EarningsPage /> },
      { path: 'reviews', element: <ReviewsPage /> },
      { path: 'documents', element: <DocumentsPage /> },
      { path: 'settings', element: <CaregiverSettingsPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <DashboardLayout role="admin" />
      </ProtectedRoute>
    ),
    children: [
      { path: 'overview', element: <AdminOverviewPage /> },
      { path: 'users', element: <UsersManagementPage /> },
      { path: 'approvals', element: <CaregiverApprovalsPage /> },
      { path: 'payment-proofs', element: <PaymentProofsPage /> },
      { path: 'reports', element: <ReportsCenterPage /> },
      { path: 'support', element: <SupportTicketsPage /> },
      { path: 'fraud-alerts', element: <FraudAlertsPage /> },
      { path: 'notifications', element: <AdminNotificationsPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'content', element: <ContentManagementPage /> },
      { path: 'audit-logs', element: <AuditLogsPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
