import React from 'react';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { renderBuilderComponent, ComponentItem } from '@/components/builder/ComponentRegistry';
import { headers } from 'next/headers';

interface TenantPageProps {
  params: Promise<{
    tenantSlug: string;
  }>;
}

export default async function TenantPage({ params }: TenantPageProps) {
  const { tenantSlug } = await params;
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
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-slate-400">Tenant Not Found</h1>
      </main>
    );
  }

  if (!org.isActive) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-4 bg-slate-900 p-8 rounded-2xl border border-slate-800">
          <div className="inline-block p-3 bg-rose-500/10 rounded-full mb-2">
            <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Site is Offline</h1>
          <p className="text-slate-400">This tournament portal is currently deactivated. Please contact the platform administrator for more information.</p>
        </div>
      </main>
    );
  }

  const page = await prisma.page.findFirst({
    where: {
      organizationId: org.id,
      slug: '/', // Assuming we're serving the home page of the tenant
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
    const tournaments = await prisma.tournament.findMany({
      where: { organizationId: org.id },
      orderBy: { createdAt: 'desc' },
    });

    const headersList = await headers();
    const host = headersList.get('host') || '';
    const hostWithoutPort = host.split(':')[0];
    const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'multi-tenant-tournament-platform.vercel.app').toLowerCase().split(':')[0];
    const mainDomains = new Set(['localhost', 'localhost:3000', '127.0.0.1', '127.0.0.1:3000', 'bracketsports.com', 'www.bracketsports.com', 'tron-solutions.cc', 'www.tron-solutions.cc', 'tron-solution.cc', 'www.tron-solution.cc', rootDomain, `www.${rootDomain}`]);
    const isMainDomain = mainDomains.has(host) || mainDomains.has(hostWithoutPort);
    
    const basePath = isMainDomain ? `/tenant/${tenantSlug}` : '';

    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
        <div className="max-w-5xl mx-auto space-y-4">
          {components.map((comp) => renderBuilderComponent(comp, { tournaments, tenantName: org.name, basePath }))}
        </div>
        {isOwner && (
          <a href="/builder" className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-xl shadow-sky-500/20 transition-transform hover:scale-105">
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
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full text-center space-y-6 bg-slate-900/60 p-10 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-sm">
        <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold tracking-wide uppercase">
          Tenant Domain Active
        </div>
        <h1 className="text-4xl font-extrabold text-white capitalize">
          Welcome to {tenantSlug.replace('-', ' ')} Tournament Portal
        </h1>
        <p className="text-slate-400 text-lg">
          This event page is dynamically served via Next.js Middleware domain rewriting for:
          <span className="block mt-2 font-mono text-emerald-400 text-sm bg-slate-900 px-3 py-1.5 rounded border border-slate-800 inline-block">
            {tenantSlug}
          </span>
        </p>
        <div className="text-sm text-yellow-500 mt-4">
          Note: No dynamic layout has been published for this tenant yet. Use the drag-and-drop builder to create a page!
        </div>
        <div className="pt-4 border-t border-slate-800 flex justify-center gap-4">
          <button className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg transition-all">
            View Live Brackets
          </button>
          <button className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium border border-slate-700 transition-all">
            Register Player
          </button>
        </div>
        
        {isOwner && (
          <a href="/builder" className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-xl shadow-sky-500/20 transition-transform hover:scale-105">
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
