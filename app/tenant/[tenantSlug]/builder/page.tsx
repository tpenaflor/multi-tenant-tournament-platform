import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import BuilderClient from './BuilderClient';

export default async function BuilderPage(props: {
  params: Promise<{ tenantSlug: string }>;
  searchParams: Promise<{ tournament?: string }>;
}) {
  const { tenantSlug } = await props.params;
  const { tournament: tournamentId } = await props.searchParams;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  // Fetch the organization by tenantSlug
  const org = await prisma.organization.findFirst({
    where: {
      OR: [
        { slug: tenantSlug },
        { customDomain: tenantSlug },
        ...(tenantSlug.includes('.') ? [] : [{ customDomain: { startsWith: `${tenantSlug}.` } }]),
      ],
    }
  });

  if (!org) {
    return <div>Organization not found</div>;
  }

  // Check if user is an organizer of THIS organization
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: {
      organizationMembers: {
        where: { 
          organizationId: org.id,
          role: 'ORGANIZER' 
        },
      }
    },
  });

  if (!dbUser || !dbUser.organizationMembers || dbUser.organizationMembers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200 p-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Access Denied</h1>
          <p className="text-slate-400">You must be an organizer of this organization to use the Builder.</p>
        </div>
      </div>
    );
  }

  // Fetch the current page layout, or fall back to default components
  let initialComponents: any[] = [];
  
  let tournamentSlug: string | undefined;

  if (tournamentId) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId }
    });
    if (tournament) {
      tournamentSlug = tournament.slug;
    }
  }

  const existingPage = await prisma.page.findUnique({
    where: {
      organizationId_slug: {
        organizationId: org.id,
        slug: tournamentId || '/',
      }
    }
  });

  if (existingPage && existingPage.components) {
    try {
      initialComponents = JSON.parse(existingPage.components);
    } catch (e) {
      console.error('Failed to parse components JSON', e);
    }
  }

  // Fallback default layout for new tenants
  if (initialComponents.length === 0) {
    initialComponents = [
      {
        id: 'comp-1',
        type: 'HeroBanner',
        props: {
          title: `${org.name} Tournament`,
          subtitle: 'Welcome to our platform.',
          date: 'TBD',
          location: 'TBD',
          ctaText: 'Register Now',
          ctaLink: '#register',
        },
      }
    ];
  }

  const tournaments = await prisma.tournament.findMany({
    where: { organizationId: org.id },
    orderBy: { createdAt: 'desc' }
  });

  const defaultThemeStyles = {
    '--tenant-primary': '#0ea5e9',
    '--tenant-bg': '#020617',
    '--tenant-text': '#f8fafc',
    '--tenant-accent': '#ec4899',
    '--tenant-bg-alt': '#0f172a',
    '--tenant-border': '#334155',
    '--tenant-font-sans': 'ui-sans-serif, system-ui, sans-serif',
    '--tenant-font-serif': 'ui-serif, Georgia, serif',
    '--tenant-primary-rgb': '14 165 233',
    '--tenant-bg-rgb': '2 6 23',
    '--tenant-text-rgb': '248 250 252',
  } as React.CSSProperties;

  return (
    <div style={defaultThemeStyles} className="bg-tenant-bg text-tenant-text">
      <BuilderClient initialComponents={initialComponents} tenantSlug={org.slug} tournamentId={tournamentId} tournamentSlug={tournamentSlug} tournaments={tournaments} initialTheme={org.theme} />
    </div>
  );
}
