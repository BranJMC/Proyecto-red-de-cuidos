import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import { mkdir } from 'fs/promises'
import { query, withTransaction } from './db.js'
import { isEmailConfigured, sendAppEmail, verifyMailerConnection } from './mailer.js'
import {
  comparePassword,
  formatCurrencyValue,
  formatDateInputValue,
  formatDateLabel,
  formatTimeLabel,
  generateOtpCode,
  generateSecureToken,
  hashToken,
  hashPassword,
  maskEmail,
  mapAiDecision,
  mapBookingStatus,
  mapPaymentProofStatus,
  slugify,
} from './utils.js'

const app = express()
const port = Number(process.env.PORT ?? 3000)
const jwtSecret = process.env.JWT_SECRET ?? 'red-cuidados-dev-secret'
const appBaseUrl = process.env.APP_BASE_URL ?? 'http://localhost:5173'
const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL ?? 'admin@redcuidados.com'
const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD ?? 'RedCuidados2026'
const defaultAdminName = process.env.DEFAULT_ADMIN_NAME ?? 'Lucia Herrera'
const defaultAdminPhone = process.env.DEFAULT_ADMIN_PHONE ?? '+50688887777'
const defaultAdminAvatar =
  process.env.DEFAULT_ADMIN_AVATAR ??
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80'
const defaultClientEmail = process.env.DEFAULT_CLIENT_EMAIL ?? 'ana@familia.com'
const defaultClientPassword = process.env.DEFAULT_CLIENT_PASSWORD ?? 'RedCuidados2026'
const defaultClientName = process.env.DEFAULT_CLIENT_NAME ?? 'Ana Gutierrez'
const defaultClientPhone = process.env.DEFAULT_CLIENT_PHONE ?? '+50688881111'
const defaultClientAvatar =
  process.env.DEFAULT_CLIENT_AVATAR ??
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
const uploadsRoot = path.resolve(process.cwd(), 'uploads')
const paymentProofUploadsDir = path.join(uploadsRoot, 'payment-proofs')
const caregiverDocumentsUploadsDir = path.join(uploadsRoot, 'caregiver-documents')
const requiredCaregiverDocumentTypes = ['national_id_front', 'national_id_back', 'curriculum', 'hoja_de_vida']
const caregiverDocumentLabels = {
  national_id_front: 'Frente de cedula',
  national_id_back: 'Reverso de cedula',
  face_photo: 'Foto del rostro',
  curriculum: 'Curriculum',
  hoja_de_vida: 'Hoja de vida',
  certification: 'Certificacion',
}
const accountDeletionFunctionSql = `
CREATE OR REPLACE FUNCTION delete_user_account(target_user_id uuid)
RETURNS boolean AS $$
DECLARE
  target_role user_role;
BEGIN
  SELECT role
    INTO target_role
  FROM users
  WHERE id = target_user_id;

  IF target_role IS NULL THEN
    RETURN false;
  END IF;

  IF target_role = 'admin' THEN
    RAISE EXCEPTION 'La cuenta admin no se puede eliminar desde esta accion.';
  END IF;

  DELETE FROM support_ticket_messages WHERE sender_id = target_user_id;
  DELETE FROM review_replies WHERE author_id = target_user_id;
  DELETE FROM messages WHERE sender_id = target_user_id;
  DELETE FROM reports WHERE reporter_id = target_user_id;
  DELETE FROM support_tickets WHERE requester_id = target_user_id;

  IF target_role = 'client' THEN
    DELETE FROM bookings WHERE client_id = target_user_id;
    DELETE FROM reviews WHERE client_id = target_user_id;
  END IF;

  IF target_role = 'caregiver' THEN
    DELETE FROM bookings WHERE caregiver_id = target_user_id;
    DELETE FROM reviews WHERE caregiver_id = target_user_id;
  END IF;

  DELETE FROM users WHERE id = target_user_id;
  RETURN true;
END;
$$ LANGUAGE plpgsql;
`

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => {
      callback(null, paymentProofUploadsDir)
    },
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname) || '.bin'
      callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`)
    },
  }),
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
})

const caregiverDocumentUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => {
      callback(null, caregiverDocumentsUploadsDir)
    },
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname) || '.bin'
      callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`)
    },
  }),
  limits: {
    fileSize: 12 * 1024 * 1024,
  },
})

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadsRoot))

function buildPaymentReferenceCode(bookingId) {
  const compactId = String(bookingId ?? '')
    .replace(/-/g, '')
    .toUpperCase()
  return `RDC-${compactId.slice(0, 8)}`
}

function toPublicUploadUrl(filename) {
  return `/uploads/payment-proofs/${filename}`
}

function toCaregiverDocumentPublicUrl(filename) {
  return `/uploads/caregiver-documents/${filename}`
}

function normalizeMoneyValue(value) {
  return Number(Number(value ?? 0).toFixed(2))
}

function timeTextToMinutes(timeText) {
  const [hours = '0', minutes = '0'] = String(timeText ?? '00:00').slice(0, 5).split(':')
  return Number(hours) * 60 + Number(minutes)
}

function getDocumentLabel(documentType) {
  return caregiverDocumentLabels[documentType] ?? documentType
}

async function getCaregiverApplicationSnapshot(caregiverId) {
  const [verificationResult, documentsResult] = await Promise.all([
    query(
      `SELECT id, status, national_id_number, submitted_at, reviewed_at, rejection_reason
       FROM caregiver_verifications
       WHERE caregiver_id = $1`,
      [caregiverId],
    ),
    query(
      `SELECT vd.id, vd.document_type, vd.status, vd.ai_summary, f.id AS file_id, f.original_filename, f.public_url, f.created_at
       FROM caregiver_verifications cv
       LEFT JOIN verification_documents vd ON vd.verification_id = cv.id
       LEFT JOIN files f ON f.id = vd.file_id
       WHERE cv.caregiver_id = $1
       ORDER BY f.created_at DESC NULLS LAST, vd.created_at DESC`,
      [caregiverId],
    ),
  ])

  const verification = verificationResult.rows[0]
  const latestByType = new Map()
  for (const row of documentsResult.rows) {
    if (!row.document_type || latestByType.has(row.document_type)) {
      continue
    }
    latestByType.set(row.document_type, row)
  }

  const documents = [...latestByType.values()].map((row) => ({
    id: row.id,
    fileId: row.file_id,
    documentType: row.document_type,
    label: getDocumentLabel(row.document_type),
    status: row.status,
    fileName: row.original_filename,
    fileUrl: row.public_url,
    uploadedAt: row.created_at,
    aiSummary: row.ai_summary ?? undefined,
  }))

  const missingDocuments = [...requiredCaregiverDocumentTypes, 'face_photo']
    .filter((documentType) => !latestByType.has(documentType))
    .map(getDocumentLabel)

  const facePhotoDocument = latestByType.get('face_photo')

  return {
    verification,
    documents,
    missingDocuments,
    hasRequiredDocuments: missingDocuments.length === 0,
    facePhotoUrl: facePhotoDocument?.public_url ?? null,
  }
}

function toAbsoluteUrl(req, relativeUrl) {
  if (!relativeUrl) {
    return null
  }

  return new URL(relativeUrl, `${req.protocol}://${req.get('host')}`).toString()
}

function normalizeEmail(value) {
  return String(value ?? '').trim().toLowerCase()
}

function getRequestIp(req) {
  return req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ?? req.socket.remoteAddress ?? null
}

function buildLoginOtpEmail({ fullName, otpCode }) {
  return {
    subject: 'Tu codigo de acceso de CareWy',
    text: `Hola ${fullName}, tu codigo de acceso es ${otpCode}. Expira en 10 minutos.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
        <h2>Codigo de acceso</h2>
        <p>Hola ${fullName}, usa este codigo para completar tu inicio de sesion:</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; margin: 24px 0; color: #0891b2;">${otpCode}</div>
        <p>Este codigo vence en 10 minutos.</p>
      </div>
    `,
  }
}

function buildPasswordResetEmail({ fullName, resetUrl }) {
  return {
    subject: 'Recupera tu contrasena de CareWy',
    text: `Hola ${fullName}, abre este enlace para cambiar tu contrasena: ${resetUrl}. El enlace expira en 30 minutos.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
        <h2>Recuperacion de contrasena</h2>
        <p>Hola ${fullName}, abre este enlace para definir una nueva contrasena:</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#0891b2;color:#ffffff;text-decoration:none;border-radius:999px;">Cambiar contrasena</a>
        </p>
        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
        <p>El enlace expira en 30 minutos.</p>
      </div>
    `,
  }
}

function buildToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
    },
    jwtSecret,
    { expiresIn: '7d' },
  )
}

function mapUserRow(user) {
  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    role: user.role,
    title:
      user.role === 'client'
        ? 'Cliente'
        : user.role === 'caregiver'
          ? 'Cuidador verificado'
          : 'Administrador',
    avatar: user.avatar_url,
    phone: user.phone,
    status: user.status,
  }
}

function mapShiftLogRow(row) {
  return {
    bookingId: row.booking_id,
    caregiverName: row.caregiver_name,
    checkIn: row.check_in_at ? formatTimeLabel(row.check_in_at) : '',
    checkOut: row.check_out_at ? formatTimeLabel(row.check_out_at) : undefined,
    status: row.status,
  }
}

function computeServiceState({ scheduledDate, endTime, checkInAt, checkOutAt }) {
  if (checkOutAt) {
    return 'completed'
  }

  if (checkInAt) {
    return 'in-progress'
  }

  const now = new Date()
  const serviceEnd = new Date(`${formatDateInputValue(scheduledDate)}T${String(endTime).slice(0, 5)}:00`)
  return serviceEnd < now ? 'missed' : 'upcoming'
}

function describeServiceState(state, scheduledDate) {
  const dateLabel = formatDateLabel(scheduledDate)
  switch (state) {
    case 'in-progress':
      return 'En progreso'
    case 'completed':
      return 'Finalizado'
    case 'missed':
      return 'Perdio el trabajo por no registrar entrada y salida'
    default:
      return `Servicio proximo el ${dateLabel}`
  }
}

function getRoleHomePath(role) {
  if (role === 'caregiver') {
    return '/caregiver/home'
  }

  if (role === 'admin') {
    return '/admin/overview'
  }

  return '/client/home'
}

async function ensureDefaultAdminAccount() {
  const normalizedEmail = normalizeEmail(defaultAdminEmail)
  const passwordHash = await hashPassword(defaultAdminPassword)

  const adminResult = await query(
    `SELECT id
     FROM users
     WHERE email = $1`,
    [normalizedEmail],
  )

  let adminId = adminResult.rows[0]?.id

  if (!adminId) {
    const inserted = await query(
      `INSERT INTO users (email, password_hash, role, status, full_name, phone, avatar_url, email_verified_at)
       VALUES ($1, $2, 'admin', 'active', $3, $4, $5, now())
       RETURNING id`,
      [normalizedEmail, passwordHash, defaultAdminName, defaultAdminPhone, defaultAdminAvatar],
    )
    adminId = inserted.rows[0].id
  } else {
    await query(
      `UPDATE users
       SET password_hash = $2,
           role = 'admin',
           status = 'active',
           full_name = COALESCE(NULLIF(full_name, ''), $3),
           phone = COALESCE(phone, $4),
           avatar_url = COALESCE(avatar_url, $5),
           email_verified_at = COALESCE(email_verified_at, now()),
           updated_at = now()
       WHERE id = $1`,
      [adminId, passwordHash, defaultAdminName, defaultAdminPhone, defaultAdminAvatar],
    )
  }

  await query(
    `INSERT INTO admin_profiles (user_id, title, department, permissions)
     VALUES ($1, 'Operations Lead', 'Trust & Safety', '{"all": true}')
     ON CONFLICT (user_id) DO UPDATE SET
       title = EXCLUDED.title,
       department = EXCLUDED.department,
       permissions = EXCLUDED.permissions`,
    [adminId],
  )
}

async function ensureDefaultClientAccount() {
  const normalizedEmail = normalizeEmail(defaultClientEmail)
  const passwordHash = await hashPassword(defaultClientPassword)

  const clientResult = await query(
    `SELECT id
     FROM users
     WHERE email = $1`,
    [normalizedEmail],
  )

  let clientId = clientResult.rows[0]?.id

  if (!clientId) {
    const inserted = await query(
      `INSERT INTO users (email, password_hash, role, status, full_name, phone, avatar_url, email_verified_at)
       VALUES ($1, $2, 'client', 'active', $3, $4, $5, now())
       RETURNING id`,
      [normalizedEmail, passwordHash, defaultClientName, defaultClientPhone, defaultClientAvatar],
    )
    clientId = inserted.rows[0].id
  } else {
    await query(
      `UPDATE users
       SET password_hash = $2,
           role = 'client',
           status = 'active',
           full_name = COALESCE(NULLIF(full_name, ''), $3),
           phone = COALESCE(phone, $4),
           avatar_url = COALESCE(avatar_url, $5),
           email_verified_at = COALESCE(email_verified_at, now()),
           updated_at = now()
       WHERE id = $1`,
      [clientId, passwordHash, defaultClientName, defaultClientPhone, defaultClientAvatar],
    )
  }

  await query(
    `INSERT INTO client_profiles (user_id, family_name)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET
       family_name = EXCLUDED.family_name`,
    [clientId, 'Familia Gutierrez'],
  )
}

