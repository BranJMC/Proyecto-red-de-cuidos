import 'dotenv/config'
import { query, withTransaction, pool } from './db.js'
import { hashPassword, slugify } from './utils.js'

const ids = {
  clientAna: '11111111-1111-1111-1111-111111111111',
  clientCarlos: '11111111-1111-1111-1111-111111111112',
  caregiverValeria: '22222222-2222-2222-2222-222222222221',
  caregiverDaniel: '22222222-2222-2222-2222-222222222222',
  caregiverMonica: '22222222-2222-2222-2222-222222222223',
  caregiverSofia: '22222222-2222-2222-2222-222222222224',
  adminLucia: '33333333-3333-3333-3333-333333333331',
  provinceSJ: '44444444-4444-4444-4444-444444444441',
  provinceHeredia: '44444444-4444-4444-4444-444444444442',
  provinceAlajuela: '44444444-4444-4444-4444-444444444443',
  provinceCartago: '44444444-4444-4444-4444-444444444444',
  cityEscazu: '55555555-5555-5555-5555-555555555551',
  citySantaAna: '55555555-5555-5555-5555-555555555552',
  cityBelen: '55555555-5555-5555-5555-555555555553',
  cityGuacima: '55555555-5555-5555-5555-555555555554',
  cityUnion: '55555555-5555-5555-5555-555555555555',
  neighborhoodSanRafael: '66666666-6666-6666-6666-666666666661',
  neighborhoodPozos: '66666666-6666-6666-6666-666666666662',
  neighborhoodRibera: '66666666-6666-6666-6666-666666666663',
  neighborhoodReyes: '66666666-6666-6666-6666-666666666664',
  neighborhoodTresRios: '66666666-6666-6666-6666-666666666665',
  zoneEscazu: '77777777-7777-7777-7777-777777777771',
  zoneSantaAna: '77777777-7777-7777-7777-777777777772',
  zoneBelen: '77777777-7777-7777-7777-777777777773',
  zoneGuacima: '77777777-7777-7777-7777-777777777774',
  zoneTresRios: '77777777-7777-7777-7777-777777777775',
  booking1: '88888888-8888-8888-8888-888888888881',
  booking2: '88888888-8888-8888-8888-888888888882',
  booking3: '88888888-8888-8888-8888-888888888883',
  booking4: '88888888-8888-8888-8888-888888888884',
  location1: '99999999-9999-9999-9999-999999999991',
  location2: '99999999-9999-9999-9999-999999999992',
  location3: '99999999-9999-9999-9999-999999999993',
  location4: '99999999-9999-9999-9999-999999999994',
}

const users = [
  {
    id: ids.clientAna,
    email: 'ana@familia.com',
    password: 'RedCuidados2026',
    role: 'client',
    fullName: 'Ana Gutierrez',
    phone: '+50688881111',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: ids.clientCarlos,
    email: 'carlos@familia.com',
    password: 'RedCuidados2026',
    role: 'client',
    fullName: 'Carlos Robles',
    phone: '+50688882222',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: ids.caregiverValeria,
    email: 'valeria@cuidados.com',
    password: 'RedCuidados2026',
    role: 'caregiver',
    fullName: 'Valeria Rojas',
    phone: '+50688883333',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: ids.caregiverDaniel,
    email: 'daniel@cuidados.com',
    password: 'RedCuidados2026',
    role: 'caregiver',
    fullName: 'Daniel Castro',
    phone: '+50688884444',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: ids.caregiverMonica,
    email: 'monica@cuidados.com',
    password: 'RedCuidados2026',
    role: 'caregiver',
    fullName: 'Monica Arias',
    phone: '+50688885555',
    avatarUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: ids.caregiverSofia,
    email: 'sofia@cuidados.com',
    password: 'RedCuidados2026',
    role: 'caregiver',
    fullName: 'Sofia Meneses',
    phone: '+50688886666',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: ids.adminLucia,
    email: 'admin@redcuidados.com',
    password: 'RedCuidados2026',
    role: 'admin',
    fullName: 'Lucia Herrera',
    phone: '+50688887777',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80',
  },
]

