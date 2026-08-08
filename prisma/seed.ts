import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const socialPickleTheme = {
  primaryColor: '#273300', // green
  backgroundColor: '#fff9e8', // cream
  textColor: '#263000', // ink
  accentColor: '#ff617c', // pink
  bgAltColor: '#e2edbd', // lime
  borderColor: '#d9d8b6', // line
  fontSans: 'Arial, Helvetica, sans-serif',
  fontSerif: 'Georgia, "Times New Roman", serif',
};

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
    update: {
      isPlatformAdmin: true
    },
    create: {
      email: 'admin@bracket.sports',
      name: 'Platform Admin',
      isPlatformAdmin: true
    },
  })
  console.log({ platformAdmin })

  // 2. Create Tenant (Organization)
  const org = await prisma.organization.upsert({
    where: { slug: 'demo-tenant' },
    update: { isActive: true, theme: JSON.stringify(socialPickleTheme) }, // Ensure active
    create: {
      name: 'Demo Tenant',
      slug: 'demo-tenant',
      isActive: true,
      theme: JSON.stringify(socialPickleTheme),
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
    },
  })
  console.log({ organizer })

  const orgMember = await prisma.organizationMember.upsert({
    where: {
      userId_organizationId: {
        userId: organizer.id,
        organizationId: org.id
      }
    },
    update: {},
    create: {
      userId: organizer.id,
      organizationId: org.id,
      role: 'ORGANIZER'
    }
  })
  console.log({ orgMember })

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

  // 5. Create Default Page for Tenant
  const defaultComponents = [
    {
      id: 'block-1',
      type: 'ModernHero',
      props: {
        kicker: 'Pickleball, but make it a whole social thing.',
        title: 'Come for the <br> <em>rally.</em> Stay for <br> the people.',
        lede: 'A friendly club for meeting new people, finding your game, and enjoying a little healthy competition.',
        buttonText: 'Explore events',
        buttonLink: '/events',
        imageSrc: '/pickle-mascot-transparent.png',
      }
    },
    {
      id: 'block-2',
      type: 'ModernIntro',
      props: {
        eyebrow: 'THE GOOD STUFF',
        title: 'All skill levels. <br> <em>Zero pressure.</em>',
        description: 'Whether you are brand new to pickleball or already have a wicked backhand, Social Pickle is your excuse to get out, play more, and leave with a few new group-chat notifications.',
        linkText: 'Find an event',
        linkHref: '/events',
      }
    },
    {
      id: 'block-3',
      type: 'ModernEventBand',
      props: {
        eyebrow: 'TENTATIVE · UP NEXT',
        title: 'The Social Pickle <br> <em>Debut</em>',
        eventDate: 'AUG 29, 2026',
        eventDetails: 'Tournament · Venue to be announced',
        buttonText: 'Explore events',
        buttonLink: '/events',
      }
    },
    {
      id: 'block-4',
      type: 'ModernCommunity',
      props: {
        eyebrow: 'FIND YOUR PEOPLE',
        title: 'Good games. <br> <em>Better company.</em>',
        link1Text: 'Instagram',
        link1Href: 'https://www.instagram.com/thesocialpickle.ca',
        link2Text: 'Join us on RecClub',
        link2Href: 'https://reclub.co/',
      }
    }
  ];

  const page = await prisma.page.upsert({
    where: {
      organizationId_slug: {
        organizationId: org.id,
        slug: '/',
      }
    },
    update: {
      components: JSON.stringify(defaultComponents)
    },
    create: {
      title: 'Home',
      slug: '/',
      organizationId: org.id,
      components: JSON.stringify(defaultComponents),
      published: true
    }
  });
  console.log({ page })
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