async function getCaregiverDayCapacity(caregiverId, date) {
  const workingHoursResult = await query(
    `SELECT start_time::text, end_time::text
     FROM caregiver_working_hours
     WHERE caregiver_id = $1
       AND active = true
       AND day_of_week = EXTRACT(DOW FROM $2::date)::int`,
    [caregiverId, date],
  )

  const capacityMinutes = workingHoursResult.rows.reduce(
    (total, row) => total + Math.max(timeTextToMinutes(row.end_time) - timeTextToMinutes(row.start_time), 0),
    0,
  )

  const reservationsResult = await query(
    `SELECT id, status, total_hours
     FROM bookings
     WHERE caregiver_id = $1
       AND scheduled_date = $2
       AND status IN ('requested', 'confirmed', 'in_progress', 'completed')`,
    [caregiverId, date],
  )

  const usedMinutes = reservationsResult.rows.reduce((total, row) => total + Number(row.total_hours) * 60, 0)

  return {
    capacityHours: Number((capacityMinutes / 60).toFixed(2)),
    usedHours: Number((usedMinutes / 60).toFixed(2)),
  }
}

async function createConversationIfMissing({ bookingId = null, clientId, caregiverId, initialMessage = null, senderId = null }) {
  const existingConversation = await query(
    `SELECT c.id
     FROM conversations c
     JOIN conversation_participants cp1 ON cp1.conversation_id = c.id AND cp1.user_id = $1
     JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id = $2
     WHERE ($3::uuid IS NULL AND c.booking_id IS NULL) OR c.booking_id = $3
     ORDER BY c.created_at DESC
     LIMIT 1`,
    [clientId, caregiverId, bookingId],
  )

  if (existingConversation.rows[0]) {
    return existingConversation.rows[0].id
  }

  const conversation = await withTransaction(async (client) => {
    const conversationResult = await client.query(
      `INSERT INTO conversations (booking_id)
       VALUES ($1)
       RETURNING id`,
      [bookingId],
    )

    await client.query(
      `INSERT INTO conversation_participants (conversation_id, user_id)
       VALUES ($1, $2), ($1, $3)`,
      [conversationResult.rows[0].id, clientId, caregiverId],
    )

    if (initialMessage?.trim() && senderId) {
      await client.query(
        `INSERT INTO messages (conversation_id, sender_id, body)
         VALUES ($1, $2, $3)`,
        [conversationResult.rows[0].id, senderId, initialMessage.trim()],
      )
    }

    return conversationResult.rows[0].id
  })

  return conversation
}

app.get('/api/health', async (_req, res) => {
  const { rows } = await query('SELECT now() AS now')
  res.json({ ok: true, now: rows[0].now })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body ?? {}
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contrasena son requeridos.' })
  }

  const { rows } = await query(
    `SELECT id, email, password_hash, role, status, full_name, avatar_url, phone
     FROM users
     WHERE email = $1`,
    [normalizeEmail(email)],
  )

  const user = rows[0]
  if (!user) {
    return res.status(401).json({ message: 'Credenciales invalidas.' })
  }

  if (role && user.role !== role) {
    return res.status(401).json({ message: 'Ese usuario no pertenece al rol seleccionado.' })
  }

  const passwordValid = await comparePassword(password, user.password_hash)
  if (!passwordValid) {
    return res.status(401).json({ message: 'Credenciales invalidas.' })
  }

  if (user.role === 'admin') {
    await query(`UPDATE users SET last_login_at = now() WHERE id = $1`, [user.id])
    return res.json({
      token: buildToken(user),
      user: mapUserRow(user),
    })
  }

  if (!isEmailConfigured()) {
    return res.status(503).json({ message: 'El correo de autenticacion 2FA no esta configurado todavia.' })
  }

  const otpCode = generateOtpCode()
  const otpHash = hashToken(otpCode)
  const otpExpiryMinutes = 10

  const loginOtpResult = await query(
    `INSERT INTO login_otps (user_id, code_hash, role, expires_at, ip_address, user_agent)
     VALUES ($1, $2, $3, now() + interval '10 minutes', $4, $5)
     RETURNING id`,
    [user.id, otpHash, user.role, getRequestIp(req), req.get('user-agent') ?? null],
  )

  const emailPayload = buildLoginOtpEmail({
    fullName: user.full_name,
    otpCode,
  })

  await sendAppEmail({
    to: user.email,
    subject: emailPayload.subject,
    text: emailPayload.text,
    html: emailPayload.html,
  })

  res.json({
    requiresTwoFactor: true,
    challengeId: loginOtpResult.rows[0].id,
    emailMasked: maskEmail(user.email),
    role: user.role,
    expiresInMinutes: otpExpiryMinutes,
  })
})

app.post('/api/auth/register', async (req, res) => {
  const { fullName, email, password, phone, role } = req.body ?? {}
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' })
  }

  if (role === 'admin') {
    return res.status(403).json({ message: 'La cuenta admin no se crea desde el registro publico.' })
  }

  const normalizedEmail = normalizeEmail(email)
  const existing = await query(`SELECT id FROM users WHERE email = $1`, [normalizedEmail])
  if (existing.rowCount) {
    return res.status(409).json({ message: 'Ese email ya existe.' })
  }

  const passwordHash = await hashPassword(password)
  const result = await withTransaction(async (client) => {
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, role, status, full_name, phone)
       VALUES ($1, $2, $3, 'active', $4, $5)
       RETURNING id, email, role, status, full_name, avatar_url, phone`,
      [normalizedEmail, passwordHash, role, fullName, phone ?? null],
    )
    const user = userResult.rows[0]

    if (role === 'client') {
      await client.query(
        `INSERT INTO client_profiles (user_id, family_name) VALUES ($1, $2)`,
        [user.id, fullName],
      )
    } else if (role === 'caregiver') {
      const publicSlug = slugify(fullName)
      await client.query(
        `INSERT INTO caregiver_profiles (
          user_id, public_slug, headline, bio, years_experience, base_hourly_rate, languages,
          service_count, rank, rating_average, rating_count, verified_status, can_work
        )
        VALUES ($1, $2, 'Nuevo cuidador en verificacion', '', 0, 0, ARRAY['Espanol'], 0, 'Bronze', 0, 0, 'pending', false)`,
        [user.id, `${publicSlug}-${user.id.slice(0, 6)}`],
      )
      await client.query(
        `INSERT INTO caregiver_verifications (caregiver_id, status) VALUES ($1, 'pending')`,
        [user.id],
      )
    } else if (role === 'admin') {
      await client.query(
        `INSERT INTO admin_profiles (user_id, title, permissions) VALUES ($1, 'Admin', '{"all": true}')`,
        [user.id],
      )
    }

    return user
  })

  res.status(201).json({
    ok: true,
    userId: result.id,
    role: result.role,
    message:
      role === 'caregiver'
        ? 'Cuenta creada. Ahora inicia sesion para recibir tu 2FA por correo y continuar con la verificacion.'
        : 'Cuenta creada correctamente. Ahora inicia sesion con tu correo y contrasena.',
  })
})

app.post('/api/auth/login/verify', async (req, res) => {
  const { challengeId, code } = req.body ?? {}
  if (!challengeId || !code) {
    return res.status(400).json({ message: 'challengeId y codigo son requeridos.' })
  }

  const otpResult = await query(
    `SELECT
            u.id,
            lo.user_id,
            lo.role,
            lo.code_hash,
            lo.expires_at,
            lo.used_at,
            lo.attempts,
            u.email,
            u.role AS user_role,
            u.status,
            u.full_name,
            u.avatar_url,
            u.phone
     FROM login_otps lo
     JOIN users u ON u.id = lo.user_id
     WHERE lo.id = $1`,
    [challengeId],
  )

  const otp = otpResult.rows[0]
  if (!otp) {
    return res.status(404).json({ message: 'El desafio de 2FA ya no existe.' })
  }

  if (otp.used_at) {
    return res.status(409).json({ message: 'Ese codigo ya fue utilizado.' })
  }

  if (new Date(otp.expires_at).getTime() < Date.now()) {
    return res.status(410).json({ message: 'El codigo expiro. Solicita uno nuevo.' })
  }

  const codeValid = hashToken(code) === otp.code_hash
  if (!codeValid) {
    await query(`UPDATE login_otps SET attempts = attempts + 1 WHERE id = $1`, [challengeId])
    return res.status(401).json({ message: 'El codigo ingresado no es valido.' })
  }

  await query(`UPDATE login_otps SET used_at = now() WHERE id = $1`, [challengeId])
  await query(`UPDATE users SET email_verified_at = COALESCE(email_verified_at, now()), last_login_at = now() WHERE id = $1`, [otp.user_id])

  res.json({
    token: buildToken(otp),
    user: mapUserRow(otp),
  })
})

app.post('/api/auth/login/resend-otp', async (req, res) => {
  const { challengeId } = req.body ?? {}
  if (!challengeId) {
    return res.status(400).json({ message: 'challengeId es requerido.' })
  }

  if (!isEmailConfigured()) {
    return res.status(503).json({ message: 'El correo de autenticacion 2FA no esta configurado todavia.' })
  }

  const challengeResult = await query(
    `SELECT lo.user_id, lo.role, u.email, u.full_name
     FROM login_otps lo
     JOIN users u ON u.id = lo.user_id
     WHERE lo.id = $1`,
    [challengeId],
  )

  const challenge = challengeResult.rows[0]
  if (!challenge) {
    return res.status(404).json({ message: 'El desafio ya no existe.' })
  }

  await query(`DELETE FROM login_otps WHERE user_id = $1 AND used_at IS NULL`, [challenge.user_id])

  const otpCode = generateOtpCode()
  const otpHash = hashToken(otpCode)
  const inserted = await query(
    `INSERT INTO login_otps (user_id, code_hash, role, expires_at, ip_address, user_agent)
     VALUES ($1, $2, $3, now() + interval '10 minutes', $4, $5)
     RETURNING id`,
    [challenge.user_id, otpHash, challenge.role, getRequestIp(req), req.get('user-agent') ?? null],
  )

  const emailPayload = buildLoginOtpEmail({
    fullName: challenge.full_name,
    otpCode,
  })

  await sendAppEmail({
    to: challenge.email,
    subject: emailPayload.subject,
    text: emailPayload.text,
    html: emailPayload.html,
  })

  res.json({
    ok: true,
    challengeId: inserted.rows[0].id,
    emailMasked: maskEmail(challenge.email),
    expiresInMinutes: 10,
  })
})

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email, role } = req.body ?? {}
  if (!email) {
    return res.status(400).json({ message: 'El email es requerido.' })
  }

  const normalizedEmail = normalizeEmail(email)
  const userResult = await query(
    `SELECT id, email, role, full_name
     FROM users
     WHERE email = $1`,
    [normalizedEmail],
  )

  const user = userResult.rows[0]
  if (!user || user.role === 'admin' || (role && user.role !== role)) {
    return res.json({ message: 'Si el correo existe, te enviaremos instrucciones.' })
  }

  if (!isEmailConfigured()) {
    return res.status(503).json({ message: 'El correo de recuperacion no esta configurado todavia.' })
  }

  const rawToken = generateSecureToken()
  const tokenHash = hashToken(rawToken)

  await query(`DELETE FROM password_reset_tokens WHERE user_id = $1 AND used_at IS NULL`, [user.id])
  await query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, now() + interval '30 minutes')`,
    [user.id, tokenHash],
  )

  // El enlace de recuperacion devuelve al rol correcto para que el usuario no pierda el contexto al cambiar la contrasena.
  const returnTo = user.role === 'caregiver' ? '/caregiver/home' : '/client/home'
  const resetUrl = `${appBaseUrl}/auth/reset-password?token=${encodeURIComponent(rawToken)}&role=${encodeURIComponent(user.role)}&returnTo=${encodeURIComponent(returnTo)}`
  const emailPayload = buildPasswordResetEmail({
    fullName: user.full_name,
    resetUrl,
  })

  await sendAppEmail({
    to: user.email,
    subject: emailPayload.subject,
    text: emailPayload.text,
    html: emailPayload.html,
  })

  res.json({ message: 'Si el correo existe, te enviaremos instrucciones.' })
})

app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body ?? {}
  if (!token || !password) {
    return res.status(400).json({ message: 'Token y nueva contrasena son requeridos.' })
  }

  const tokenHash = hashToken(token)
  const tokenResult = await query(
    `SELECT id, user_id, expires_at, used_at
     FROM password_reset_tokens
     WHERE token_hash = $1`,
    [tokenHash],
  )

  const resetToken = tokenResult.rows[0]
  if (!resetToken) {
    return res.status(404).json({ message: 'El enlace de recuperacion no es valido.' })
  }

  if (resetToken.used_at) {
    return res.status(409).json({ message: 'Este enlace ya fue utilizado.' })
  }

  if (new Date(resetToken.expires_at).getTime() < Date.now()) {
    return res.status(410).json({ message: 'El enlace expiro. Solicita uno nuevo.' })
  }

  const passwordHash = await hashPassword(password)
  await withTransaction(async (client) => {
    await client.query(`UPDATE users SET password_hash = $2, updated_at = now() WHERE id = $1`, [resetToken.user_id, passwordHash])
    await client.query(`UPDATE password_reset_tokens SET used_at = now() WHERE id = $1`, [resetToken.id])
    await client.query(`DELETE FROM login_otps WHERE user_id = $1 AND used_at IS NULL`, [resetToken.user_id])
  })

  res.json({ ok: true, message: 'Contrasena actualizada correctamente.' })
})

app.get('/api/auth/config', async (_req, res) => {
  res.json({
    emailEnabled: isEmailConfigured(),
    appBaseUrl,
  })
})

app.get('/api/caregivers', async (_req, res) => {
  const { rows } = await query(`SELECT * FROM v_frontend_caregivers ORDER BY rating DESC, reviews DESC`)
  const caregivers = rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    specialty: row.specialty,
    province: row.province,
    city: row.city,
    neighborhood: row.neighborhood,
    zones: row.zones,
    languages: row.languages,
    pricePerHour: formatCurrencyValue(row.price_per_hour),
    nightShiftFee: formatCurrencyValue(row.night_shift_fee),
    weekendFee: formatCurrencyValue(row.weekend_fee),
    emergencyFee: formatCurrencyValue(row.emergency_fee),
    rating: Number(row.rating),
    reviews: Number(row.reviews),
    verified: row.verified,
    urgentAvailability: row.urgent_availability,
    availableNow: row.available_now,
    availableToday: row.available_today,
    nightShiftAvailable: row.night_shift_available,
    weekendAvailable: row.weekend_available,
    emergencyService: row.emergency_service,
    experienceYears: Number(row.experience_years),
    serviceTypes: row.service_types,
    about: row.about,
    certifications: row.certifications,
    availability: row.availability,
    workingDays: [],
    workingHours: [],
    serviceCount: Number(row.service_count),
    rank: row.rank,
    image: row.image,
  }))

  res.json(caregivers)
})

