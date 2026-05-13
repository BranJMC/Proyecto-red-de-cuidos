import 'dotenv/config'
import nodemailer from 'nodemailer'

const smtpHost = process.env.SMTP_HOST
const smtpPort = Number(process.env.SMTP_PORT ?? 587)
const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS
const smtpSecure = process.env.SMTP_SECURE === 'true'
const mailFrom = process.env.MAIL_FROM ?? smtpUser ?? 'no-reply@redcuidados.local'

let transporterPromise = null

function createTransporter() {
  if (!smtpHost || !smtpUser || !smtpPass) {
    return null
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })
}

async function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = Promise.resolve(createTransporter())
  }

  return transporterPromise
}

export function isEmailConfigured() {
  return Boolean(smtpHost && smtpUser && smtpPass)
}

export async function sendAppEmail({ to, subject, html, text }) {
  const transporter = await getTransporter()
  if (!transporter) {
    throw new Error('SMTP no configurado.')
  }

  return transporter.sendMail({
    from: mailFrom,
    to,
    subject,
    html,
    text,
  })
}

export async function verifyMailerConnection() {
  const transporter = await getTransporter()
  if (!transporter) {
    return false
  }

  await transporter.verify()
  return true
}

