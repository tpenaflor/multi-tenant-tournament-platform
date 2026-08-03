import React from 'react';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { renderBuilderComponent, ComponentItem } from '@/components/builder/ComponentRegistry';

interface TournamentPageProps {
  params: Promise<{
    tenantSlug: string;
    tournamentSlug: string;
  }>;
}

export default async function TournamentPage({ params }: TournamentPageProps) {
  const { tenantSlug, tournamentSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the layout for this tenant from the database (matching slug or custom domain)
  const org = await prisma.organization.findFirst({
    where: {
      OR: [
        { slug: tenantSlug },
        { customDomain: tenantSlug },
        ...(tenantSlug.includes('.') ? [] : [{ customDomain: { startsWith: `${tenantSlug}.` } }]),
      ],
    },
  });

  let isOwner = false;
  
  if (user && org) {
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! }
    });
    isOwner = dbUser?.role === 'ORGANIZER' && dbUser?.organizationId === org.id;
  }

  if (!org) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Tenant Not Found</h1>
      </main>
    );
  }

  if (!org.isActive) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-2xl border border-slate-800">
          <div className="inline-block p-3 bg-rose-500/10 rounded-full mb-2">
            <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Site is Offline</h1>
          <p className="opacity-70">This tournament portal is currently deactivated. Please contact the platform administrator for more information.</p>
        </div>
      </main>
    );
  }

  // Fetch the tournament
  const tournament = await prisma.tournament.findFirst({
    where: {
      organizationId: org.id,
      slug: tournamentSlug,
    }
  });

  if (!tournament) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Tournament Not Found</h1>
      </main>
    );
  }

  const page = await prisma.page.findFirst({
    where: {
      organizationId: org.id,
      slug: tournament.id, // Using tournament ID as the slug since that is how we currently save it in the builder
    },
  });

  let components: ComponentItem[] = [];

  if (page && page.components) {
    try {
      components = JSON.parse(page.components);
    } catch (e) {
      console.error('Failed to parse components JSON', e);
    }
  }

  // If we have components saved in the DB, render them
  if (components.length > 0) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-5xl mx-auto space-y-4">
          {components.map((comp) => renderBuilderComponent(comp))}
        </div>
        {isOwner && (
          <a href={`/builder?tournament=${tournament.id}`} className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-tenant-primary hover:opacity-80 text-white font-bold shadow-xl transition-transform hover:scale-105">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit in Builder
          </a>
        )}
      </main>
    );
  }

  // Fallback to the default static page if no layout is found in the DB
  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full text-center space-y-6 bg-tenant-bg p-10 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-sm mix-blend-screen">
        <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold tracking-wide uppercase">
          Tournament Page
        </div>
        <h1 className="text-4xl font-extrabold capitalize">
          {tournament.name}
        </h1>
        <p className="opacity-80 text-lg">
          Welcome to the {tournament.name} event!
        </p>
        <div className="text-sm text-yellow-500 mt-4">
          Note: No dynamic layout has been published for this tournament yet. Use the drag-and-drop builder to create a page!
        </div>
        
        {isOwner && (
          <a href={`/builder?tournament=${tournament.id}`} className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-tenant-primary hover:opacity-80 text-white font-bold shadow-xl transition-transform hover:scale-105">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit in Builder
          </a>
        )}
      </div>
    </main>
  );
}