app.get('/api/caregivers/:slug', async (req, res) => {
  const { rows } = await query(
    `SELECT * FROM v_frontend_caregivers WHERE slug = $1`,
    [req.params.slug],
  )
  const caregiver = rows[0]
  if (!caregiver) {
    return res.status(404).json({ message: 'Cuidador no encontrado.' })
  }

  const workingHoursResult = await query(
    `SELECT day_of_week, start_time::text, end_time::text
     FROM caregiver_working_hours
     WHERE caregiver_id = $1
     ORDER BY day_of_week, start_time`,
    [caregiver.id],
  )

  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
  res.json({
    id: caregiver.id,
    slug: caregiver.slug,
    name: caregiver.name,
    specialty: caregiver.specialty,
    province: caregiver.province,
    city: caregiver.city,
    neighborhood: caregiver.neighborhood,
    zones: caregiver.zones,
    languages: caregiver.languages,
    pricePerHour: formatCurrencyValue(caregiver.price_per_hour),
    nightShiftFee: formatCurrencyValue(caregiver.night_shift_fee),
    weekendFee: formatCurrencyValue(caregiver.weekend_fee),
    emergencyFee: formatCurrencyValue(caregiver.emergency_fee),
    rating: Number(caregiver.rating),
    reviews: Number(caregiver.reviews),
    verified: caregiver.verified,
    urgentAvailability: caregiver.urgent_availability,
    availableNow: caregiver.available_now,
    availableToday: caregiver.available_today,
    nightShiftAvailable: caregiver.night_shift_available,
    weekendAvailable: caregiver.weekend_available,
    emergencyService: caregiver.emergency_service,
    experienceYears: Number(caregiver.experience_years),
    serviceTypes: caregiver.service_types,
    about: caregiver.about,
    certifications: caregiver.certifications,
    availability: caregiver.availability,
    workingDays: [...new Set(workingHoursResult.rows.map((row) => dayNames[row.day_of_week]))],
    workingHours: workingHoursResult.rows.map((row) => `${row.start_time.slice(0, 5)}-${row.end_time.slice(0, 5)}`),
    serviceCount: Number(caregiver.service_count),
    rank: caregiver.rank,
    image: caregiver.image,
  })
})

app.get('/api/users/by-email/:email', async (req, res) => {
  const { rows } = await query(
    `SELECT id, email, role, status, full_name, avatar_url, phone FROM users WHERE email = $1`,
    [req.params.email],
  )
  if (!rows[0]) {
    return res.status(404).json({ message: 'Usuario no encontrado.' })
  }
  res.json(mapUserRow(rows[0]))
})

app.get('/api/account/profile', async (req, res) => {
  const { userId } = req.query
  if (!userId) {
    return res.status(400).json({ message: 'userId es requerido.' })
  }

  const { rows } = await query(
    `SELECT id, full_name, email, phone, role, avatar_url
     FROM users
     WHERE id = $1`,
    [userId],
  )

  if (!rows[0]) {
    return res.status(404).json({ message: 'Usuario no encontrado.' })
  }

  const row = rows[0]
  res.json({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone ?? '',
    role: row.role,
    avatar: row.avatar_url ?? '',
  })
})

app.post('/api/account/profile', async (req, res) => {
  const { userId, fullName, phone } = req.body ?? {}
  if (!userId || !fullName?.trim()) {
    return res.status(400).json({ message: 'userId y fullName son requeridos.' })
  }

  await query(
    `UPDATE users
     SET full_name = $2,
         phone = $3,
         updated_at = now()
     WHERE id = $1`,
    [userId, fullName.trim(), phone?.trim() || null],
  )

  res.json({ ok: true })
})

app.delete('/api/account', async (req, res) => {
  const { userId } = req.body ?? {}
  if (!userId) {
    return res.status(400).json({ message: 'userId es requerido.' })
  }

  const userResult = await query(
    `SELECT id, role
     FROM users
     WHERE id = $1`,
    [userId],
  )

  const user = userResult.rows[0]
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado.' })
  }

  if (user.role === 'admin') {
    return res.status(403).json({ message: 'La cuenta admin no se puede eliminar desde esta accion.' })
  }

  await query(`SELECT delete_user_account($1)`, [userId])

  res.json({ ok: true, redirectTo: '/' })
})

app.get('/api/bookings', async (req, res) => {
  const { userId, role } = req.query
  let whereClause = ''
  const params = []

  if (userId && role === 'client') {
    params.push(userId)
    whereClause = 'WHERE b.client_id = $1'
  } else if (userId && role === 'caregiver') {
    params.push(userId)
    whereClause = 'WHERE b.caregiver_id = $1'
  }

  const { rows } = await query(
    `SELECT
      b.id,
      b.caregiver_id,
      caregiver.full_name AS caregiver_name,
      client.full_name AS client_name,
      conv.id AS conversation_id,
     b.service_type,
      COALESCE(n.name, c.name, p.name, bl.label, 'Sin zona') AS zone,
      bl.address_line,
      b.scheduled_date,
      b.start_time::text,
      b.end_time::text,
      b.total_hours,
      b.status,
      b.total_amount,
      b.notes,
      bc.check_in_at,
      bc.check_out_at,
      bc.status AS shift_status,
      pp.status AS payment_proof_status,
      pp.created_at AS payment_proof_uploaded_at,
      proof_file.public_url AS payment_proof_file_url,
      proof_file.original_filename AS payment_proof_file_name
     FROM bookings b
     JOIN users caregiver ON caregiver.id = b.caregiver_id
     JOIN users client ON client.id = b.client_id
     LEFT JOIN conversations conv ON conv.booking_id = b.id
     LEFT JOIN booking_locations bl ON bl.id = b.location_id
     LEFT JOIN provinces p ON p.id = bl.province_id
     LEFT JOIN cities c ON c.id = bl.city_id
     LEFT JOIN neighborhoods n ON n.id = bl.neighborhood_id
     LEFT JOIN booking_checkins bc ON bc.booking_id = b.id
     LEFT JOIN LATERAL (
       SELECT id, status, created_at
       FROM payment_proofs
       WHERE booking_id = b.id
       ORDER BY created_at DESC
       LIMIT 1
     ) pp ON true
     LEFT JOIN LATERAL (
       SELECT f.public_url, f.original_filename
       FROM payment_proof_files ppf
       JOIN files f ON f.id = ppf.file_id
       WHERE ppf.payment_proof_id = pp.id
       ORDER BY ppf.created_at DESC
       LIMIT 1
     ) proof_file ON true
     ${whereClause}
     ORDER BY b.scheduled_date DESC, b.start_time DESC`,
    params,
  )

  res.json(
    rows.map((row) => {
      const serviceState = computeServiceState({
        scheduledDate: row.scheduled_date,
        endTime: row.end_time,
        checkInAt: row.check_in_at,
        checkOutAt: row.check_out_at,
      })

      return {
        id: row.id,
        caregiverId: row.caregiver_id,
        caregiverName: row.caregiver_name,
        clientName: row.client_name,
        conversationId: row.conversation_id ?? undefined,
        service: row.service_type,
        zone: row.zone,
        addressLine: row.address_line ?? undefined,
        date: formatDateInputValue(row.scheduled_date),
        startTime: row.start_time.slice(0, 5),
        endTime: row.end_time?.slice(0, 5),
        duration: `${Number(row.total_hours)} horas`,
        hours: Number(row.total_hours),
        status: mapBookingStatus(row.status),
        amount: formatCurrencyValue(row.total_amount),
        notes: row.notes ?? undefined,
        paymentReferenceCode: buildPaymentReferenceCode(row.id),
        shiftStatus: row.shift_status ?? 'pending-start',
        checkIn: row.check_in_at ? formatTimeLabel(row.check_in_at) : undefined,
        checkOut: row.check_out_at ? formatTimeLabel(row.check_out_at) : undefined,
        serviceState,
        serviceStateLabel: describeServiceState(serviceState, row.scheduled_date),
        paymentDeadlineAt: row.check_out_at ? new Date(new Date(row.check_out_at).getTime() + 60 * 60 * 1000).toISOString() : undefined,
        paymentProofStatus: row.payment_proof_status ? mapPaymentProofStatus(row.payment_proof_status) : undefined,
        paymentProofFileUrl: toAbsoluteUrl(req, row.payment_proof_file_url),
        paymentProofFileName: row.payment_proof_file_name ?? undefined,
        paymentProofUploadedAt: row.payment_proof_uploaded_at ? formatDateLabel(row.payment_proof_uploaded_at) : undefined,
      }
    }),
  )
})

app.post('/api/bookings', async (req, res) => {
  const {
    clientId,
    caregiverId,
    serviceType,
    date,
    startTime,
    hours,
    addressLine,
    notes,
  } = req.body ?? {}

  if (!clientId || !caregiverId || !serviceType || !date || !startTime || !hours) {
    return res.status(400).json({ message: 'Faltan datos para crear la reserva.' })
  }

  const paymentRestrictionResult = await query(
    `SELECT
      b.id,
      b.scheduled_date,
      b.end_time::text,
      bc.check_out_at,
      pp.status AS proof_status
     FROM bookings b
     LEFT JOIN booking_checkins bc ON bc.booking_id = b.id
     LEFT JOIN LATERAL (
       SELECT status
       FROM payment_proofs
       WHERE booking_id = b.id
       ORDER BY created_at DESC
       LIMIT 1
     ) pp ON true
     WHERE b.client_id = $1
       AND b.status = 'completed'
       AND COALESCE(pp.status, 'pending_review') <> 'approved'
     ORDER BY COALESCE(bc.check_out_at, b.updated_at) DESC
     LIMIT 1`,
    [clientId],
  )

  if (paymentRestrictionResult.rows[0]) {
    const row = paymentRestrictionResult.rows[0]
    const deadlineAt = row.check_out_at ? new Date(new Date(row.check_out_at).getTime() + 60 * 60 * 1000).toISOString() : undefined
    return res.status(409).json({
      message: 'Debes esperar la aprobacion del comprobante del servicio anterior antes de solicitar una nueva reserva.',
      blockingBookingId: row.id,
      paymentDeadlineAt: deadlineAt,
      proofStatus: row.proof_status ?? 'pending_review',
    })
  }

  const caregiverResult = await query(
    `SELECT base_hourly_rate, night_shift_fee, weekend_fee, emergency_fee
     FROM caregiver_profiles
     WHERE user_id = $1`,
    [caregiverId],
  )

  const caregiver = caregiverResult.rows[0]
  if (!caregiver) {
    return res.status(404).json({ message: 'Cuidador no encontrado.' })
  }

  const totalHours = Number(hours)
  const capacity = await getCaregiverDayCapacity(caregiverId, date)
  if (capacity.capacityHours <= 0) {
    return res.status(409).json({ message: 'Ese cuidador no tiene horario configurado para ese dia.' })
  }

  if (capacity.usedHours + totalHours > capacity.capacityHours) {
    return res.status(409).json({ message: 'Ese dia ya no tiene capacidad disponible para una reserva adicional.' })
  }

  const totalAmount = Number(caregiver.base_hourly_rate) * totalHours
  const endTimeDate = new Date(`2000-01-01T${startTime}:00`)
  endTimeDate.setHours(endTimeDate.getHours() + totalHours)
  const endTime = `${String(endTimeDate.getHours()).padStart(2, '0')}:${String(endTimeDate.getMinutes()).padStart(2, '0')}`

  const booking = await withTransaction(async (client) => {
    const locationResult = await client.query(
      `INSERT INTO booking_locations (label, address_line)
       VALUES ('Nueva reserva', $1)
       RETURNING id`,
      [addressLine ?? 'Direccion por confirmar'],
    )

    const bookingResult = await client.query(
      `INSERT INTO bookings (
        client_id, caregiver_id, service_type, status, scheduled_date, start_time, end_time,
        total_hours, location_id, hourly_rate, total_amount, notes
      )
      VALUES ($1, $2, $3, 'requested', $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id`,
      [
        clientId,
        caregiverId,
        serviceType,
        date,
        startTime,
        endTime,
        totalHours,
        locationResult.rows[0].id,
        caregiver.base_hourly_rate,
        totalAmount,
        notes ?? null,
      ],
    )

    await client.query(
      `INSERT INTO notifications (user_id, type, title, body, data)
       VALUES ($1, 'booking', 'Nueva solicitud recibida', $2, jsonb_build_object('bookingId', $3::text))`,
      [caregiverId, `Tienes una nueva reserva para ${date} a las ${startTime}.`, bookingResult.rows[0].id],
    )

    return bookingResult.rows[0]
  })

  const conversationId = await createConversationIfMissing({
    bookingId: booking.id,
    clientId,
    caregiverId,
  })

  res.status(201).json({
    id: booking.id,
    conversationId,
    paymentReferenceCode: buildPaymentReferenceCode(booking.id),
    message: 'Reserva creada correctamente.',
  })
})

