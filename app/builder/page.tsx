import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import BuilderClient from './BuilderClient';

export default async function BuilderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the user's organization
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { organization: true },
  });

  if (!dbUser || !dbUser.organization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200 p-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Access Denied</h1>
          <p className="text-slate-400">You must be assigned to an organization to use the Builder.</p>
        </div>
      </div>
    );
  }

  const org = dbUser.organization;

  // Fetch the current page layout, or fall back to default components
  let initialComponents: any[] = [];
  
  const existingPage = await prisma.page.findUnique({
    where: {
      organizationId_slug: {
        organizationId: org.id,
        slug: '/',
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

  return <BuilderClient initialComponents={initialComponents} tenantSlug={org.slug} />;
}
