import React from 'react';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { toggleTournamentRole, kickTournamentPlayer, toggleTournamentBan } from './actions';

interface ManageTournamentPageProps {
  params: Promise<{
    tenantSlug: string;
    tournamentSlug: string;
  }>;
}

export default async function ManageTournamentPage({ params }: ManageTournamentPageProps) {
  const { tenantSlug, tournamentSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const org = await prisma.organization.findFirst({
    where: {
      OR: [
        { slug: tenantSlug },
        { customDomain: tenantSlug },
        ...(tenantSlug.includes('.') ? [] : [{ customDomain: { startsWith: `${tenantSlug}.` } }]),
      ],
    },
  });

  if (!org) return <div>Tenant not found</div>;

  const tournament = await prisma.tournament.findFirst({
    where: { organizationId: org.id, slug: tournamentSlug },
    include: {
      members: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!tournament) return <div>Tournament not found</div>;

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! }
  });

  const orgMember = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: dbUser!.id,
        organizationId: org.id
      }
    }
  });

  const isTenantOrganizer = orgMember?.role === 'ORGANIZER';

  const myTournamentMember = tournament.members.find(m => m.userId === dbUser!.id);
  const isTempOrganizer = myTournamentMember?.role === 'TEMPORARY_ORGANIZER';

  if (!isTenantOrganizer && !isTempOrganizer) {
    return <div>Forbidden: You do not have organizer access to this tournament.</div>;
  }

  const currentPath = `/tournaments/${tournamentSlug}/manage`;

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Manage Players</h2>
            <p className="text-slate-400 mt-1">Tournament: {tournament.name}</p>
          </div>
          <a href={`/tournaments/${tournamentSlug}`} className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors">
            View Tournament
          </a>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-sm">
                <th className="py-4 px-6 font-medium">Name</th>
                <th className="py-4 px-6 font-medium">Email</th>
                <th className="py-4 px-6 font-medium">Role</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tournament.members.map(member => (
                <tr key={member.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 text-white">{member.user.name || 'Unnamed'}</td>
                  <td className="py-4 px-6 text-slate-300">{member.user.email}</td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border inline-block ${
                      member.role === 'TEMPORARY_ORGANIZER' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {member.role === 'TEMPORARY_ORGANIZER' ? 'Temp Organizer' : 'Player'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {member.isBanned ? (
                      <span className="text-[10px] uppercase font-bold px-2 py-1 rounded border bg-rose-500/10 text-rose-400 border-rose-500/30 inline-block">Banned</span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold px-2 py-1 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 inline-block">Active</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    {isTenantOrganizer && (
                      <form action={async () => {
                        'use server';
                        await toggleTournamentRole(member.id, member.role, tournament.id, currentPath);
                      }} className="inline-block">
                        <button type="submit" className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded transition-colors disabled:opacity-50" disabled={member.user.id === dbUser!.id}>
                          Make {member.role === 'TEMPORARY_ORGANIZER' ? 'Player' : 'Organizer'}
                        </button>
                      </form>
                    )}
                    <form action={async () => {
                      'use server';
                      await kickTournamentPlayer(member.id, tournament.id, currentPath);
                    }} className="inline-block">
                      <button type="submit" className="text-xs bg-slate-800 hover:bg-slate-700 text-rose-400 px-3 py-1.5 rounded transition-colors disabled:opacity-50" disabled={member.user.id === dbUser!.id}>
                        Kick
                      </button>
                    </form>
                    <form action={async () => {
                      'use server';
                      await toggleTournamentBan(member.id, member.isBanned, tournament.id, currentPath);
                    }} className="inline-block">
                      <button type="submit" className={`text-xs px-3 py-1.5 rounded transition-colors disabled:opacity-50 ${member.isBanned ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'}`} disabled={member.user.id === dbUser!.id}>
                        {member.isBanned ? 'Unban' : 'Ban'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tournament.members.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              No players have signed up yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