const caregivers = [
  {
    userId: ids.caregiverValeria,
    headline: 'Child care and learning support',
    bio: 'Especialista en primera infancia, rutinas seguras y acompanamiento despues de clases con enfoque Montessori.',
    yearsExperience: 7,
    baseHourlyRate: 18,
    nightShiftFee: 8,
    weekendFee: 6,
    emergencyFee: 12,
    languages: ['Espanol', 'Ingles'],
    serviceCount: 146,
    rank: 'Platinum',
    ratingAverage: 4.9,
    ratingCount: 128,
    urgentAvailability: true,
    availableNow: true,
    availableToday: true,
    nightShiftAvailable: true,
    weekendAvailable: true,
    emergencyService: true,
    zoneId: ids.zoneEscazu,
    services: ['Child care', 'Overnight care', 'Emergency care'],
    certifications: ['Primeros auxilios', 'Psicologia infantil', 'RCP'],
    availabilityLabels: ['Hoy 14:00-20:00', 'Manana 08:00-18:00', 'Sabado 09:00-15:00'],
    workingHours: [
      { day: 1, start: '07:00', end: '12:00' },
      { day: 1, start: '14:00', end: '21:00' },
      { day: 4, start: '14:00', end: '21:00' },
      { day: 6, start: '09:00', end: '15:00' },
    ],
  },
  {
    userId: ids.caregiverDaniel,
    headline: 'Elder care and medication routines',
    bio: 'Cuidador gerontologico enfocado en movilidad, compania activa y seguimiento de medicacion diaria.',
    yearsExperience: 10,
    baseHourlyRate: 20,
    nightShiftFee: 10,
    weekendFee: 7,
    emergencyFee: 16,
    languages: ['Espanol'],
    serviceCount: 89,
    rank: 'Gold',
    ratingAverage: 4.8,
    ratingCount: 92,
    urgentAvailability: false,
    availableNow: false,
    availableToday: true,
    nightShiftAvailable: true,
    weekendAvailable: false,
    emergencyService: false,
    zoneId: ids.zoneBelen,
    services: ['Elder care', 'Home assistance'],
    certifications: ['Asistente geriatrico', 'Manejo de medicamentos'],
    availabilityLabels: ['Lunes a Viernes 07:00-17:00'],
    workingHours: [{ day: 1, start: '07:00', end: '17:00' }],
  },
  {
    userId: ids.caregiverMonica,
    headline: 'Disability support and adaptive routines',
    bio: 'Disena planes de acompanamiento inclusivo para ninos y adultos con necesidades funcionales diversas.',
    yearsExperience: 9,
    baseHourlyRate: 24,
    nightShiftFee: 12,
    weekendFee: 8,
    emergencyFee: 18,
    languages: ['Espanol', 'Ingles', 'LESCO'],
    serviceCount: 58,
    rank: 'Gold',
    ratingAverage: 5,
    ratingCount: 67,
    urgentAvailability: true,
    availableNow: true,
    availableToday: true,
    nightShiftAvailable: true,
    weekendAvailable: true,
    emergencyService: true,
    zoneId: ids.zoneGuacima,
    services: ['Disability support', 'Emergency care', 'Home assistance'],
    certifications: ['Terapia ocupacional', 'Comunicacion aumentativa'],
    availabilityLabels: ['Disponible 24 horas con reserva'],
    workingHours: [{ day: 1, start: '06:00', end: '22:00' }],
  },
  {
    userId: ids.caregiverSofia,
    headline: 'Home assistance and overnight care',
    bio: 'Combina soporte del hogar con acompanamiento delicado para rutinas nocturnas y cuidados prolongados.',
    yearsExperience: 6,
    baseHourlyRate: 19,
    nightShiftFee: 9,
    weekendFee: 7,
    emergencyFee: 15,
    languages: ['Espanol', 'Ingles'],
    serviceCount: 21,
    rank: 'Silver',
    ratingAverage: 4.7,
    ratingCount: 54,
    urgentAvailability: true,
    availableNow: false,
    availableToday: true,
    nightShiftAvailable: true,
    weekendAvailable: true,
    emergencyService: true,
    zoneId: ids.zoneTresRios,
    services: ['Home assistance', 'Overnight care', 'Child care'],
    certifications: ['Cuidados paliativos basicos', 'RCP'],
    availabilityLabels: ['Hoy 18:00-23:00', 'Domingo 08:00-20:00'],
    workingHours: [{ day: 0, start: '08:00', end: '20:00' }],
  },
]

