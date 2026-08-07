'use server';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function checkTournamentOrganizerAccess(tournamentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! }
  });

  if (!dbUser) throw new Error('Forbidden');

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId }
  });

  if (!tournament) throw new Error('Tournament not found');

  // Check if they are Tenant Organizer
  const orgMember = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: dbUser.id,
        organizationId: tournament.organizationId
      }
    }
  });

  const isTenantOrganizer = orgMember?.role === 'ORGANIZER';

  // Check if they are Temporary Organizer for the tournament
  const tournamentMember = await prisma.tournamentMember.findUnique({
    where: {
      userId_tournamentId: {
        userId: dbUser.id,
        tournamentId: tournament.id
      }
    }
  });

  const isTempOrganizer = tournamentMember?.role === 'TEMPORARY_ORGANIZER';

  if (!isTenantOrganizer && !isTempOrganizer) {
    throw new Error('Forbidden: You are not an organizer for this tournament');
  }

  return { tournamentId: tournament.id, organizationId: tournament.organizationId };
}

export async function toggleTournamentRole(memberId: string, currentRole: string, tournamentId: string, currentPath: string) {
  await checkTournamentOrganizerAccess(tournamentId);

  await prisma.tournamentMember.update({
    where: { id: memberId },
    data: { role: currentRole === 'TEMPORARY_ORGANIZER' ? 'PLAYER' : 'TEMPORARY_ORGANIZER' }
  });

  revalidatePath(currentPath);
}

export async function kickTournamentPlayer(memberId: string, tournamentId: string, currentPath: string) {
  await checkTournamentOrganizerAccess(tournamentId);

  await prisma.tournamentMember.delete({
    where: { id: memberId }
  });

  revalidatePath(currentPath);
}

export async function toggleTournamentBan(memberId: string, currentlyBanned: boolean, tournamentId: string, currentPath: string) {
  await checkTournamentOrganizerAccess(tournamentId);

  await prisma.tournamentMember.update({
    where: { id: memberId },
    data: { isBanned: !currentlyBanned }
  });

  revalidatePath(currentPath);
}