app.post('/api/bookings/:id/decision', async (req, res) => {
  const { decision, caregiverId } = req.body ?? {}
  const nextStatus = decision === 'accept' ? 'confirmed' : 'rejected'
  const bookingResult = await query(
    `UPDATE bookings
     SET status = $2
     WHERE id = $1 AND caregiver_id = $3
     RETURNING id, client_id, scheduled_date, start_time::text`,
    [req.params.id, nextStatus, caregiverId],
  )

  if (!bookingResult.rows[0]) {
    return res.status(404).json({ message: 'Reserva no encontrada para este cuidador.' })
  }

  const booking = bookingResult.rows[0]
  const paymentReferenceCode = buildPaymentReferenceCode(booking.id)
  await query(
    `INSERT INTO notifications (user_id, type, title, body, data)
     VALUES ($1, 'booking', $2, $3, jsonb_build_object('bookingId', $4::text))`,
    [
      booking.client_id,
      decision === 'accept' ? 'Reserva aceptada' : 'Reserva rechazada',
      decision === 'accept'
          ? `Tu reserva del ${formatDateLabel(booking.scheduled_date)} a las ${booking.start_time.slice(0, 5)} fue aceptada. Codigo de reserva: ${paymentReferenceCode}.`
          : `Tu reserva del ${formatDateLabel(booking.scheduled_date)} a las ${booking.start_time.slice(0, 5)} fue rechazada.`,
      booking.id,
    ],
  )

  if (decision === 'accept') {
    await query(
      `INSERT INTO notifications (user_id, type, title, body, data)
       VALUES ($1, 'booking', 'Codigo de reserva listo', $2, jsonb_build_object('bookingId', $3::text, 'paymentReferenceCode', $4))`,
      [
        caregiverId,
        `La reserva ${booking.id} quedo confirmada. Codigo para comprobantes: ${paymentReferenceCode}.`,
        booking.id,
        paymentReferenceCode,
      ],
    )

    await query(
      `INSERT INTO notifications (user_id, type, title, body, data)
       SELECT user_id, 'booking', 'Reserva confirmada con codigo', $1, jsonb_build_object('bookingId', $2::text, 'paymentReferenceCode', $3)
       FROM admin_profiles`,
      [`La reserva ${booking.id} fue aceptada y su codigo es ${paymentReferenceCode}.`, booking.id, paymentReferenceCode],
    )
  }

  res.json({ ok: true })
})

app.get('/api/notifications', async (req, res) => {
  const { userId } = req.query
  if (!userId) {
    return res.status(400).json({ message: 'userId es requerido.' })
  }

  const { rows } = await query(`SELECT * FROM v_frontend_notifications WHERE user_id = $1 ORDER BY time DESC`, [userId])
  res.json(
    rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      time: formatTimeLabel(row.time),
      date: formatDateLabel(row.time),
      read: row.read,
      type: row.type,
    })),
  )
})

app.post('/api/notifications/mark-read', async (req, res) => {
  const { userId } = req.body ?? {}
  await query(`UPDATE notifications SET read_at = now() WHERE user_id = $1 AND read_at IS NULL`, [userId])
  res.json({ ok: true })
})

app.delete('/api/notifications/:id', async (req, res) => {
  const { userId } = req.body ?? {}
  if (!userId) {
    return res.status(400).json({ message: 'userId es requerido.' })
  }

  await query(`DELETE FROM notifications WHERE id = $1 AND user_id = $2`, [req.params.id, userId])
  res.json({ ok: true })
})

app.get('/api/favorites', async (req, res) => {
  const { clientId } = req.query
  const { rows } = await query(`SELECT caregiver_id FROM favorites WHERE client_id = $1`, [clientId])
  res.json(rows.map((row) => row.caregiver_id))
})

app.get('/api/saved-searches', async (req, res) => {
  const { clientId } = req.query
  const { rows } = await query(
    `SELECT id, name, filters
     FROM saved_searches
     WHERE client_id = $1
     ORDER BY created_at DESC`,
    [clientId],
  )
  res.json(
    rows.map((row) => ({
      id: row.id,
      title: row.name,
      filters: Object.entries(row.filters ?? {}).map(([key, value]) => `${key}: ${value}`),
      matches: 3,
    })),
  )
})

app.post('/api/saved-searches', async (req, res) => {
  const { clientId, name, filters } = req.body ?? {}
  const { rows } = await query(
    `INSERT INTO saved_searches (client_id, name, filters)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [clientId, name, filters],
  )
  res.status(201).json({ id: rows[0].id, ok: true })
})

app.post('/api/favorites/toggle', async (req, res) => {
  const { clientId, caregiverId } = req.body ?? {}
  const existing = await query(
    `SELECT 1 FROM favorites WHERE client_id = $1 AND caregiver_id = $2`,
    [clientId, caregiverId],
  )

  if (existing.rowCount) {
    await query(`DELETE FROM favorites WHERE client_id = $1 AND caregiver_id = $2`, [clientId, caregiverId])
    return res.json({ favorite: false })
  }

  await query(
    `INSERT INTO favorites (client_id, caregiver_id) VALUES ($1, $2)`,
    [clientId, caregiverId],
  )
  res.json({ favorite: true })
})

app.get('/api/messages/threads', async (req, res) => {
  const { userId } = req.query
  const { rows } = await query(
    `SELECT
      c.id,
      c.booking_id,
      other_user.id AS participant_id,
      other_user.full_name AS participant,
      other_user.role,
      other_user.last_login_at,
      latest.body AS last_message,
      latest.sent_at AS last_message_at,
      COALESCE(unread.total, 0) AS unread
     FROM conversation_participants cp
     JOIN conversations c ON c.id = cp.conversation_id
     JOIN conversation_participants other_cp ON other_cp.conversation_id = c.id AND other_cp.user_id <> cp.user_id
     JOIN users other_user ON other_user.id = other_cp.user_id
     LEFT JOIN LATERAL (
       SELECT body, sent_at
       FROM messages m
       WHERE m.conversation_id = c.id
       ORDER BY sent_at DESC
       LIMIT 1
     ) latest ON true
     LEFT JOIN LATERAL (
       SELECT count(*)::int AS total
       FROM messages m
       WHERE m.conversation_id = c.id
         AND m.sender_id <> cp.user_id
         AND (cp.last_read_at IS NULL OR m.sent_at > cp.last_read_at)
     ) unread ON true
     WHERE cp.user_id = $1
     ORDER BY latest.sent_at DESC NULLS LAST`,
    [userId],
  )

  const threadResults = await Promise.all(
    rows.map(async (row) => {
      const messages = await query(
        `SELECT id, sender_id, body, sent_at
         FROM messages
         WHERE conversation_id = $1
         ORDER BY sent_at ASC`,
        [row.id],
      )
      return {
        id: row.id,
        bookingId: row.booking_id,
        participantId: row.participant_id,
        participant: row.participant,
        role: row.role,
        status: row.last_login_at ? 'online' : 'offline',
        unread: row.unread,
        lastMessage: row.last_message,
        lastMessageAt: formatTimeLabel(row.last_message_at),
        messages: messages.rows.map((message) => ({
          id: message.id,
          author: message.sender_id === userId ? 'me' : 'other',
          content: message.body,
          time: formatTimeLabel(message.sent_at),
        })),
      }
    }),
  )

  res.json(threadResults)
})

app.post('/api/messages/start', async (req, res) => {
  const { requesterId, targetUserId, bookingId, initialMessage } = req.body ?? {}
  if (!requesterId || !targetUserId) {
    return res.status(400).json({ message: 'requesterId y targetUserId son requeridos.' })
  }

  const requesterResult = await query(
    `SELECT id, full_name FROM users WHERE id = $1`,
    [requesterId],
  )

  if (!requesterResult.rows[0]) {
    return res.status(404).json({ message: 'Usuario solicitante no encontrado.' })
  }

  const conversationId = await createConversationIfMissing({
    bookingId: bookingId ?? null,
    clientId: requesterId,
    caregiverId: targetUserId,
    initialMessage,
    senderId: requesterId,
  })

  await query(
    `INSERT INTO notifications (user_id, type, title, body, data)
     VALUES ($1, 'chat', 'Nueva conversacion', $2, jsonb_build_object('conversationId', $3::text))`,
    [targetUserId, `${requesterResult.rows[0].full_name} abrio una conversacion contigo.`, conversationId],
  )

  res.status(201).json({ conversationId })
})

app.post('/api/messages/send', async (req, res) => {
  const { conversationId, senderId, content } = req.body ?? {}
  if (!conversationId || !senderId || !content?.trim()) {
    return res.status(400).json({ message: 'Faltan datos para enviar el mensaje.' })
  }

  const { rows } = await query(
    `INSERT INTO messages (conversation_id, sender_id, body)
     VALUES ($1, $2, $3)
     RETURNING id, sent_at`,
    [conversationId, senderId, content.trim()],
  )

  const recipients = await query(
    `SELECT cp.user_id, sender.full_name AS sender_name
     FROM conversation_participants cp
     JOIN users sender ON sender.id = $2
     WHERE cp.conversation_id = $1
       AND cp.user_id <> $2`,
    [conversationId, senderId],
  )

  await Promise.all(
    recipients.rows.map((recipient) =>
      query(
        `INSERT INTO notifications (user_id, type, title, body, data)
         VALUES ($1, 'chat', 'Nuevo mensaje', $2, jsonb_build_object('conversationId', $3::text))`,
        [recipient.user_id, `${recipient.sender_name} te envio un nuevo mensaje.`, conversationId],
      ),
    ),
  )

  res.status(201).json({
    id: rows[0].id,
    time: formatTimeLabel(rows[0].sent_at),
  })
})

app.get('/api/dashboard/:role/metrics', async (req, res) => {
  const { rows } = await query(
    `SELECT label, value, change_label, accent
     FROM dashboard_metrics
     WHERE role = $1 AND active
     ORDER BY sort_order, label`,
    [req.params.role],
  )
  res.json(
    rows.map((row) => ({
      label: row.label,
      value: row.value,
      change: row.change_label,
      accent: row.accent,
    })),
  )
})

app.get('/api/admin/users', async (_req, res) => {
  const { rows } = await query(
    `SELECT id, full_name AS name, email, role, status, created_at, phone
     FROM users
     ORDER BY created_at DESC`,
  )
  res.json(
    rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      status: row.status === 'pending_email' ? 'pending' : row.status,
      joinedAt: formatDateLabel(row.created_at),
      city: row.phone ?? 'Sin ciudad',
    })),
  )
})

app.get('/api/admin/approval-dossiers', async (_req, res) => {
  const { rows } = await query(
    `SELECT
      cv.id,
      cv.caregiver_id,
      u.full_name,
      u.avatar_url,
      cp.headline,
      cp.bio,
      cp.languages,
      cp.years_experience,
      cp.base_hourly_rate,
      cv.status,
      cv.submitted_at,
      cv.reviewed_at,
      cv.rejection_reason,
      cp.can_work,
      COALESCE(array_agg(DISTINCT cs.service_type) FILTER (WHERE cs.id IS NOT NULL), ARRAY[]::text[]) AS service_types,
      COALESCE(array_agg(DISTINCT COALESCE(n.name, c.name, p.name)) FILTER (WHERE csz.service_zone_id IS NOT NULL), ARRAY[]::text[]) AS service_zones
     FROM caregiver_verifications cv
     JOIN users u ON u.id = cv.caregiver_id
     JOIN caregiver_profiles cp ON cp.user_id = cv.caregiver_id
     LEFT JOIN caregiver_services cs ON cs.caregiver_id = cv.caregiver_id AND cs.active
     LEFT JOIN caregiver_service_zones csz ON csz.caregiver_id = cv.caregiver_id
     LEFT JOIN service_zones sz ON sz.id = csz.service_zone_id
     LEFT JOIN neighborhoods n ON n.id = sz.neighborhood_id
     LEFT JOIN cities c ON c.id = COALESCE(sz.city_id, n.city_id)
     LEFT JOIN provinces p ON p.id = COALESCE(sz.province_id, c.province_id)
     GROUP BY cv.id, cv.caregiver_id, u.full_name, u.avatar_url, cp.headline, cp.bio, cp.languages, cp.years_experience, cp.base_hourly_rate, cv.status, cv.submitted_at, cv.reviewed_at, cv.rejection_reason, cp.can_work
     ORDER BY CASE WHEN cv.status = 'pending' THEN 0 WHEN cv.status = 'approved' THEN 1 ELSE 2 END, cv.updated_at DESC`,
  )

  const dossiers = await Promise.all(
    rows.map(async (row) => {
      const snapshot = await getCaregiverApplicationSnapshot(row.caregiver_id)
      return {
        id: row.id,
        caregiverId: row.caregiver_id,
        caregiverName: row.full_name,
        caregiverAvatar: snapshot.facePhotoUrl ?? row.avatar_url,
        status: row.status,
        canWork: row.can_work,
        roleFit: row.headline,
        aiDecision: row.status === 'approved' ? 'recommended' : row.status === 'rejected' ? 'reject' : 'manual-review',
        aiConfidence: row.status === 'approved' ? 0.96 : row.status === 'rejected' ? 0.93 : 0.81,
        aiSummary:
          row.status === 'approved'
            ? 'Documentacion validada y perfil apto.'
            : row.status === 'rejected'
              ? row.rejection_reason || 'Solicitud rechazada. Revisa el comentario del admin.'
              : 'Expediente pendiente de revision adicional.',
        flags: [
          row.status === 'approved' ? 'OTP verificado' : null,
          row.rejection_reason ? 'Tiene rechazo previo documentado' : null,
          !snapshot.hasRequiredDocuments ? 'Faltan documentos' : null,
        ].filter(Boolean),
        stepStatuses: [
          {
            id: 'doc',
            title: 'Documentos',
            description: 'Revision documental',
            status: snapshot.hasRequiredDocuments ? (row.status === 'approved' ? 'approved' : row.status === 'rejected' ? 'rejected' : 'pending') : 'pending',
          },
          {
            id: 'face',
            title: 'Foto facial',
            description: 'Foto del rostro obligatoria',
            status: snapshot.documents.some((item) => item.documentType === 'face_photo')
              ? row.status === 'approved'
                ? 'approved'
                : row.status === 'rejected'
                  ? 'rejected'
                  : 'pending'
              : 'pending',
          },
          {
            id: 'otp',
            title: 'OTP',
            description: 'Validacion email y SMS',
            status: row.status === 'approved' ? 'approved' : row.status === 'rejected' ? 'rejected' : 'pending',
          },
        ],
        documents: snapshot.documents.map((item) => item.label),
        rejectionReason: row.rejection_reason ?? undefined,
        previousRejectionReason: row.rejection_reason ?? undefined,
        submittedAt: row.submitted_at ? formatDateLabel(row.submitted_at) : undefined,
        reviewedAt: row.reviewed_at ? formatDateLabel(row.reviewed_at) : undefined,
        profileSummary: {
          headline: row.headline,
          bio: row.bio,
          languages: row.languages ?? [],
          yearsExperience: Number(row.years_experience ?? 0),
          pricePerHour: formatCurrencyValue(row.base_hourly_rate),
          serviceZones: row.service_zones ?? [],
          serviceTypes: row.service_types ?? [],
        },
        documentItems: snapshot.documents.map((item) => ({
          ...item,
          fileUrl: item.fileUrl ? new URL(item.fileUrl, `${_req.protocol}://${_req.get('host')}`).toString() : undefined,
          uploadedAt: item.uploadedAt ? formatDateLabel(item.uploadedAt) : undefined,
        })),
      }
    }),
  )

  res.json(dossiers)
})

