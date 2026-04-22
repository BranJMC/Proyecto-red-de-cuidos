-- Red de Cuidados - PostgreSQL + PostGIS schema
-- Base gratuita recomendada: PostgreSQL local o proveedor PostgreSQL con plan gratuito.
-- Ejecutar en una base vacia. Requiere PostGIS instalado si usaras mapas/zonas.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TYPE user_role AS ENUM ('client', 'caregiver', 'admin');
CREATE TYPE account_status AS ENUM ('pending_email', 'active', 'suspended', 'deleted');
CREATE TYPE verification_status AS ENUM ('not_started', 'pending', 'approved', 'rejected', 'manual_review');
CREATE TYPE document_type AS ENUM ('national_id_front', 'national_id_back', 'face_photo', 'curriculum', 'hoja_de_vida', 'certification', 'payment_receipt', 'service_evidence', 'report_attachment', 'chat_attachment', 'profile_photo');
CREATE TYPE booking_status AS ENUM ('draft', 'pending_payment', 'payment_review', 'requested', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected');
CREATE TYPE payment_status AS ENUM ('pending_review', 'approved', 'rejected', 'refunded');
CREATE TYPE ai_decision AS ENUM ('approved', 'manual_review', 'rejected');
CREATE TYPE report_urgency AS ENUM ('urgent', 'notice', 'other');
CREATE TYPE notification_type AS ENUM ('booking', 'chat', 'verification', 'payment', 'system', 'alert', 'report');
CREATE TYPE job_status AS ENUM ('queued', 'processing', 'completed', 'failed');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role user_role NOT NULL,
  status account_status NOT NULL DEFAULT 'pending_email',
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  email_verified_at timestamptz,
  phone_verified_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE client_profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  family_name text,
  emergency_contact_name text,
  emergency_contact_phone text,
  preferred_language text DEFAULT 'es',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE caregiver_profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  public_slug text NOT NULL UNIQUE,
  headline text NOT NULL,
  bio text,
  years_experience int NOT NULL DEFAULT 0 CHECK (years_experience >= 0),
  base_hourly_rate numeric(10,2) NOT NULL DEFAULT 0 CHECK (base_hourly_rate >= 0),
  night_shift_fee numeric(10,2) NOT NULL DEFAULT 0 CHECK (night_shift_fee >= 0),
  weekend_fee numeric(10,2) NOT NULL DEFAULT 0 CHECK (weekend_fee >= 0),
  emergency_fee numeric(10,2) NOT NULL DEFAULT 0 CHECK (emergency_fee >= 0),
  languages text[] NOT NULL DEFAULT ARRAY['Espanol'],
  service_count int NOT NULL DEFAULT 0 CHECK (service_count >= 0),
  rank text NOT NULL DEFAULT 'Bronze',
  rating_average numeric(3,2) NOT NULL DEFAULT 0,
  rating_count int NOT NULL DEFAULT 0,
  verified_status verification_status NOT NULL DEFAULT 'not_started',
  can_work boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE admin_profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  department text,
  permissions jsonb NOT NULL DEFAULT '{}'::jsonb,
  require_email_otp boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE email_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  verified_at timestamptz,
  attempts int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE login_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash text NOT NULL,
  role user_role NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  attempts int NOT NULL DEFAULT 0,
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash text NOT NULL,
  ip_address inet,
  user_agent text,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE provinces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);

CREATE TABLE cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  province_id uuid NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
  name text NOT NULL,
  UNIQUE (province_id, name)
);

CREATE TABLE neighborhoods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  name text NOT NULL,
  center geography(Point, 4326),
  UNIQUE (city_id, name)
);

CREATE TABLE service_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  province_id uuid REFERENCES provinces(id) ON DELETE SET NULL,
  city_id uuid REFERENCES cities(id) ON DELETE SET NULL,
  neighborhood_id uuid REFERENCES neighborhoods(id) ON DELETE SET NULL,
  name text NOT NULL,
  boundary geography(Polygon, 4326),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE caregiver_service_zones (
  caregiver_id uuid NOT NULL REFERENCES caregiver_profiles(user_id) ON DELETE CASCADE,
  service_zone_id uuid NOT NULL REFERENCES service_zones(id) ON DELETE CASCADE,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (caregiver_id, service_zone_id)
);

CREATE TABLE caregiver_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id uuid NOT NULL REFERENCES caregiver_profiles(user_id) ON DELETE CASCADE,
  service_type text NOT NULL,
  description text,
  active boolean NOT NULL DEFAULT true,
  UNIQUE (caregiver_id, service_type)
);

CREATE TABLE caregiver_working_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id uuid NOT NULL REFERENCES caregiver_profiles(user_id) ON DELETE CASCADE,
  day_of_week int NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  active boolean NOT NULL DEFAULT true,
  CHECK (start_time < end_time)
);

