import React from 'react';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { TrophyIcon, PlusIcon, TrashIcon } from '@/components/ui/icons';
import { createTournament, deleteTournament } from './actions';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { organization: true }
  });

  if (!dbUser || !dbUser.organization) {
    return <div>No organization found.</div>;
  }

  const tournaments = await prisma.tournament.findMany({
    where: { organizationId: dbUser.organizationId! },
    orderBy: { createdAt: 'desc' }
  });

  const pages = await prisma.page.findMany({
    where: {
      organizationId: dbUser.organizationId!,
      slug: { in: tournaments.map(t => t.id) }
    }
  });

  const pagesByTournamentId = pages.reduce((acc, page) => {
    acc[page.slug] = page;
    return acc;
  }, {} as Record<string, typeof pages[0]>);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Your Tournaments</h2>
          <p className="text-slate-400 mt-1">Manage events for {dbUser.organization.name}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Tournament Card */}
        <div className="bg-slate-900 border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-2xl p-6 transition-colors shadow-lg flex flex-col justify-center relative overflow-hidden group">
          <form action={createTournament} className="space-y-4 flex-1 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <PlusIcon size={20} className="text-sky-400" /> Spin Up New Event
            </h3>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Tournament Name</label>
              <input name="name" required placeholder="e.g. Summer Open 2026" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Sport</label>
                <select name="sport" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-500">
                  <option value="Pickleball">Pickleball</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Badminton">Badminton</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Format</label>
                <select name="format" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-500">
                  <option value="SingleElimination">Single Elim</option>
                  <option value="DoubleElimination">Double Elim</option>
                  <option value="RoundRobin">Round Robin</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 rounded-lg text-sm transition-colors mt-2">
              Create Draft
            </button>
          </form>
        </div>

        {/* List of Tournaments */}
        {tournaments.map(t => {
          const page = pagesByTournamentId[t.id];
          const pageStatus = page ? (page.published ? 'Live' : 'Draft') : 'No Page';

          return (
          <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl space-y-4 relative group">
             <div className="absolute top-4 right-4 flex items-start gap-2">
               <div className="flex flex-col items-end gap-1">
                 <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
                   t.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                   t.status === 'DRAFT' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                   'bg-slate-800 text-slate-300 border-slate-700'
                 }`}>
                   Tourn: {t.status}
                 </span>
                 <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
                   pageStatus === 'Live' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                   pageStatus === 'Draft' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                   'bg-slate-800 text-slate-300 border-slate-700'
                 }`}>
                   Page: {pageStatus}
                 </span>
               </div>
               <form action={async () => {
                 'use server';
                 await deleteTournament(t.id);
               }}>
                 <button type="submit" className="text-slate-500 hover:text-rose-400 transition-colors mt-1" title="Delete Tournament">
                    <TrashIcon size={16} />
                 </button>
               </form>
             </div>
             
             <div className="mt-2">
               <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                 <TrophyIcon size={14} /> {t.sport}
               </div>
               <h3 className="text-xl font-bold text-white mb-2 pr-16">{t.name}</h3>
               <p className="text-sm text-slate-400">{t.format}</p>
             </div>
             
             <div className="pt-4 border-t border-slate-800/50 flex flex-col gap-2">
                <a href={`/builder?tournament=${t.id}`} className="text-center w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 rounded-lg text-sm transition-colors">
                  Edit Details
                </a>
             </div>
          </div>
        )})}
      </div>
    </div>
  );
}