app.post('/api/admin/approval-dossiers/:id/decision', async (req, res) => {
  const { decision, reason } = req.body ?? {}
  const dossier = await query(`SELECT caregiver_id, rejection_reason FROM caregiver_verifications WHERE id = $1`, [req.params.id])
  if (!dossier.rows[0]) {
    return res.status(404).json({ message: 'Expediente no encontrado.' })
  }

  const isRemovalRequest = String(dossier.rows[0].rejection_reason ?? '').includes('Solicitud de eliminar servicio')

  if (decision === 'approve' && isRemovalRequest) {
    await query(`SELECT delete_user_account($1)`, [dossier.rows[0].caregiver_id])
    return res.json({ ok: true })
  }

  const status = decision === 'approve' ? 'approved' : decision === 'suspend' ? 'rejected' : 'rejected'
  const rejectionReason =
    decision === 'approve'
      ? null
      : reason?.trim() || (decision === 'suspend' ? 'Servicio suspendido a solicitud del cuidador.' : 'Solicitud rechazada por revision admin.')
  await query(
    `UPDATE caregiver_verifications
     SET status = $2, reviewed_at = now(), rejection_reason = $3
     WHERE id = $1`,
    [req.params.id, status, rejectionReason],
  )
  await query(
    `UPDATE verification_documents
     SET status = $2,
         ai_summary = $3
     WHERE verification_id = $1`,
    [
      req.params.id,
      decision === 'approve' ? 'approved' : 'rejected',
      decision === 'approve'
        ? 'Documento aceptado por revision admin.'
        : rejectionReason ?? 'Documento rechazado por revision admin.',
    ],
  )
  await query(`UPDATE caregiver_profiles SET verified_status = $2, can_work = $3 WHERE user_id = $1`, [
    dossier.rows[0].caregiver_id,
    decision === 'approve' ? 'approved' : 'rejected',
    decision === 'approve',
  ])
  await query(
    `INSERT INTO notifications (user_id, type, title, body, data)
     VALUES ($1, 'verification', $2, $3, jsonb_build_object('verificationId', $4::text))`,
    [
      dossier.rows[0].caregiver_id,
      decision === 'approve' ? 'Solicitud aprobada' : decision === 'suspend' ? 'Servicio suspendido' : 'Solicitud rechazada',
      decision === 'approve'
        ? 'Tu solicitud para ofrecer servicios fue aprobada.'
        : rejectionReason,
      req.params.id,
    ],
  )
  res.json({ ok: true })
})

app.get('/api/admin/payment-proofs', async (req, res) => {
  const { rows } = await query(
    `SELECT
      pp.id,
      pp.booking_id,
      u.full_name AS payer,
      booking.total_amount AS expected_amount,
      pp.uploaded_at,
      pp.status,
      pp.amount,
      pp.reference_number,
      air.decision AS ai_decision,
      air.confidence AS ai_confidence,
      COALESCE(air.flags[1], air.summary) AS anomaly_label,
      reviewer.full_name AS reviewed_by,
      proof_file.public_url AS file_url,
      proof_file.original_filename
     FROM payment_proofs pp
     JOIN users u ON u.id = pp.client_id
     JOIN bookings booking ON booking.id = pp.booking_id
     LEFT JOIN LATERAL (
       SELECT ai_review_id
       FROM payment_reviews pr
       WHERE pr.payment_proof_id = pp.id
       ORDER BY pr.created_at DESC
       LIMIT 1
     ) latest_review ON true
     LEFT JOIN ai_reviews air ON air.id = latest_review.ai_review_id
     LEFT JOIN users reviewer ON reviewer.id = pp.reviewed_by
     LEFT JOIN LATERAL (
       SELECT f.public_url, f.original_filename
       FROM payment_proof_files ppf
       JOIN files f ON f.id = ppf.file_id
       WHERE ppf.payment_proof_id = pp.id
       ORDER BY ppf.created_at DESC
       LIMIT 1
     ) proof_file ON true
     ORDER BY pp.uploaded_at DESC`,
  )

  res.json(
    rows.map((row) => ({
      id: row.id,
      bookingId: row.booking_id,
      payer: row.payer,
      uploadedAt: formatDateLabel(row.uploaded_at),
      status: mapPaymentProofStatus(row.status),
      amount: formatCurrencyValue(row.amount),
      expectedAmount: formatCurrencyValue(row.expected_amount),
      referenceNumber: row.reference_number,
      expectedReferenceCode: buildPaymentReferenceCode(row.booking_id),
      aiDecision: row.ai_decision ? mapAiDecision(row.ai_decision) : 'manual-review',
      aiConfidence: Number(row.ai_confidence ?? 0),
      anomaly: row.anomaly_label ?? 'Sin anomalías',
      reviewedBy: row.reviewed_by ?? 'Pendiente',
      fileUrl: toAbsoluteUrl(req, row.file_url),
      fileName: row.original_filename,
    })),
  )
})

app.post('/api/admin/payment-proofs/:id/decision', async (req, res) => {
  const { decision } = req.body ?? {}
  const nextStatus = decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : 'pending_review'
  await query(`UPDATE payment_proofs SET status = $2, reviewed_at = now() WHERE id = $1`, [req.params.id, nextStatus])
  res.json({ ok: true })
})

app.get('/api/admin/support-tickets', async (_req, res) => {
  const { rows } = await query(
    `SELECT st.id, requester.full_name AS requester, st.topic, st.channel, st.sla_label, st.status
     FROM support_tickets st
     JOIN users requester ON requester.id = st.requester_id
     ORDER BY st.created_at DESC`,
  )
  res.json(
    rows.map((row) => ({
      id: row.id,
      requester: row.requester,
      topic: row.topic,
      channel: row.channel,
      sla: row.sla_label ?? 'Sin SLA',
      status: row.status,
    })),
  )
})

app.get('/api/admin/fraud-alerts', async (_req, res) => {
  const { rows } = await query(
    `SELECT id, title, risk_level, location_label, detail
     FROM fraud_alerts
     ORDER BY created_at DESC`,
  )
  res.json(
    rows.map((row) => ({
      id: row.id,
      label: row.title,
      risk: row.risk_level,
      location: row.location_label ?? 'Sin ubicacion',
      detail: row.detail,
    })),
  )
})

app.get('/api/admin/audit-logs', async (_req, res) => {
  const { rows } = await query(
    `SELECT al.id, COALESCE(u.full_name, 'Sistema') AS actor, al.action, al.target_type, al.metadata, al.created_at
     FROM audit_logs al
     LEFT JOIN users u ON u.id = al.actor_id
     ORDER BY al.created_at DESC`,
  )
  res.json(
    rows.map((row) => ({
      id: row.id,
      actor: row.actor,
      action: row.action,
      target: row.metadata?.target ?? row.target_type,
      timestamp: formatDateLabel(row.created_at),
    })),
  )
})

app.get('/api/admin/content', async (_req, res) => {
  const { rows } = await query(
    `SELECT id, title, section, status, body
     FROM content_pages
     ORDER BY updated_at DESC`,
  )
  res.json(
    rows.map((row) => ({
      id: row.id,
      title: row.title,
      section: row.section,
      status: row.status,
      body: row.body,
    })),
  )
})

app.post('/api/admin/content/:id', async (req, res) => {
  const { title, section, status, body } = req.body ?? {}
  await query(
    `UPDATE content_pages
     SET title = $2,
         section = $3,
         status = $4,
         body = $5,
         updated_at = now()
     WHERE id = $1`,
    [req.params.id, title, section, status, body],
  )

  res.json({ ok: true })
})

app.get('/api/admin/platform-settings', async (_req, res) => {
  const defaults = {
    verificationSlaHours: 6,
    supportPremiumEnabled: true,
    paymentAiEnabled: true,
    pushNotificationsEnabled: true,
  }

  const { rows } = await query(
    `SELECT key, value
     FROM platform_settings
     WHERE key = ANY($1::text[])`,
    [['verificationSlaHours', 'supportPremiumEnabled', 'paymentAiEnabled', 'pushNotificationsEnabled']],
  )

  const settings = rows.reduce((accumulator, row) => {
    accumulator[row.key] = row.value
    return accumulator
  }, {})

  res.json({
    verificationSlaHours: Number(settings.verificationSlaHours ?? defaults.verificationSlaHours),
    supportPremiumEnabled: settings.supportPremiumEnabled ?? defaults.supportPremiumEnabled,
    paymentAiEnabled: settings.paymentAiEnabled ?? defaults.paymentAiEnabled,
    pushNotificationsEnabled: settings.pushNotificationsEnabled ?? defaults.pushNotificationsEnabled,
  })
})

app.post('/api/admin/platform-settings', async (req, res) => {
  const {
    verificationSlaHours,
    supportPremiumEnabled,
    paymentAiEnabled,
    pushNotificationsEnabled,
    updatedBy,
  } = req.body ?? {}

  const entries = [
    ['verificationSlaHours', verificationSlaHours],
    ['supportPremiumEnabled', supportPremiumEnabled],
    ['paymentAiEnabled', paymentAiEnabled],
    ['pushNotificationsEnabled', pushNotificationsEnabled],
  ]

  await withTransaction(async (client) => {
    for (const [key, value] of entries) {
      await client.query(
        `INSERT INTO platform_settings (key, value, updated_by)
         VALUES ($1, $2::jsonb, $3)
         ON CONFLICT (key) DO UPDATE
         SET value = $2::jsonb,
             updated_by = $3,
             updated_at = now()`,
        [key, JSON.stringify(value), updatedBy ?? null],
      )
    }
  })

  res.json({ ok: true })
})

app.post('/api/admin/backups', async (_req, res) => {
  const { rows } = await query(
    `INSERT INTO daily_backups (scope, status, started_at, completed_at, size_bytes)
     VALUES ('Backup manual', 'ready', now(), now(), 10485760)
     RETURNING id`,
  )
  res.status(201).json({ id: rows[0].id, ok: true })
})

app.get('/api/reports', async (_req, res) => {
  const { rows } = await query(
    `SELECT id, subject, report_type, category, urgency, priority, status, public_status, description
     FROM reports
     ORDER BY created_at DESC`,
  )
  res.json(
    rows.map((row) => ({
      id: row.id,
      subject: row.subject,
      type: row.report_type,
      category: row.category,
      urgency: row.urgency,
      priority: row.priority,
      description: row.description,
      status:
        row.status === 'resolved'
          ? 'resolved'
          : row.status === 'investigating' || row.public_status === 'in_transit'
            ? 'investigating'
            : 'open',
    })),
  )
})

app.post('/api/reports', async (req, res) => {
  const { reporterId, bookingId, caregiverId, category, urgency, subject, description } = req.body ?? {}
  if (!reporterId || !category || !urgency || !subject || !description) {
    return res.status(400).json({ message: 'Faltan datos para enviar el reporte.' })
  }

  const priority = urgency === 'urgent' ? 'high' : urgency === 'notice' ? 'medium' : 'low'
  const { rows } = await query(
    `INSERT INTO reports (
      reporter_id, booking_id, caregiver_id, report_type, category, urgency, priority, subject, description, status, public_status
     )
     VALUES ($1, $2, $3, 'servicio', $4, $5, $6, $7, $8, 'pending', 'pending')
     RETURNING id`,
    [reporterId, bookingId ?? null, caregiverId ?? null, category, urgency, priority, subject, description],
  )

  await query(
    `INSERT INTO notifications (user_id, type, title, body, data)
     SELECT user_id, 'report', 'Nuevo reporte recibido', $1, jsonb_build_object('reportId', $2::text)
     FROM admin_profiles`,
    [`Se recibio el reporte: ${subject}.`, rows[0].id],
  )

  res.status(201).json({ id: rows[0].id, ok: true })
})

app.post('/api/reports/:id/status', async (req, res) => {
  const { status } = req.body ?? {}
  const statusMap = {
    pendiente: { internal: 'pending', public: 'pending' },
    'en transito': { internal: 'in_transit', public: 'in_transit' },
    resuelto: { internal: 'resolved', public: 'resolved' },
  }
  const mapped = statusMap[status] ?? statusMap.pendiente
  await query(
    `UPDATE reports
     SET status = $2, public_status = $3, updated_at = now()
     WHERE id = $1`,
    [req.params.id, mapped.internal, mapped.public],
  )
  res.json({ ok: true })
})

app.get('/api/social/posts', async (_req, res) => {
  const { rows } = await query(
    `SELECT sp.id, sp.body, sp.visibility, sp.like_count, sp.comment_count, sp.created_at, u.full_name, u.role, u.avatar_url
     FROM social_posts sp
     JOIN users u ON u.id = sp.author_id
     ORDER BY sp.created_at DESC`,
  )
  res.json(
    rows.map((row) => ({
      id: row.id,
      author: row.full_name,
      authorRole: row.role,
      avatar: row.avatar_url,
      time: formatDateLabel(row.created_at),
      content: row.body,
      likes: row.like_count,
      comments: row.comment_count,
      visibility: row.visibility,
    })),
  )
})

