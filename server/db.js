import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://postgres:Red-cuidos3112@localhost:5432/red_cuidados'

function shouldUseSsl(url) {
  if (!url) {
    return false
  }

  return /neon\.tech/i.test(url) || /sslmode=require/i.test(url)
}

export const pool = new Pool({
  connectionString,
  ssl: shouldUseSsl(connectionString) ? { rejectUnauthorized: false } : undefined,
})

export async function query(text, params = []) {
  return pool.query(text, params)
}

export async function withTransaction(work) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await work(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
