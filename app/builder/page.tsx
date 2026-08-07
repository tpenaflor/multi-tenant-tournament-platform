import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import BuilderClient from './BuilderClient';

export default async function BuilderPage({ searchParams }: { searchParams: Promise<{ tournament?: string }> }) {
  const { tournament: tournamentId } = await searchParams;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the user's organization
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: {
      organizationMembers: {
        where: { role: 'ORGANIZER' },
        include: { organization: true }
      }
    },
  });

  const activeOrgMember = dbUser?.organizationMembers?.[0];

  if (!dbUser || !activeOrgMember || !activeOrgMember.organization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200 p-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Access Denied</h1>
          <p className="text-slate-400">You must be an organizer of an organization to use the Builder.</p>
        </div>
      </div>
    );
  }

  const org = activeOrgMember.organization;

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

  return <BuilderClient initialComponents={initialComponents} tenantSlug={org.slug} tournamentId={tournamentId} tournamentSlug={tournamentSlug} tournaments={tournaments} initialTheme={org.theme} />;
}