app.get('/api/service-updates/hourly', async (req, res) => {
  const bookingId = req.query.bookingId ?? '88888888-8888-8888-8888-888888888881'
  const { rows } = await query(
    `SELECT hu.id, hu.hour_number, u.full_name, hu.summary, hu.status
     FROM hourly_service_updates hu
     JOIN users u ON u.id = hu.caregiver_id
     WHERE hu.booking_id = $1
     ORDER BY hu.hour_number ASC`,
    [bookingId],
  )
  res.json(
    rows.map((row) => ({
      id: row.id,
      hourLabel: `${row.hour_number}:00`,
      author: row.full_name,
      summary: row.summary,
      evidenceLabel: `Registro de hora ${row.hour_number}`,
      status: row.status,
    })),
  )
})

app.get('/api/shift-log', async (req, res) => {
  const { bookingId } = req.query
  if (!bookingId) {
    return res.status(400).json({ message: 'bookingId es requerido.' })
  }

  const { rows } = await query(
    `SELECT
      bc.booking_id,
      u.full_name AS caregiver_name,
      bc.check_in_at,
      bc.check_out_at,
      bc.status
     FROM booking_checkins bc
     JOIN users u ON u.id = bc.caregiver_id
     WHERE bc.booking_id = $1`,
    [bookingId],
  )

  const row = rows[0]
  if (!row) {
    return res.json(null)
  }

  res.json({
    ...mapShiftLogRow(row),
  })
})

app.post('/api/shift-log/check-in', async (req, res) => {
  const { bookingId, caregiverId } = req.body ?? {}
  if (!bookingId || !caregiverId) {
    return res.status(400).json({ message: 'bookingId y caregiverId son requeridos.' })
  }

  await withTransaction(async (client) => {
    await client.query(
      `INSERT INTO booking_checkins (booking_id, caregiver_id, check_in_at, status)
       VALUES ($1, $2, now(), 'in-progress')
       ON CONFLICT (booking_id) DO UPDATE SET
         caregiver_id = EXCLUDED.caregiver_id,
         check_in_at = COALESCE(booking_checkins.check_in_at, now()),
         status = 'in-progress'`,
      [bookingId, caregiverId],
    )

    await client.query(
      `UPDATE bookings
       SET status = 'in_progress'
       WHERE id = $1 AND status IN ('confirmed', 'requested')`,
      [bookingId],
    )
  })

  const { rows } = await query(
    `SELECT
      bc.booking_id,
      u.full_name AS caregiver_name,
      bc.check_in_at,
      bc.check_out_at,
      bc.status
     FROM booking_checkins bc
     JOIN users u ON u.id = bc.caregiver_id
     WHERE bc.booking_id = $1`,
    [bookingId],
  )

  return res.json(mapShiftLogRow(rows[0]))
})

app.post('/api/shift-log/check-out', async (req, res) => {
  const { bookingId, caregiverId } = req.body ?? {}
  if (!bookingId || !caregiverId) {
    return res.status(400).json({ message: 'bookingId y caregiverId son requeridos.' })
  }

  await withTransaction(async (client) => {
    await client.query(
      `INSERT INTO booking_checkins (booking_id, caregiver_id, check_in_at, check_out_at, status)
       VALUES ($1, $2, now(), now(), 'checked-out')
       ON CONFLICT (booking_id) DO UPDATE SET
         caregiver_id = EXCLUDED.caregiver_id,
         check_out_at = now(),
         status = 'checked-out'`,
      [bookingId, caregiverId],
    )

    await client.query(
      `UPDATE bookings
       SET status = 'completed'
       WHERE id = $1`,
      [bookingId],
    )
  })

  const { rows } = await query(
    `SELECT
      bc.booking_id,
      u.full_name AS caregiver_name,
      bc.check_in_at,
      bc.check_out_at,
      bc.status
     FROM booking_checkins bc
     JOIN users u ON u.id = bc.caregiver_id
     WHERE bc.booking_id = $1`,
    [bookingId],
  )

  return res.json(mapShiftLogRow(rows[0]))
})

app.get('/api/admin/backups', async (_req, res) => {
  const { rows } = await query(
    `SELECT id, created_at, scope, status, size_bytes FROM daily_backups ORDER BY created_at DESC`,
  )
  res.json(
    rows.map((row) => ({
      id: row.id,
      generatedAt: formatDateLabel(row.created_at),
      scope: row.scope,
      status: row.status === 'processing' ? 'in-progress' : row.status,
      size: `${Math.round(Number(row.size_bytes ?? 0) / 1024 / 1024)} MB`,
    })),
  )
})

app.get('/api/caregiver/verification-steps', async (req, res) => {
  const caregiverId = req.query.caregiverId
  const { rows } = await query(
    `SELECT status, email_otp_verified, sms_otp_verified, face_photo_verified
     FROM caregiver_verifications
     WHERE caregiver_id = $1`,
    [caregiverId],
  )

  const verification = rows[0]
  if (!verification) {
    return res.json([
      { id: 'docs', title: 'Documentos', description: 'Pendiente de carga', status: 'pending' },
      { id: 'face', title: 'Foto facial', description: 'Pendiente', status: 'pending' },
      { id: 'otp', title: 'OTP', description: 'Pendiente', status: 'pending' },
    ])
  }

  res.json([
    {
      id: 'docs',
      title: 'Documentos',
      description: 'Cedula, curriculum y hoja de vida',
      status: verification.status === 'approved' ? 'approved' : 'pending',
    },
    {
      id: 'face',
      title: 'Foto facial',
      description: 'Validacion biometrica',
      status: verification.face_photo_verified ? 'approved' : 'pending',
    },
    {
      id: 'otp',
      title: 'OTP',
      description: 'Verificacion de email y SMS',
      status: verification.email_otp_verified && verification.sms_otp_verified ? 'approved' : 'pending',
    },
  ])
})

app.get('/api/caregiver/application-status', async (req, res) => {
  const { caregiverId } = req.query
  if (!caregiverId) {
    return res.status(400).json({ message: 'caregiverId es requerido.' })
  }

  const snapshot = await getCaregiverApplicationSnapshot(caregiverId)
  const verificationStatus = snapshot.verification?.status ?? 'draft'

  res.json({
    verificationId: snapshot.verification?.id,
    status: verificationStatus,
    canOfferServices: verificationStatus === 'approved',
    hasRequiredDocuments: snapshot.hasRequiredDocuments,
    missingDocuments: snapshot.missingDocuments,
    submittedAt: snapshot.verification?.submitted_at ? formatDateInputValue(snapshot.verification.submitted_at) : undefined,
    reviewedAt: snapshot.verification?.reviewed_at ? formatDateInputValue(snapshot.verification.reviewed_at) : undefined,
    rejectionReason: snapshot.verification?.rejection_reason ?? undefined,
    previousRejectionReason: snapshot.verification?.rejection_reason ?? undefined,
    facePhotoUrl: snapshot.facePhotoUrl ? toAbsoluteUrl(req, snapshot.facePhotoUrl) : undefined,
    adminAlerts:
      snapshot.hasRequiredDocuments
        ? verificationStatus === 'pending'
          ? ['Tu expediente ya esta en revision por admin e IA.']
          : verificationStatus === 'rejected' && snapshot.verification?.rejection_reason
            ? [snapshot.verification.rejection_reason]
            : []
        : ['No se pudo revisar tu expediente porque faltan documentos obligatorios.'],
    aiSummary:
      verificationStatus === 'approved'
        ? 'Tu perfil ya esta aprobado para ofrecer servicios.'
        : verificationStatus === 'rejected' && snapshot.verification?.rejection_reason
          ? snapshot.verification.rejection_reason
        : snapshot.hasRequiredDocuments
          ? 'Tu expediente puede enviarse a revision en cuanto completes tus datos.'
          : 'Sube primero los documentos obligatorios para activar la revision.',
    documents: snapshot.documents.map((document) => ({
      ...document,
      fileUrl: document.fileUrl ? toAbsoluteUrl(req, document.fileUrl) : undefined,
      uploadedAt: document.uploadedAt ? formatDateInputValue(document.uploadedAt) : undefined,
    })),
  })
})

app.post('/api/caregiver/documents', caregiverDocumentUpload.single('file'), async (req, res) => {
  const { caregiverId, documentType } = req.body ?? {}
  if (!caregiverId || !documentType) {
    return res.status(400).json({ message: 'caregiverId y documentType son requeridos.' })
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Debes adjuntar un archivo.' })
  }

  const verification = await query(
    `INSERT INTO caregiver_verifications (caregiver_id, status)
     VALUES ($1, 'pending')
     ON CONFLICT (caregiver_id) DO UPDATE SET caregiver_id = EXCLUDED.caregiver_id
     RETURNING id`,
    [caregiverId],
  )

  const publicUrl = toCaregiverDocumentPublicUrl(req.file.filename)
  const storageKey = `caregiver-documents/${req.file.filename}`
  const checksum = crypto.createHash('sha256').update(req.file.filename).digest('hex')

  const result = await withTransaction(async (client) => {
    const fileResult = await client.query(
      `INSERT INTO files (
        owner_user_id, document_type, storage_key, public_url, original_filename, mime_type, file_size_bytes, sha256_hash
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id`,
      [caregiverId, documentType, storageKey, publicUrl, req.file.originalname, req.file.mimetype, req.file.size, checksum],
    )

    await client.query(
      `DELETE FROM verification_documents
       WHERE verification_id = $1
         AND document_type = $2`,
      [verification.rows[0].id, documentType],
    )

    const documentResult = await client.query(
      `INSERT INTO verification_documents (verification_id, file_id, document_type, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING id`,
      [verification.rows[0].id, fileResult.rows[0].id, documentType],
    )

    if (documentType === 'face_photo') {
      await client.query(
        `UPDATE users
         SET avatar_url = $2
         WHERE id = $1`,
        [caregiverId, publicUrl],
      )
      await client.query(
        `UPDATE caregiver_profiles
         SET profile_image_url = $2
         WHERE user_id = $1`,
        [caregiverId, publicUrl],
      )
    }

    await client.query(
      `UPDATE caregiver_verifications
       SET status = CASE WHEN status = 'approved' THEN 'pending' ELSE status END,
           updated_at = now()
       WHERE caregiver_id = $1`,
      [caregiverId],
    )

    await client.query(
      `INSERT INTO notifications (user_id, type, title, body, data)
       SELECT user_id, 'verification', 'Nuevo documento para revision', $1, jsonb_build_object('caregiverId', $2::text, 'verificationId', $3::text)
       FROM admin_profiles`,
      [`El cuidador subio ${getDocumentLabel(documentType)} y requiere revision.`, caregiverId, verification.rows[0].id],
    )

    return { documentId: documentResult.rows[0].id }
  })

  res.status(201).json({ ok: true, documentId: result.documentId, fileUrl: toAbsoluteUrl(req, publicUrl) })
})

app.post('/api/caregiver/verification', async (req, res) => {
  const { caregiverId, idNumber } = req.body ?? {}
  await query(
    `INSERT INTO caregiver_verifications (
      caregiver_id, status, national_id_number, email_otp_verified, sms_otp_verified, face_photo_verified, submitted_at
     )
     VALUES ($1, 'pending', $2, true, true, true, now())
     ON CONFLICT (caregiver_id) DO UPDATE SET
      status = 'pending',
      national_id_number = EXCLUDED.national_id_number,
      email_otp_verified = true,
      sms_otp_verified = true,
      face_photo_verified = true,
      submitted_at = now()`,
    [caregiverId, idNumber],
  )

  res.json({ ok: true })
})

app.post('/api/caregiver/apply', async (req, res) => {
  const { caregiverId, idNumber } = req.body ?? {}
  if (!caregiverId || !idNumber?.trim()) {
    return res.status(400).json({ message: 'caregiverId e idNumber son requeridos.' })
  }

  const snapshot = await getCaregiverApplicationSnapshot(caregiverId)
  if (!snapshot.hasRequiredDocuments) {
    return res.status(422).json({
      message: 'No se pudo revisar tu expediente porque faltan documentos obligatorios.',
      missingDocuments: snapshot.missingDocuments,
    })
  }

  const verificationResult = await query(
    `INSERT INTO caregiver_verifications (
      caregiver_id, status, national_id_number, email_otp_verified, sms_otp_verified, face_photo_verified, submitted_at
     )
     VALUES ($1, 'pending', $2, true, true, true, now())
     ON CONFLICT (caregiver_id) DO UPDATE SET
      status = 'pending',
      national_id_number = EXCLUDED.national_id_number,
      email_otp_verified = true,
      sms_otp_verified = true,
      face_photo_verified = true,
      submitted_at = now()
     RETURNING id`,
    [caregiverId, idNumber.trim()],
  )

  await query(`UPDATE caregiver_profiles SET can_work = false, verified_status = 'pending' WHERE user_id = $1`, [caregiverId])
  await query(
    `INSERT INTO app_jobs (job_type, status, run_at, payload)
     VALUES ('caregiver_application_review', 'queued', now(), $1)`,
    [JSON.stringify({ caregiverId, verificationId: verificationResult.rows[0].id })],
  )
  await query(
    `INSERT INTO notifications (user_id, type, title, body, data)
     SELECT user_id, 'verification', 'Nueva postulacion de cuidador', $1, jsonb_build_object('caregiverId', $2::text, 'verificationId', $3::text)
     FROM admin_profiles`,
    ['Se recibio una nueva solicitud para ofrecer servicios y ya quedo lista para revision inmediata.', caregiverId, verificationResult.rows[0].id],
  )

  res.json({ ok: true, missingDocuments: [] })
})

