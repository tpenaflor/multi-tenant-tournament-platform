import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function main() {
  const defaultPassword = 'Password123!'

  // Seed Supabase Auth Accounts
  const seedEmails = ['admin@bracket.sports', 'organizer@demo.com']
  for (const email of seedEmails) {
    const { error } = await supabase.auth.signUp({ email, password: defaultPassword })
    if (error && !error.message.includes('already registered')) {
      console.log(`Supabase auth signup for ${email}: ${error.message}`)
    }
  }

  // 1. Create Platform Admin
  const platformAdmin = await prisma.user.upsert({
    where: { email: 'admin@bracket.sports' },
    update: {},
    create: {
      email: 'admin@bracket.sports',
      name: 'Platform Admin',
      role: 'PLATFORM_ADMIN',
    },
  })
  console.log({ platformAdmin })

  // 2. Create Tenant (Organization)
  const org = await prisma.organization.upsert({
    where: { slug: 'demo-tenant' },
    update: { isActive: true }, // Ensure active
    create: {
      name: 'Demo Tenant',
      slug: 'demo-tenant',
      isActive: true,
    },
  })
  console.log({ org })

  // 3. Create Organizer for the Tenant
  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@demo.com' },
    update: {},
    create: {
      email: 'organizer@demo.com',
      name: 'Demo Organizer',
      role: 'ORGANIZER',
      organizationId: org.id,
    },
  })
  console.log({ organizer })

  // 4. Create an Event (Tournament) for the Tenant
  const tournament = await prisma.tournament.upsert({
    where: {
      organizationId_slug: {
        organizationId: org.id,
        slug: 'demo-event',
      },
    },
    update: {},
    create: {
      name: 'Demo Pickleball Event',
      slug: 'demo-event',
      sport: 'Pickleball',
      format: 'SingleElimination',
      organizationId: org.id,
    },
  })
  console.log({ tournament })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
