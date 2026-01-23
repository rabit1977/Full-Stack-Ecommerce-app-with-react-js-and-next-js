import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: pg.Pool | undefined
  adapter: PrismaPg | undefined
}

const pool =
  globalForPrisma.pool ??
  new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1, // Matches connection_limit=1 in your Supabase URL
    connectionTimeoutMillis: 5000, // Handle pooler wait times
    idleTimeoutMillis: 30000,
  })
const adapter = globalForPrisma.adapter ?? new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.pool = pool
  globalForPrisma.adapter = adapter
}