CREATE TABLE caregiver_calendar_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id uuid NOT NULL REFERENCES caregiver_profiles(user_id) ON DELETE CASCADE,
  block_date date NOT NULL,
  start_time time,
  end_time time,
  status text NOT NULL CHECK (status IN ('available', 'booked', 'off')),
  service_type text,
  booking_id uuid,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE caregiver_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id uuid NOT NULL UNIQUE REFERENCES caregiver_profiles(user_id) ON DELETE CASCADE,
  status verification_status NOT NULL DEFAULT 'pending',
  national_id_number text,
  email_otp_verified boolean NOT NULL DEFAULT false,
  sms_otp_verified boolean NOT NULL DEFAULT false,
  face_photo_verified boolean NOT NULL DEFAULT false,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  document_type document_type NOT NULL,
  storage_key text NOT NULL,
  public_url text,
  original_filename text,
  mime_type text,
  file_size_bytes bigint,
  sha256_hash text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE verification_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id uuid NOT NULL REFERENCES caregiver_verifications(id) ON DELETE CASCADE,
  file_id uuid NOT NULL REFERENCES files(id) ON DELETE RESTRICT,
  document_type document_type NOT NULL,
  status verification_status NOT NULL DEFAULT 'pending',
  ai_summary text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ai_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  provider text,
  decision ai_decision NOT NULL,
  confidence numeric(5,4) CHECK (confidence >= 0 AND confidence <= 1),
  summary text,
  flags text[] NOT NULL DEFAULT ARRAY[]::text[],
  raw_result jsonb NOT NULL DEFAULT '{}'::jsonb,
  reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE booking_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  address_line text,
  province_id uuid REFERENCES provinces(id) ON DELETE SET NULL,
  city_id uuid REFERENCES cities(id) ON DELETE SET NULL,
  neighborhood_id uuid REFERENCES neighborhoods(id) ON DELETE SET NULL,
  point geography(Point, 4326),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES client_profiles(user_id) ON DELETE RESTRICT,
  caregiver_id uuid NOT NULL REFERENCES caregiver_profiles(user_id) ON DELETE RESTRICT,
  service_type text NOT NULL,
  status booking_status NOT NULL DEFAULT 'draft',
  scheduled_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  total_hours numeric(5,2) NOT NULL CHECK (total_hours > 0),
  location_id uuid REFERENCES booking_locations(id) ON DELETE SET NULL,
  hourly_rate numeric(10,2) NOT NULL,
  night_fee numeric(10,2) NOT NULL DEFAULT 0,
  weekend_fee numeric(10,2) NOT NULL DEFAULT 0,
  emergency_fee numeric(10,2) NOT NULL DEFAULT 0,
  platform_fee numeric(10,2) NOT NULL DEFAULT 0,
  discount numeric(10,2) NOT NULL DEFAULT 0,
  total_amount numeric(10,2) NOT NULL,
  coupon_code text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (start_time < end_time)
);

ALTER TABLE caregiver_calendar_blocks
  ADD CONSTRAINT caregiver_calendar_blocks_booking_fk
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL;

CREATE TABLE booking_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  old_status booking_status,
  new_status booking_status NOT NULL,
  changed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE booking_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  caregiver_id uuid NOT NULL REFERENCES caregiver_profiles(user_id) ON DELETE RESTRICT,
  check_in_at timestamptz,
  check_out_at timestamptz,
  check_in_location geography(Point, 4326),
  check_out_location geography(Point, 4326),
  status text NOT NULL DEFAULT 'pending-start' CHECK (status IN ('pending-start', 'in-progress', 'checked-out')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE hourly_service_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  caregiver_id uuid NOT NULL REFERENCES caregiver_profiles(user_id) ON DELETE RESTRICT,
  hour_number int NOT NULL CHECK (hour_number > 0),
  summary text NOT NULL,
  status text NOT NULL DEFAULT 'on-track' CHECK (status IN ('on-track', 'attention', 'completed')),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (booking_id, hour_number)
);