async function upsertUser(client, user) {
  const passwordHash = await hashPassword(user.password)
  await client.query(
    `INSERT INTO users (id, email, password_hash, role, status, full_name, phone, avatar_url, email_verified_at)
     VALUES ($1, $2, $3, $4, 'active', $5, $6, $7, now())
     ON CONFLICT (id) DO UPDATE
     SET email = EXCLUDED.email,
         password_hash = EXCLUDED.password_hash,
         role = EXCLUDED.role,
         status = EXCLUDED.status,
         full_name = EXCLUDED.full_name,
         phone = EXCLUDED.phone,
         avatar_url = EXCLUDED.avatar_url,
         email_verified_at = EXCLUDED.email_verified_at`,
    [user.id, user.email, passwordHash, user.role, user.fullName, user.phone, user.avatarUrl],
  )
}

async function seedLookups(client) {
  const provinces = [
    [ids.provinceSJ, 'San Jose'],
    [ids.provinceHeredia, 'Heredia'],
    [ids.provinceAlajuela, 'Alajuela'],
    [ids.provinceCartago, 'Cartago'],
  ]

  for (const province of provinces) {
    await client.query(
      `INSERT INTO provinces (id, name) VALUES ($1, $2)
       ON CONFLICT (id) DO NOTHING`,
      province,
    )
  }

  const cities = [
    [ids.cityEscazu, ids.provinceSJ, 'Escazu'],
    [ids.citySantaAna, ids.provinceSJ, 'Santa Ana'],
    [ids.cityBelen, ids.provinceHeredia, 'Belen'],
    [ids.cityGuacima, ids.provinceAlajuela, 'La Guacima'],
    [ids.cityUnion, ids.provinceCartago, 'La Union'],
  ]

  for (const city of cities) {
    await client.query(
      `INSERT INTO cities (id, province_id, name) VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
      city,
    )
  }

  const neighborhoods = [
    [ids.neighborhoodSanRafael, ids.cityEscazu, 'San Rafael'],
    [ids.neighborhoodPozos, ids.citySantaAna, 'Pozos'],
    [ids.neighborhoodRibera, ids.cityBelen, 'La Ribera'],
    [ids.neighborhoodReyes, ids.cityGuacima, 'Hacienda Los Reyes'],
    [ids.neighborhoodTresRios, ids.cityUnion, 'Tres Rios'],
  ]

  for (const neighborhood of neighborhoods) {
    await client.query(
      `INSERT INTO neighborhoods (id, city_id, name) VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
      neighborhood,
    )
  }

  const serviceZones = [
    [ids.zoneEscazu, ids.provinceSJ, ids.cityEscazu, ids.neighborhoodSanRafael, 'Escazu Centro', 'high', 38],
    [ids.zoneSantaAna, ids.provinceSJ, ids.citySantaAna, ids.neighborhoodPozos, 'Santa Ana - Pozos', 'high', 29],
    [ids.zoneBelen, ids.provinceHeredia, ids.cityBelen, ids.neighborhoodRibera, 'Belen - La Ribera', 'medium', 17],
    [ids.zoneGuacima, ids.provinceAlajuela, ids.cityGuacima, ids.neighborhoodReyes, 'La Guacima', 'emerging', 12],
    [ids.zoneTresRios, ids.provinceCartago, ids.cityUnion, ids.neighborhoodTresRios, 'Tres Rios', 'medium', 14],
  ]

  for (const zone of serviceZones) {
    await client.query(
      `INSERT INTO service_zones (id, province_id, city_id, neighborhood_id, name, demand_level, active_caregivers, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)
       ON CONFLICT (id) DO NOTHING`,
      zone,
    )
  }
}

