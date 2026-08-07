import React from 'react';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { toggleUserRole, toggleUserBan } from './actions';

export default async function DashboardUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/');

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: {
      organizationMembers: {
        where: { role: 'ORGANIZER' },
        include: { organization: true }
      }
    }
  });

  const activeOrgMember = dbUser?.organizationMembers?.[0];

  if (!dbUser || !activeOrgMember || !activeOrgMember.organization) {
    return <div>No organization found. You do not have organizer access.</div>;
  }

  const organizationId = activeOrgMember.organizationId;
  const org = activeOrgMember.organization;

  const members = await prisma.organizationMember.findMany({
    where: { organizationId },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Manage Users</h2>
          <p className="text-slate-400 mt-1">Users for {org.name}</p>
        </div>
        <a href="/dashboard" className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors">
          Back to Tournaments
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
            {members.map(member => (
              <tr key={member.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-4 px-6 text-white">{member.user.name || 'Unnamed'}</td>
                <td className="py-4 px-6 text-slate-300">{member.user.email}</td>
                <td className="py-4 px-6">
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border inline-block ${
                    member.role === 'ORGANIZER' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {member.role}
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
                  <form action={async () => {
                    'use server';
                    await toggleUserRole(member.id, member.role);
                  }} className="inline-block">
                    <button type="submit" className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded transition-colors disabled:opacity-50" disabled={member.user.id === dbUser.id}>
                      Make {member.role === 'ORGANIZER' ? 'Player' : 'Organizer'}
                    </button>
                  </form>
                  <form action={async () => {
                    'use server';
                    await toggleUserBan(member.id, member.isBanned);
                  }} className="inline-block">
                    <button type="submit" className={`text-xs px-3 py-1.5 rounded transition-colors disabled:opacity-50 ${member.isBanned ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'}`} disabled={member.user.id === dbUser.id}>
                      {member.isBanned ? 'Unban' : 'Ban'}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