app.post('/api/caregiver/application/cancel', async (req, res) => {
  const { caregiverId } = req.body ?? {}
  if (!caregiverId) {
    return res.status(400).json({ message: 'caregiverId es requerido.' })
  }

  await query(
    `UPDATE caregiver_verifications
     SET status = 'draft', submitted_at = NULL, updated_at = now()
     WHERE caregiver_id = $1 AND status = 'pending'`,
    [caregiverId],
  )

  res.json({ ok: true })
})

app.post('/api/caregiver/service-removal-request', async (req, res) => {
  const { caregiverId } = req.body ?? {}
  if (!caregiverId) {
    return res.status(400).json({ message: 'caregiverId es requerido.' })
  }

  await withTransaction(async (client) => {
    await client.query(
      `UPDATE caregiver_profiles
       SET can_work = false, verified_status = 'pending'
       WHERE user_id = $1`,
      [caregiverId],
    )
    await client.query(
      `UPDATE caregiver_verifications
       SET status = 'pending', rejection_reason = 'Solicitud de eliminar servicio pendiente de aprobacion admin.', submitted_at = now(), updated_at = now()
       WHERE caregiver_id = $1`,
      [caregiverId],
    )
    await client.query(
      `INSERT INTO notifications (user_id, type, title, body, data)
       SELECT user_id, 'verification', 'Solicitud para eliminar servicio', $1, jsonb_build_object('caregiverId', $2::text)
       FROM admin_profiles`,
      ['Un cuidador solicito retirar su servicio y suspender su visibilidad.', caregiverId],
    )
  })

  res.json({ ok: true })
})

app.get('/api/reviews', async (_req, res) => {
  const { rows } = await query(
    `SELECT r.id, client.full_name AS author, caregiver.full_name AS caregiver_name, r.rating, r.created_at, r.comment
     FROM reviews r
     JOIN users client ON client.id = r.client_id
     JOIN users caregiver ON caregiver.id = r.caregiver_id
     ORDER BY r.created_at DESC`,
  )
  res.json(
    rows.map((row) => ({
      id: row.id,
      author: row.author,
      caregiverName: row.caregiver_name,
      rating: row.rating,
      date: formatDateLabel(row.created_at),
      comment: row.comment,
    })),
  )
})

app.post('/api/reviews', async (req, res) => {
  const { bookingId, clientId, caregiverId, rating, comment } = req.body ?? {}
  const { rows } = await query(
    `INSERT INTO reviews (booking_id, client_id, caregiver_id, rating, comment, public)
     VALUES ($1, $2, $3, $4, $5, true)
     ON CONFLICT (booking_id) DO UPDATE SET
       rating = EXCLUDED.rating,
       comment = EXCLUDED.comment
     RETURNING id`,
    [bookingId, clientId, caregiverId, rating, comment],
  )
  res.status(201).json({ id: rows[0].id, ok: true })
})

app.get('/api/payment-history', async (req, res) => {
  const { clientId } = req.query
  const { rows } = await query(
    `SELECT ph.id, ph.paid_at, caregiver.full_name AS caregiver_name, ph.amount, ph.method, ph.status
     FROM payment_history ph
     LEFT JOIN users caregiver ON caregiver.id = ph.caregiver_id
     WHERE ph.client_id = $1
     ORDER BY ph.paid_at DESC`,
    [clientId],
  )
  res.json(
    rows.map((row) => ({
      id: row.id,
      date: formatDateLabel(row.paid_at),
      caregiverName: row.caregiver_name ?? 'Sin asignar',
      amount: formatCurrencyValue(row.amount),
      method: row.method,
      status: row.status,
    })),
  )
})

app.get('/api/caregiver/earnings', async (req, res) => {
  const { caregiverId } = req.query
  if (!caregiverId) {
    return res.status(400).json({ message: 'caregiverId es requerido.' })
  }

  const { rows } = await query(
      `SELECT
        ph.id,
        ph.booking_id,
        ph.paid_at,
        ph.amount,
        ph.method,
        ph.reference_number,
        ph.status AS payment_status,
        client.full_name AS client_name,
        pp.id AS payment_proof_id,
        pp.status AS proof_status,
        air.decision AS ai_decision,
        reviewer.full_name AS reviewed_by,
        proof_file.public_url AS file_url,
        proof_file.original_filename
       FROM payment_history ph
       JOIN users client ON client.id = ph.client_id
       LEFT JOIN payment_proofs pp ON pp.booking_id = ph.booking_id AND pp.client_id = ph.client_id
       LEFT JOIN LATERAL (
         SELECT ai_review_id
         FROM payment_reviews pr
         WHERE pr.payment_proof_id = pp.id
         ORDER BY pr.created_at DESC
         LIMIT 1
       ) latest_review ON true
       LEFT JOIN ai_reviews air ON air.id = latest_review.ai_review_id
       LEFT JOIN users reviewer ON reviewer.id = pp.reviewed_by
       LEFT JOIN LATERAL (
         SELECT f.public_url, f.original_filename
         FROM payment_proof_files ppf
         JOIN files f ON f.id = ppf.file_id
         WHERE ppf.payment_proof_id = pp.id
         ORDER BY ppf.created_at DESC
         LIMIT 1
       ) proof_file ON true
       WHERE ph.caregiver_id = $1
         AND ph.status IN ('paid', 'pending-review', 'rejected')
       ORDER BY ph.paid_at DESC`,
      [caregiverId],
    )

  const dailyMap = new Map()
  let totalReceived = 0
  let todayReceived = 0
  const todayLabel = formatDateInputValue(new Date())

  for (const row of rows) {
    const dateLabel = formatDateInputValue(row.paid_at)
    const amount = formatCurrencyValue(row.amount)
    const countsTowardEarnings = row.payment_status !== 'rejected' && row.proof_status !== 'rejected'
    if (countsTowardEarnings) {
      totalReceived += amount
      if (dateLabel === todayLabel) {
        todayReceived += amount
      }
      dailyMap.set(dateLabel, (dailyMap.get(dateLabel) ?? 0) + amount)
    }
  }

  res.json({
    totalReceived,
    totalProofs: rows.length,
    todayReceived,
    daily: [...dailyMap.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([label, amount]) => ({ label, amount })),
      payments: rows.map((row) => ({
        id: row.id,
        proofId: row.payment_proof_id ?? undefined,
        bookingId: row.booking_id,
        date: formatDateLabel(row.paid_at),
        clientName: row.client_name,
        amount: formatCurrencyValue(row.amount),
        method: row.method,
        referenceNumber: row.reference_number ?? undefined,
        expectedReferenceCode: buildPaymentReferenceCode(row.booking_id),
        status: row.proof_status ? mapPaymentProofStatus(row.proof_status) : undefined,
        aiDecision: row.ai_decision ? mapAiDecision(row.ai_decision) : undefined,
        reviewedBy: row.reviewed_by ?? 'Pendiente',
        fileUrl: toAbsoluteUrl(req, row.file_url),
        fileName: row.original_filename ?? undefined,
      })),
    })
  })

app.get('/api/payment-proofs', async (req, res) => {
  const { clientId } = req.query
  if (!clientId) {
    return res.status(400).json({ message: 'clientId es requerido.' })
  }

  const { rows } = await query(
    `SELECT
      pp.id,
      pp.booking_id,
      u.full_name AS payer,
      pp.uploaded_at,
      pp.status,
      pp.amount,
      pp.method,
      pp.reference_number,
      booking.total_amount AS expected_amount,
      air.decision AS ai_decision,
      air.confidence AS ai_confidence,
      COALESCE(air.flags[1], air.summary, 'Pendiente de revision') AS anomaly,
      reviewer.full_name AS reviewed_by,
      proof_file.public_url AS file_url,
      proof_file.original_filename
     FROM payment_proofs pp
     JOIN users u ON u.id = pp.client_id
     JOIN bookings booking ON booking.id = pp.booking_id
     LEFT JOIN LATERAL (
       SELECT ai_review_id
       FROM payment_reviews pr
       WHERE pr.payment_proof_id = pp.id
       ORDER BY pr.created_at DESC
       LIMIT 1
     ) latest_review ON true
     LEFT JOIN ai_reviews air ON air.id = latest_review.ai_review_id
     LEFT JOIN users reviewer ON reviewer.id = pp.reviewed_by
     LEFT JOIN LATERAL (
       SELECT f.public_url, f.original_filename
       FROM payment_proof_files ppf
       JOIN files f ON f.id = ppf.file_id
       WHERE ppf.payment_proof_id = pp.id
       ORDER BY ppf.created_at DESC
       LIMIT 1
     ) proof_file ON true
     WHERE pp.client_id = $1
     ORDER BY pp.uploaded_at DESC`,
    [clientId],
  )

  res.json(
    rows.map((row) => ({
      id: row.id,
      bookingId: row.booking_id,
      payer: row.payer,
      uploadedAt: formatDateLabel(row.uploaded_at),
      status: mapPaymentProofStatus(row.status),
      amount: formatCurrencyValue(row.amount),
      expectedAmount: formatCurrencyValue(row.expected_amount),
      method: row.method,
      referenceNumber: row.reference_number,
      expectedReferenceCode: buildPaymentReferenceCode(row.booking_id),
      aiDecision: row.ai_decision ? mapAiDecision(row.ai_decision) : 'manual-review',
      aiConfidence: Number(row.ai_confidence ?? 0),
      anomaly: row.anomaly,
      reviewedBy: row.reviewed_by ?? 'Pendiente',
      fileUrl: toAbsoluteUrl(req, row.file_url),
      fileName: row.original_filename,
    })),
  )
})