async function seedProfiles(client) {
  await client.query(
    `INSERT INTO client_profiles (user_id, family_name, emergency_contact_name, emergency_contact_phone)
     VALUES
     ($1, 'Familia Gutierrez', 'Laura Gutierrez', '+50688881110'),
     ($2, 'Familia Robles', 'Miguel Robles', '+50688882220')
     ON CONFLICT (user_id) DO NOTHING`,
    [ids.clientAna, ids.clientCarlos],
  )

  await client.query(
    `INSERT INTO admin_profiles (user_id, title, department, permissions)
     VALUES ($1, 'Operations Lead', 'Trust & Safety', '{"all": true}')
     ON CONFLICT (user_id) DO NOTHING`,
    [ids.adminLucia],
  )

  for (const caregiver of caregivers) {
    const user = users.find((item) => item.id === caregiver.userId)
    await client.query(
      `INSERT INTO caregiver_profiles (
        user_id, public_slug, headline, bio, years_experience, base_hourly_rate, night_shift_fee, weekend_fee,
        emergency_fee, languages, service_count, rank, rating_average, rating_count, profile_image_url,
        urgent_availability, available_now, available_today, night_shift_available, weekend_available,
        emergency_service, verified_status, can_work
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, 'approved', true)
      ON CONFLICT (user_id) DO UPDATE SET
        public_slug = EXCLUDED.public_slug,
        headline = EXCLUDED.headline,
        bio = EXCLUDED.bio,
        years_experience = EXCLUDED.years_experience,
        base_hourly_rate = EXCLUDED.base_hourly_rate,
        night_shift_fee = EXCLUDED.night_shift_fee,
        weekend_fee = EXCLUDED.weekend_fee,
        emergency_fee = EXCLUDED.emergency_fee,
        languages = EXCLUDED.languages,
        service_count = EXCLUDED.service_count,
        rank = EXCLUDED.rank,
        rating_average = EXCLUDED.rating_average,
        rating_count = EXCLUDED.rating_count,
        profile_image_url = EXCLUDED.profile_image_url,
        urgent_availability = EXCLUDED.urgent_availability,
        available_now = EXCLUDED.available_now,
        available_today = EXCLUDED.available_today,
        night_shift_available = EXCLUDED.night_shift_available,
        weekend_available = EXCLUDED.weekend_available,
        emergency_service = EXCLUDED.emergency_service,
        verified_status = EXCLUDED.verified_status,
        can_work = EXCLUDED.can_work`,
      [
        caregiver.userId,
        slugify(user.fullName),
        caregiver.headline,
        caregiver.bio,
        caregiver.yearsExperience,
        caregiver.baseHourlyRate,
        caregiver.nightShiftFee,
        caregiver.weekendFee,
        caregiver.emergencyFee,
        caregiver.languages,
        caregiver.serviceCount,
        caregiver.rank,
        caregiver.ratingAverage,
        caregiver.ratingCount,
        user.avatarUrl,
        caregiver.urgentAvailability,
        caregiver.availableNow,
        caregiver.availableToday,
        caregiver.nightShiftAvailable,
        caregiver.weekendAvailable,
        caregiver.emergencyService,
      ],
    )

    await client.query(
      `INSERT INTO caregiver_service_zones (caregiver_id, service_zone_id, is_primary)
       VALUES ($1, $2, true)
       ON CONFLICT (caregiver_id, service_zone_id) DO NOTHING`,
      [caregiver.userId, caregiver.zoneId],
    )

    for (const service of caregiver.services) {
      await client.query(
        `INSERT INTO caregiver_services (caregiver_id, service_type, description)
         VALUES ($1, $2, $3)
         ON CONFLICT (caregiver_id, service_type) DO NOTHING`,
        [caregiver.userId, service, `${service} con seguimiento personalizado.`],
      )
    }

    for (const certification of caregiver.certifications) {
      await client.query(
        `INSERT INTO caregiver_certifications (caregiver_id, certification_name)
         VALUES ($1, $2)
         ON CONFLICT (caregiver_id, certification_name) DO NOTHING`,
        [caregiver.userId, certification],
      )
    }

    await client.query(`DELETE FROM caregiver_availability_labels WHERE caregiver_id = $1`, [caregiver.userId])
    for (const label of caregiver.availabilityLabels) {
      await client.query(
        `INSERT INTO caregiver_availability_labels (caregiver_id, label)
         VALUES ($1, $2)`,
        [caregiver.userId, label],
      )
    }

    await client.query(`DELETE FROM caregiver_working_hours WHERE caregiver_id = $1`, [caregiver.userId])
    for (const slot of caregiver.workingHours) {
      await client.query(
        `INSERT INTO caregiver_working_hours (caregiver_id, day_of_week, start_time, end_time)
         VALUES ($1, $2, $3, $4)`,
        [caregiver.userId, slot.day, slot.start, slot.end],
      )
    }

    await client.query(
      `INSERT INTO caregiver_verifications (caregiver_id, status, national_id_number, email_otp_verified, sms_otp_verified, face_photo_verified, submitted_at, reviewed_at, reviewed_by)
       VALUES ($1, 'approved', '1-1234-5678', true, true, true, now(), now(), $2)
       ON CONFLICT (caregiver_id) DO UPDATE SET
         status = EXCLUDED.status,
         national_id_number = EXCLUDED.national_id_number,
         email_otp_verified = EXCLUDED.email_otp_verified,
         sms_otp_verified = EXCLUDED.sms_otp_verified,
         face_photo_verified = EXCLUDED.face_photo_verified,
         submitted_at = EXCLUDED.submitted_at,
         reviewed_at = EXCLUDED.reviewed_at,
         reviewed_by = EXCLUDED.reviewed_by`,
      [caregiver.userId, ids.adminLucia],
    )
  }
}