CREATE TABLE booking_evidence_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_update_id uuid NOT NULL REFERENCES hourly_service_updates(id) ON DELETE CASCADE,
  file_id uuid NOT NULL REFERENCES files(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE conversation_participants (
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_read_at timestamptz,
  muted boolean NOT NULL DEFAULT false,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  body text,
  sent_at timestamptz NOT NULL DEFAULT now(),
  edited_at timestamptz,
  deleted_at timestamptz
);

CREATE TABLE message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  file_id uuid NOT NULL REFERENCES files(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notification_preferences (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email_enabled boolean NOT NULL DEFAULT true,
  push_enabled boolean NOT NULL DEFAULT true,
  sms_enabled boolean NOT NULL DEFAULT false,
  booking_updates boolean NOT NULL DEFAULT true,
  chat_messages boolean NOT NULL DEFAULT true,
  payment_updates boolean NOT NULL DEFAULT true,
  verification_updates boolean NOT NULL DEFAULT true
);

CREATE TABLE payment_proofs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client_profiles(user_id) ON DELETE RESTRICT,
  status payment_status NOT NULL DEFAULT 'pending_review',
  amount numeric(10,2) NOT NULL,
  method text NOT NULL DEFAULT 'comprobante',
  reference_number text,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  rejection_reason text
);

CREATE TABLE payment_proof_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_proof_id uuid NOT NULL REFERENCES payment_proofs(id) ON DELETE CASCADE,
  file_id uuid NOT NULL REFERENCES files(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE payment_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_proof_id uuid NOT NULL REFERENCES payment_proofs(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES users(id) ON DELETE SET NULL,
  ai_review_id uuid REFERENCES ai_reviews(id) ON DELETE SET NULL,
  decision payment_status NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES client_profiles(user_id) ON DELETE RESTRICT,
  caregiver_id uuid NOT NULL REFERENCES caregiver_profiles(user_id) ON DELETE RESTRICT,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text NOT NULL,
  public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE review_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE favorites (
  client_id uuid NOT NULL REFERENCES client_profiles(user_id) ON DELETE CASCADE,
  caregiver_id uuid NOT NULL REFERENCES caregiver_profiles(user_id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (client_id, caregiver_id)
);

CREATE TABLE saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES client_profiles(user_id) ON DELETE CASCADE,
  name text NOT NULL,
  filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  caregiver_id uuid REFERENCES caregiver_profiles(user_id) ON DELETE SET NULL,
  category text NOT NULL CHECK (category IN ('cuidador', 'plataforma', 'pago', 'seguridad', 'otro')),
  urgency report_urgency NOT NULL DEFAULT 'notice',
  subject text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE report_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  file_id uuid NOT NULL REFERENCES files(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  report_id uuid REFERENCES reports(id) ON DELETE SET NULL,
  topic text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'waiting', 'closed')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE support_ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body text NOT NULL,
  visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'community')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE social_post_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  file_id uuid NOT NULL REFERENCES files(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE social_post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE social_post_likes (
  post_id uuid NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE fraud_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  risk_level text NOT NULL CHECK (risk_level IN ('medium', 'high', 'critical')),
  title text NOT NULL,
  detail text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id uuid,
  ip_address inet,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE daily_backups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_by uuid REFERENCES users(id) ON DELETE SET NULL,
  scope text NOT NULL,
  storage_key text,
  size_bytes bigint,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'ready', 'failed')),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE platform_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_by uuid REFERENCES users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE content_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
  published_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  body text NOT NULL,
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true
);

-- Cola simple en PostgreSQL para tareas gratis sin Redis: emails OTP, IA, backups, notificaciones.
CREATE TABLE app_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status job_status NOT NULL DEFAULT 'queued',
  attempts int NOT NULL DEFAULT 0,
  max_attempts int NOT NULL DEFAULT 3,
  run_at timestamptz NOT NULL DEFAULT now(),
  locked_at timestamptz,
  locked_by text,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE zone_heatmap_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  point geography(Point, 4326),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_client_profiles_updated_at BEFORE UPDATE ON client_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_caregiver_profiles_updated_at BEFORE UPDATE ON caregiver_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_admin_profiles_updated_at BEFORE UPDATE ON admin_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_caregiver_verifications_updated_at BEFORE UPDATE ON caregiver_verifications FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_social_posts_updated_at BEFORE UPDATE ON social_posts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_content_pages_updated_at BEFORE UPDATE ON content_pages FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_users_role_status ON users(role, status);
CREATE INDEX idx_login_otps_user_expires ON login_otps(user_id, expires_at);
CREATE INDEX idx_sessions_user_expires ON sessions(user_id, expires_at);
CREATE INDEX idx_caregivers_status_rank ON caregiver_profiles(verified_status, rank);
CREATE INDEX idx_caregiver_calendar_date ON caregiver_calendar_blocks(caregiver_id, block_date);
CREATE INDEX idx_bookings_client_status ON bookings(client_id, status);
CREATE INDEX idx_bookings_caregiver_status ON bookings(caregiver_id, status);
CREATE INDEX idx_bookings_schedule ON bookings(scheduled_date, start_time);
CREATE INDEX idx_messages_conversation_sent ON messages(conversation_id, sent_at);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read_at, created_at DESC);
CREATE INDEX idx_payment_proofs_status ON payment_proofs(status, uploaded_at DESC);
CREATE INDEX idx_reviews_caregiver_public ON reviews(caregiver_id, public, created_at DESC);
CREATE INDEX idx_reports_status_urgency ON reports(status, urgency, created_at DESC);
CREATE INDEX idx_audit_logs_target ON audit_logs(target_type, target_id, created_at DESC);
CREATE INDEX idx_app_jobs_queue ON app_jobs(status, run_at, created_at);

CREATE INDEX idx_neighborhoods_center_gix ON neighborhoods USING gist(center);
CREATE INDEX idx_service_zones_boundary_gix ON service_zones USING gist(boundary);
CREATE INDEX idx_booking_locations_point_gix ON booking_locations USING gist(point);
CREATE INDEX idx_checkins_locations_gix ON booking_checkins USING gist(check_in_location, check_out_location);
CREATE INDEX idx_zone_heatmap_point_gix ON zone_heatmap_events USING gist(point);