app.post('/api/payment-proofs', upload.single('receipt'), async (req, res) => {
  const { bookingId, clientId, amount, referenceNumber } = req.body ?? {}
  if (!bookingId || !clientId || !amount || !referenceNumber?.trim()) {
    return res.status(400).json({ message: 'Faltan datos para registrar el comprobante.' })
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Debes adjuntar la foto o PDF del comprobante.' })
  }

  const bookingResult = await query(
    `SELECT b.caregiver_id, b.total_amount, b.total_hours, u.full_name AS client_name
     FROM bookings b
     JOIN users u ON u.id = b.client_id
     WHERE b.id = $1 AND b.client_id = $2`,
    [bookingId, clientId],
  )

  const booking = bookingResult.rows[0]
  if (!booking) {
    return res.status(404).json({ message: 'Reserva no encontrada para este cliente.' })
  }

  const normalizedAmount = normalizeMoneyValue(amount)
  const expectedAmount = normalizeMoneyValue(booking.total_amount)
  const expectedReferenceCode = buildPaymentReferenceCode(bookingId)
  const amountMatches = normalizedAmount === expectedAmount
  const referenceMatches = referenceNumber.trim().toUpperCase() === expectedReferenceCode
  const proofPublicUrl = toPublicUploadUrl(req.file.filename)
  const proofStorageKey = `payment-proofs/${req.file.filename}`
  const proofChecksum = crypto.createHash('sha256').update(req.file.filename).digest('hex')

  const result = await withTransaction(async (client) => {
    const proofResult = await client.query(
      `INSERT INTO payment_proofs (booking_id, client_id, amount, method, reference_number)
       VALUES ($1, $2, $3, 'comprobante', $4)
       RETURNING id`,
      [bookingId, clientId, normalizedAmount, referenceNumber.trim()],
    )

    const fileResult = await client.query(
      `INSERT INTO files (
        owner_user_id,
        document_type,
        storage_key,
        public_url,
        original_filename,
        mime_type,
        file_size_bytes,
        sha256_hash,
        metadata
      )
      VALUES ($1, 'payment_receipt', $2, $3, $4, $5, $6, $7, $8)
      RETURNING id`,
      [
        clientId,
        proofStorageKey,
        proofPublicUrl,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        proofChecksum,
        JSON.stringify({
          bookingId,
          paymentProofId: proofResult.rows[0].id,
          expectedPayerName: booking.client_name,
          expectedAmount,
          expectedReferenceCode,
          amountMatches,
          referenceMatches,
          ocrStatus: 'pending',
        }),
      ],
    )

    await client.query(
      `INSERT INTO payment_proof_files (payment_proof_id, file_id)
       VALUES ($1, $2)`,
      [proofResult.rows[0].id, fileResult.rows[0].id],
    )

    // Dejamos una revision preliminar para que el admin vea de inmediato si el monto y el codigo coinciden antes del OCR completo.
    const aiReviewResult = await client.query(
      `INSERT INTO ai_reviews (target_type, target_id, provider, decision, confidence, summary, flags, raw_result)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        'payment_proof',
        proofResult.rows[0].id,
        'pending-ocr',
        amountMatches && referenceMatches ? 'manual_review' : 'rejected',
        amountMatches && referenceMatches ? 0.55 : 0.92,
        amountMatches && referenceMatches
          ? 'Comprobante recibido. Pendiente verificacion OCR de nombre, monto y motivo.'
          : 'El monto o el codigo digitado no coincide con la reserva.',
        amountMatches && referenceMatches
          ? ['Pendiente OCR del nombre del pagador']
          : [
              !amountMatches ? 'Monto no coincide con la reserva' : null,
              !referenceMatches ? 'Codigo de motivo no coincide' : null,
            ].filter(Boolean),
        JSON.stringify({
          expectedPayerName: booking.client_name,
          expectedAmount,
          receivedAmount: normalizedAmount,
          expectedReferenceCode,
          receivedReferenceCode: referenceNumber.trim(),
          totalHours: Number(booking.total_hours),
          ocrStatus: 'pending',
        }),
      ],
    )

    await client.query(
      `INSERT INTO payment_reviews (payment_proof_id, ai_review_id, decision, notes)
       VALUES ($1, $2, $3, $4)`,
      [
        proofResult.rows[0].id,
        aiReviewResult.rows[0].id,
        amountMatches && referenceMatches ? 'pending_review' : 'rejected',
        amountMatches && referenceMatches
          ? 'Pendiente validacion OCR y revision operativa.'
          : 'Se detecto una inconsistencia inicial antes de la revision manual.',
      ],
    )

    await client.query(
      `INSERT INTO payment_history (booking_id, client_id, caregiver_id, amount, method, status, reference_number, metadata)
       VALUES ($1, $2, $3, $4, 'comprobante', $5, $6, $7)`,
      [
        bookingId,
        clientId,
        booking.caregiver_id,
        normalizedAmount,
        amountMatches && referenceMatches ? 'pending-review' : 'rejected',
        referenceNumber.trim(),
        JSON.stringify({
          paymentProofId: proofResult.rows[0].id,
          expectedPayerName: booking.client_name,
          expectedAmount,
          expectedReferenceCode,
          receiptFileUrl: proofPublicUrl,
          aiStage: 'pending-ocr',
        }),
      ],
    )

    await client.query(
      `INSERT INTO notifications (user_id, type, title, body, data)
       SELECT user_id, 'payment', 'Nuevo comprobante cargado', $1, jsonb_build_object('paymentProofId', $2::text)
       FROM admin_profiles`,
      [`Se subio un nuevo comprobante por ${normalizedAmount} con codigo ${expectedReferenceCode}.`, proofResult.rows[0].id],
    )

    return {
      id: proofResult.rows[0].id,
      paymentReferenceCode: expectedReferenceCode,
      amountMatches,
      referenceMatches,
      fileUrl: toAbsoluteUrl(req, proofPublicUrl),
    }
  })

  res.status(201).json({ ok: true, ...result })
})

app.get('/api/analytics/:seriesName', async (req, res) => {
  const { rows } = await query(
    `SELECT point_label, values
     FROM analytics_series_points
     WHERE series_name = $1
     ORDER BY sort_order, point_label`,
    [req.params.seriesName],
  )
  res.json(
    rows.map((row) => ({
      label: row.point_label,
      ...row.values,
    })),
  )
})

app.get('/api/caregiver/reminders', async (req, res) => {
  const { caregiverId } = req.query
  const { rows } = await query(
    `SELECT
      b.id,
      conv.id AS conversation_id,
      b.scheduled_date,
      b.start_time::text,
      b.end_time::text,
      b.service_type,
      client.full_name AS client,
      bc.check_in_at,
      bc.check_out_at
     FROM bookings b
     JOIN users client ON client.id = b.client_id
     LEFT JOIN conversations conv ON conv.booking_id = b.id
     LEFT JOIN booking_checkins bc ON bc.booking_id = b.id
     WHERE b.caregiver_id = $1
       AND b.status IN ('confirmed', 'in_progress', 'completed')
     ORDER BY b.scheduled_date ASC, b.start_time ASC
     LIMIT 5`,
    [caregiverId],
  )
  res.json(
    rows.map((row) => {
      const state = computeServiceState({
        scheduledDate: row.scheduled_date,
        endTime: row.end_time,
        checkInAt: row.check_in_at,
        checkOutAt: row.check_out_at,
      })

      return {
        id: row.id,
        conversationId: row.conversation_id ?? undefined,
        date: formatDateLabel(row.scheduled_date),
        dateRaw: formatDateInputValue(row.scheduled_date),
        time: row.start_time.slice(0, 5),
        service: row.service_type,
        client: row.client,
        status: state,
        statusLabel: describeServiceState(state, row.scheduled_date),
      }
    }),
  )
})

app.get('/api/caregiver/calendar', async (req, res) => {
  const { caregiverId } = req.query
  if (!caregiverId) {
    return res.status(400).json({ message: 'caregiverId es requerido.' })
  }

  const today = new Date()
  const monthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1))
  const monthEnd = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0))
  const monthStartText = monthStart.toISOString().slice(0, 10)
  const monthEndText = monthEnd.toISOString().slice(0, 10)

  const [workingHoursResult, bookingsResult] = await Promise.all([
    query(
      `SELECT day_of_week, start_time::text, end_time::text, active
       FROM caregiver_working_hours
       WHERE caregiver_id = $1`,
      [caregiverId],
    ),
    query(
      `SELECT b.id, b.scheduled_date, b.start_time::text, b.end_time::text, b.service_type, b.total_hours, b.status, client.full_name AS client_name
       FROM bookings b
       JOIN users client ON client.id = b.client_id
       WHERE b.caregiver_id = $1
         AND b.scheduled_date BETWEEN $2 AND $3
         AND b.status IN ('requested', 'confirmed', 'in_progress', 'completed')
       ORDER BY b.scheduled_date ASC, b.start_time ASC`,
      [caregiverId, monthStartText, monthEndText],
    ),
  ])

  const workingHoursByDay = new Map()
  for (const row of workingHoursResult.rows) {
    const list = workingHoursByDay.get(row.day_of_week) ?? []
    if (row.active) {
      list.push(row)
    }
    workingHoursByDay.set(row.day_of_week, list)
  }

  const bookingsByDate = new Map()
  for (const row of bookingsResult.rows) {
    const dateKey = formatDateInputValue(row.scheduled_date)
    const list = bookingsByDate.get(dateKey) ?? []
    list.push(row)
    bookingsByDate.set(dateKey, list)
  }

  const calendarDays = []
  for (let cursor = new Date(monthStart); cursor <= monthEnd; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const dateKey = cursor.toISOString().slice(0, 10)
    const dayOfWeek = cursor.getUTCDay()
    const workingSlots = workingHoursByDay.get(dayOfWeek) ?? []
    const reservations = bookingsByDate.get(dateKey) ?? []
    const reservationCount = reservations.length
    const pendingCount = reservations.filter((item) => item.status === 'requested').length
    const confirmedCount = reservations.filter((item) => ['confirmed', 'in_progress', 'completed'].includes(item.status)).length
    const totalReservedHours = reservations.reduce((total, item) => total + Number(item.total_hours), 0)
    const workingHoursCapacity = workingSlots.reduce(
      (total, slot) => total + Math.max(timeTextToMinutes(slot.end_time) - timeTextToMinutes(slot.start_time), 0) / 60,
      0,
    )
    const hasCapacity = totalReservedHours < workingHoursCapacity

    let state = 'available'
    if (!workingSlots.length) {
      state = 'off'
    } else if (pendingCount > 0 && confirmedCount > 0) {
      state = 'mixed'
    } else if (confirmedCount > 0) {
      state = hasCapacity ? 'booked' : 'full'
    } else if (pendingCount > 0) {
      state = 'pending'
    } else if (!hasCapacity) {
      state = 'full'
    }

    const slotRange = workingSlots.length
      ? `${workingSlots[0].start_time.slice(0, 5)} - ${workingSlots[workingSlots.length - 1].end_time.slice(0, 5)}`
      : undefined

    calendarDays.push({
      date: dateKey,
      day: cursor.getUTCDate(),
      state,
      serviceType:
        reservationCount > 0
          ? `${reservationCount} reserva${reservationCount === 1 ? '' : 's'}`
          : workingSlots.length
            ? 'Disponible'
            : 'Sin jornada',
      timeRange: slotRange,
      reservationCount,
      pendingCount,
      confirmedCount,
      totalReservedHours: Number(totalReservedHours.toFixed(2)),
      workingHoursCapacity: Number(workingHoursCapacity.toFixed(2)),
      hasCapacity,
      summary:
        reservationCount > 0
          ? `${confirmedCount} aceptadas y ${pendingCount} pendientes`
          : workingSlots.length
            ? 'Sin reservas aun'
            : 'No trabaja este dia',
      alert:
        pendingCount > 0 && confirmedCount > 0
          ? 'Tienes reservas aceptadas y otras pendientes este dia.'
          : pendingCount > 0
            ? 'Tienes solicitudes por revisar este dia.'
            : !hasCapacity && workingSlots.length
              ? 'Tu horario de trabajo de ese dia ya quedo lleno.'
              : undefined,
      reservations: reservations.map((item) => ({
        id: item.id,
        clientName: item.client_name,
        serviceType: item.service_type,
        startTime: item.start_time.slice(0, 5),
        endTime: item.end_time.slice(0, 5),
        hours: Number(item.total_hours),
        status: mapBookingStatus(item.status),
      })),
    })
  }

  res.json(calendarDays)
})

app.get('/api/caregiver/working-hours', async (req, res) => {
  const { caregiverId } = req.query
  if (!caregiverId) {
    return res.status(400).json({ message: 'caregiverId es requerido.' })
  }

  const { rows } = await query(
    `SELECT id, day_of_week, active, start_time::text, end_time::text
     FROM caregiver_working_hours
     WHERE caregiver_id = $1
     ORDER BY day_of_week ASC, start_time ASC`,
    [caregiverId],
  )

  res.json(
    rows.map((row) => ({
      id: row.id,
      dayOfWeek: row.day_of_week,
      active: row.active,
      startTime: row.start_time.slice(0, 5),
      endTime: row.end_time.slice(0, 5),
    })),
  )
})

app.post('/api/caregiver/working-hours', async (req, res) => {
  const { caregiverId, workingHours } = req.body ?? {}
  if (!caregiverId || !Array.isArray(workingHours)) {
    return res.status(400).json({ message: 'caregiverId y workingHours son requeridos.' })
  }

  await withTransaction(async (client) => {
    await client.query(`DELETE FROM caregiver_working_hours WHERE caregiver_id = $1`, [caregiverId])

    for (const slot of workingHours) {
      await client.query(
        `INSERT INTO caregiver_working_hours (caregiver_id, day_of_week, start_time, end_time, active)
         VALUES ($1, $2, $3, $4, $5)`,
        [caregiverId, slot.dayOfWeek, slot.startTime, slot.endTime, slot.active],
      )
    }
  })

  res.json({ ok: true })
})

app.get('/api/caregiver/profile/:id', async (req, res) => {
  const { rows } = await query(
    `SELECT cp.*, u.full_name, p.name AS province, c.name AS city, n.name AS neighborhood
     FROM caregiver_profiles cp
     JOIN users u ON u.id = cp.user_id
     LEFT JOIN caregiver_service_zones csz ON csz.caregiver_id = cp.user_id AND csz.is_primary = true
     LEFT JOIN service_zones sz ON sz.id = csz.service_zone_id
     LEFT JOIN provinces p ON p.id = sz.province_id
     LEFT JOIN cities c ON c.id = sz.city_id
     LEFT JOIN neighborhoods n ON n.id = sz.neighborhood_id
     WHERE cp.user_id = $1`,
    [req.params.id],
  )
  if (!rows[0]) {
    return res.status(404).json({ message: 'Perfil no encontrado.' })
  }
  const row = rows[0]
  res.json({
    id: row.user_id,
    name: row.full_name,
    pricePerHour: Number(row.base_hourly_rate),
    nightShiftFee: Number(row.night_shift_fee),
    weekendFee: Number(row.weekend_fee),
    emergencyFee: Number(row.emergency_fee),
    province: row.province ?? '',
    city: row.city ?? '',
    neighborhood: row.neighborhood ?? '',
    about: row.bio ?? '',
  })
})

app.post('/api/caregiver/profile/:id', async (req, res) => {
  const { pricePerHour, nightShiftFee, weekendFee, emergencyFee, about } = req.body ?? {}
  await query(
    `UPDATE caregiver_profiles
     SET base_hourly_rate = $2,
         night_shift_fee = $3,
         weekend_fee = $4,
         emergency_fee = $5,
         bio = $6
     WHERE user_id = $1`,
    [req.params.id, pricePerHour, nightShiftFee, weekendFee, emergencyFee, about],
  )
  res.json({ ok: true })
})

app.get('/api/caregiver/service-zones', async (req, res) => {
  const { caregiverId } = req.query
  if (!caregiverId) {
    return res.status(400).json({ message: 'caregiverId es requerido.' })
  }

  const { rows } = await query(
    `SELECT service_zone_id
     FROM caregiver_service_zones
     WHERE caregiver_id = $1`,
    [caregiverId],
  )

  res.json(rows.map((row) => row.service_zone_id))
})

app.post('/api/caregiver/service-zones', async (req, res) => {
  const { caregiverId, zoneIds } = req.body ?? {}
  if (!caregiverId || !Array.isArray(zoneIds)) {
    return res.status(400).json({ message: 'caregiverId y zoneIds son requeridos.' })
  }

  await withTransaction(async (client) => {
    await client.query(`DELETE FROM caregiver_service_zones WHERE caregiver_id = $1`, [caregiverId])

    for (let index = 0; index < zoneIds.length; index += 1) {
      await client.query(
        `INSERT INTO caregiver_service_zones (caregiver_id, service_zone_id, is_primary)
         VALUES ($1, $2, $3)`,
        [caregiverId, zoneIds[index], index === 0],
      )
    }
  })

  res.json({ ok: true })
})

app.get('/api/zones', async (_req, res) => {
  const { rows } = await query(`SELECT * FROM v_frontend_service_zones ORDER BY province, city, neighborhood`)
  res.json(
    rows.map((row) => ({
      id: row.id,
      province: row.province,
      city: row.city,
      neighborhood: row.neighborhood,
      demandLevel: row.demand_level,
      activeCaregivers: row.active_caregivers,
    })),
  )
})

app.use((error, _req, res, _next) => {
  console.error(error)

  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'El comprobante supera el limite de 8 MB.' })
  }

  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: 'No se pudo procesar el archivo del comprobante.' })
  }

  res.status(500).json({ message: 'Error interno del servidor.' })
})

async function bootstrap() {
  await mkdir(paymentProofUploadsDir, { recursive: true })
  await mkdir(caregiverDocumentsUploadsDir, { recursive: true })
  await query(accountDeletionFunctionSql)
  await ensureDefaultAdminAccount()
  await ensureDefaultClientAccount()

  app.listen(port, () => {
    console.log(`API disponible en http://localhost:${port}/api`)
  })
}

bootstrap().catch((error) => {
  console.error('No se pudo iniciar la API', error)
  process.exit(1)
})