async function seedOperationalData(client) {
  await client.query(
    `INSERT INTO booking_locations (id, label, address_line, province_id, city_id, neighborhood_id)
     VALUES
     ($1, 'Casa principal Escazu', 'San Rafael de Escazu, 300m norte del parque', $5, $9, $13),
     ($2, 'Casa principal Belen', 'La Ribera, casa azul frente al minisuper', $6, $10, $14),
     ($3, 'Condominio Guacima', 'La Guacima, condominio Hacienda Los Reyes', $7, $11, $15),
     ($4, 'Casa principal Tres Rios', 'Tres Rios centro, 100m oeste de la iglesia', $8, $12, $16)
     ON CONFLICT (id) DO NOTHING`,
    [
      ids.location1,
      ids.location2,
      ids.location3,
      ids.location4,
      ids.provinceSJ,
      ids.provinceHeredia,
      ids.provinceAlajuela,
      ids.provinceCartago,
      ids.cityEscazu,
      ids.cityBelen,
      ids.cityGuacima,
      ids.cityUnion,
      ids.neighborhoodSanRafael,
      ids.neighborhoodRibera,
      ids.neighborhoodReyes,
      ids.neighborhoodTresRios,
    ],
  )

  await client.query(
    `INSERT INTO bookings (
      id, client_id, caregiver_id, service_type, status, scheduled_date, start_time, end_time, total_hours,
      location_id, hourly_rate, night_fee, weekend_fee, emergency_fee, platform_fee, discount, total_amount, notes
    )
    VALUES
    ($1, $5, $7, 'Child care', 'confirmed', DATE '2026-04-22', TIME '14:00', TIME '18:00', 4, $11, 18, 0, 0, 0, 0, 0, 72, 'Rutina despues de clases.'),
    ($2, $6, $8, 'Elder care', 'requested', DATE '2026-04-25', TIME '08:00', TIME '16:00', 8, $12, 20, 0, 0, 0, 0, 0, 160, 'Apoyo con movilidad y medicamentos.'),
    ($3, $5, $9, 'Disability support', 'completed', DATE '2026-04-16', TIME '10:00', TIME '16:00', 6, $13, 24, 0, 0, 0, 0, 0, 144, 'Acompanamiento integral.'),
    ($4, $5, $10, 'Overnight care', 'confirmed', DATE '2026-04-27', TIME '20:00', TIME '23:59', 10, $14, 19, 9, 7, 0, 20, 0, 235, 'Turno nocturno y acompanamiento.')
    ON CONFLICT (id) DO NOTHING`,
    [
      ids.booking1,
      ids.booking2,
      ids.booking3,
      ids.booking4,
      ids.clientAna,
      ids.clientCarlos,
      ids.caregiverValeria,
      ids.caregiverDaniel,
      ids.caregiverMonica,
      ids.caregiverSofia,
      ids.location1,
      ids.location2,
      ids.location3,
      ids.location4,
    ],
  )

  await client.query(
    `INSERT INTO notifications (user_id, type, title, body, data, read_at, created_at)
     VALUES
     ($1, 'booking', 'Nueva solicitud confirmada', 'Valeria acepto tu reserva para hoy a las 14:00.', '{"bookingId":"88888888-8888-8888-8888-888888888881"}', NULL, now() - interval '2 minutes'),
     ($1, 'payment', 'Comprobante recibido', 'Tu recibo de pago ingreso a revision automatizable por AI.', '{}'::jsonb, NULL, now() - interval '18 minutes'),
     ($2, 'alert', 'Urgencia en Escazu', 'Hay una nueva solicitud para servicio de emergencia en menos de 2 horas.', '{}'::jsonb, now() - interval '10 minutes', now() - interval '32 minutes'),
     ($3, 'chat', 'Nuevo mensaje', 'Monica envio instrucciones previas a la visita.', '{}'::jsonb, now() - interval '1 hour', now() - interval '3 hours')
     ON CONFLICT DO NOTHING`,
    [ids.clientAna, ids.caregiverValeria, ids.caregiverMonica],
  )

  await client.query(
    `INSERT INTO favorites (client_id, caregiver_id)
     VALUES ($1, $2), ($1, $3), ($1, $4)
     ON CONFLICT DO NOTHING`,
    [ids.clientAna, ids.caregiverValeria, ids.caregiverDaniel, ids.caregiverMonica],
  )

  await client.query(
    `INSERT INTO saved_searches (client_id, name, filters)
     VALUES
     ($1, 'Urgencias San Jose', '{"zone":"Escazu","service":"Emergency care"}'),
     ($1, 'Nocturno fin de semana', '{"service":"Overnight care","weekend":true}')
     ON CONFLICT DO NOTHING`,
    [ids.clientAna],
  )

  await client.query(
    `INSERT INTO conversations (id, booking_id) VALUES
     ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', $1),
     ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', NULL)
     ON CONFLICT (id) DO NOTHING`,
    [ids.booking1],
  )

  await client.query(
    `INSERT INTO conversation_participants (conversation_id, user_id, last_read_at)
     VALUES
     ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', $1, now() - interval '5 minutes'),
     ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', $2, now()),
     ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', $1, now()),
     ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', $3, now())
     ON CONFLICT DO NOTHING`,
    [ids.clientAna, ids.caregiverValeria, ids.adminLucia],
  )

  await client.query(
    `INSERT INTO messages (id, conversation_id, sender_id, body, sent_at)
     VALUES
     ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', $2, 'Hola, confirme la reserva.', now() - interval '12 minutes'),
     ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', $1, 'Perfecto, te esperamos.', now() - interval '9 minutes'),
     ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', $2, 'Estoy saliendo hacia tu ubicacion.', now() - interval '1 minute'),
     ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', $3, 'Tu comprobante esta en revision manual.', now() - interval '1 day')
     ON CONFLICT (id) DO NOTHING`,
    [ids.clientAna, ids.caregiverValeria, ids.adminLucia],
  )

  await client.query(
    `INSERT INTO hourly_service_updates (booking_id, caregiver_id, hour_number, summary, status)
     VALUES
     ($1, $2, 1, 'Todo estable. Merienda completada y rutina tranquila.', 'on-track'),
     ($1, $2, 2, 'Se completo actividad sensorial y descanso programado.', 'completed')
     ON CONFLICT (booking_id, hour_number) DO NOTHING`,
    [ids.booking1, ids.caregiverValeria],
  )

  await client.query(
    `INSERT INTO payment_proofs (booking_id, client_id, status, amount, method, reference_number, reviewed_by, reviewed_at)
     VALUES
     ($1, $2, 'pending_review', 72, 'transferencia', 'TRX-88421', $3, now() - interval '10 minutes'),
     ($4, $2, 'approved', 235, 'sinpe', 'SINPE-30112', $3, now() - interval '1 day')
     ON CONFLICT DO NOTHING`,
    [ids.booking1, ids.clientAna, ids.adminLucia, ids.booking4],
  )

  await client.query(
    `INSERT INTO ai_reviews (id, target_type, target_id, provider, decision, confidence, summary, flags, reviewed_by)
     SELECT 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'payment_proof', id, 'dev-seed', 'manual_review', 0.81,
            'El comprobante requiere revision por recorte y referencia incompleta.', ARRAY['Referencia parcial'], $1
     FROM payment_proofs
     WHERE reference_number = 'TRX-88421'
     ON CONFLICT DO NOTHING`,
    [ids.adminLucia],
  )

  await client.query(
    `INSERT INTO ai_reviews (id, target_type, target_id, provider, decision, confidence, summary, flags, reviewed_by)
     SELECT 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'payment_proof', id, 'dev-seed', 'approved', 0.96,
            'El comprobante coincide con el monto y la referencia.', ARRAY['Sin anomalías'], $1
     FROM payment_proofs
     WHERE reference_number = 'SINPE-30112'
     ON CONFLICT DO NOTHING`,
    [ids.adminLucia],
  )

  await client.query(
    `INSERT INTO payment_reviews (payment_proof_id, reviewer_id, ai_review_id, decision, notes)
     SELECT pp.id, $1, air.id, 'pending_review', 'Pendiente de revision manual.'
     FROM payment_proofs pp
     JOIN ai_reviews air ON air.target_id = pp.id
     WHERE pp.reference_number = 'TRX-88421'
     ON CONFLICT DO NOTHING`,
    [ids.adminLucia],
  )

  await client.query(
    `INSERT INTO payment_reviews (payment_proof_id, reviewer_id, ai_review_id, decision, notes)
     SELECT pp.id, $1, air.id, 'approved', 'Aprobado por validacion automatica.'
     FROM payment_proofs pp
     JOIN ai_reviews air ON air.target_id = pp.id
     WHERE pp.reference_number = 'SINPE-30112'
     ON CONFLICT DO NOTHING`,
    [ids.adminLucia],
  )

  await client.query(
    `INSERT INTO payment_history (booking_id, client_id, caregiver_id, amount, method, status, paid_at, reference_number)
     VALUES
     ($1, $2, $3, 72, 'Transferencia', 'pending-review', now() - interval '15 minutes', 'TRX-88421'),
     ($4, $2, $5, 235, 'SINPE', 'paid', now() - interval '1 day', 'SINPE-30112')
     ON CONFLICT DO NOTHING`,
    [ids.booking1, ids.clientAna, ids.caregiverValeria, ids.booking4, ids.caregiverSofia],
  )

  await client.query(
    `INSERT INTO reviews (booking_id, client_id, caregiver_id, rating, comment, public)
     VALUES
     ($1, $2, $3, 5, 'Excelente acompanamiento y comunicacion clara.', true),
     ($4, $2, $5, 4, 'Muy atenta durante todo el turno nocturno.', true)
     ON CONFLICT (booking_id) DO NOTHING`,
    [ids.booking3, ids.clientAna, ids.caregiverMonica, ids.booking4, ids.caregiverSofia],
  )

  await client.query(
    `INSERT INTO reports (reporter_id, booking_id, caregiver_id, report_type, category, urgency, priority, subject, description, status, public_status, assigned_to)
     VALUES
     ($1, $2, $3, 'servicio', 'cuidador', 'notice', 'medium', 'Retraso menor', 'La cuidadora llego 10 minutos tarde pero aviso.', 'in_transit', 'in_transit', $4),
     ($1, $5, $6, 'pago', 'pago', 'urgent', 'high', 'Revision de comprobante', 'Necesito confirmar el estado del pago cargado.', 'pending', 'pending', $4)
     ON CONFLICT DO NOTHING`,
    [ids.clientAna, ids.booking1, ids.caregiverValeria, ids.adminLucia, ids.booking4, ids.caregiverSofia],
  )

  await client.query(
    `INSERT INTO support_tickets (requester_id, topic, channel, sla_label, status, priority, assigned_to)
     VALUES
     ($1, 'Comprobante en revision', 'Web', '4 horas', 'in-progress', 'high', $2),
     ($1, 'Actualizar perfil familiar', 'Chat', '24 horas', 'waiting', 'medium', $2)
     ON CONFLICT DO NOTHING`,
    [ids.clientAna, ids.adminLucia],
  )

  await client.query(
    `INSERT INTO content_pages (slug, title, body, section, status, published_at)
     VALUES
     ('faq-onboarding-caregivers', 'FAQ onboarding caregivers', 'Contenido inicial para centro de ayuda.', 'Help center', 'published', now()),
     ('safety-week-campaign', 'Campana safety week', 'Banner promocional para home.', 'Home banner', 'scheduled', now() + interval '2 days'),
     ('blog-crisis-care-night', 'Blog crisis care at night', 'Borrador editorial.', 'Blog', 'draft', NULL)
     ON CONFLICT (slug) DO NOTHING`,
  )

  await client.query(
    `INSERT INTO social_posts (author_id, body, visibility, like_count, comment_count)
     VALUES
     ($1, 'Terminamos una jornada hermosa de acompanamiento con actividades sensoriales y rutina tranquila.', 'community', 24, 6),
     ($2, 'Nueva guia de seguridad publicada para reservas de emergencia y turnos nocturnos.', 'public', 31, 4)
     ON CONFLICT DO NOTHING`,
    [ids.caregiverValeria, ids.adminLucia],
  )

  await client.query(
    `INSERT INTO fraud_alerts (target_type, target_id, risk_level, title, location_label, detail, status)
     VALUES
     ('payment_proof', (SELECT id FROM payment_proofs WHERE reference_number = 'TRX-88421' LIMIT 1), 'high', 'Referencia parcial en comprobante', 'Escazu', 'La imagen del recibo no muestra todos los datos bancarios.', 'reviewing')
     ON CONFLICT DO NOTHING`,
  )

  await client.query(
    `INSERT INTO daily_backups (generated_by, scope, storage_key, size_bytes, status, started_at, completed_at)
     VALUES
     ($1, 'Base completa', 'backups/red-cuidados-2026-04-24.sql.gz', 15728640, 'ready', now() - interval '2 hours', now() - interval '90 minutes')
     ON CONFLICT DO NOTHING`,
    [ids.adminLucia],
  )

  await client.query(
    `INSERT INTO audit_logs (actor_id, action, target_type, target_id, metadata, created_at)
     VALUES
     ($1, 'Aprobo cuidador', 'caregiver', $2, '{"target":"Monica Arias"}', now() - interval '2 days'),
     ($1, 'Marco alerta', 'payment_proof', (SELECT id FROM payment_proofs WHERE reference_number = 'TRX-88421' LIMIT 1), '{"target":"Comprobante TRX-88421"}', now() - interval '1 day'),
     ($1, 'Cerro ticket', 'support_ticket', (SELECT id FROM support_tickets ORDER BY created_at ASC LIMIT 1), '{"target":"Soporte comprobante"}', now() - interval '6 hours')
     ON CONFLICT DO NOTHING`,
    [ids.adminLucia, ids.caregiverMonica],
  )

  await client.query(
    `INSERT INTO dashboard_metrics (role, label, value, change_label, accent, sort_order)
     VALUES
     ('client', 'Reservas activas', '4', '+2 esta semana', 'sky', 1),
     ('client', 'Pagos en revision', '1', '1 pendiente', 'amber', 2),
     ('client', 'Favoritos', '3', '+1 nuevo', 'emerald', 3),
     ('caregiver', 'Solicitudes nuevas', '6', '+3 hoy', 'sky', 1),
     ('caregiver', 'Horas reservadas', '28h', '+8h', 'emerald', 2),
     ('caregiver', 'Resenas recientes', '12', '+2 esta semana', 'amber', 3),
     ('admin', 'Verificaciones pendientes', '5', '-1 hoy', 'amber', 1),
     ('admin', 'Reportes abiertos', '2', 'sin cambios', 'rose', 2),
     ('admin', 'Backups listos', '1', 'ultimo hace 90m', 'emerald', 3)
     ON CONFLICT (role, label) DO UPDATE SET
       value = EXCLUDED.value,
       change_label = EXCLUDED.change_label,
       accent = EXCLUDED.accent,
       sort_order = EXCLUDED.sort_order`,
  )

  await client.query(`DELETE FROM analytics_series_points`)
  const analyticsPoints = [
    ['earnings', 'Lun', { caregiver: 1800, platform: 320 }],
    ['earnings', 'Mar', { caregiver: 2200, platform: 410 }],
    ['earnings', 'Mie', { caregiver: 2100, platform: 395 }],
    ['platform', 'Lun', { bookings: 12, messages: 44, payments: 7 }],
    ['platform', 'Mar', { bookings: 14, messages: 51, payments: 9 }],
    ['platform', 'Mie', { bookings: 16, messages: 47, payments: 8 }],
  ]

  for (const [seriesName, pointLabel, values] of analyticsPoints) {
    await client.query(
      `INSERT INTO analytics_series_points (series_name, point_label, values)
       VALUES ($1, $2, $3)`,
      [seriesName, pointLabel, values],
    )
  }
}

async function main() {
  await withTransaction(async (client) => {
    for (const user of users) {
      await upsertUser(client, user)
    }
    await seedLookups(client)
    await seedProfiles(client)
    await seedOperationalData(client)
  })

  const { rows } = await query(`SELECT count(*)::int AS total_users FROM users`)
  console.log(`Seed completado. Usuarios cargados: ${rows[0].total_users}`)
}

main()
  .catch((error) => {
    console.error('Error ejecutando el seed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await pool.end()
  })
