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
    // In serverless environments (Vercel), we must keep the pool size low
    // because each lambda instance opens its own pool.
    max: process.env.NODE_ENV === 'production' ? 1 : 10,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    // Add SSL for production environments (required by most cloud providers like Neon, Vercel Postgres, etc.)
    ssl: process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : undefined,
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
