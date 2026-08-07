'use server';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signUpForTournament(tournamentId: string, currentPath: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! }
  });

  if (!dbUser) {
    throw new Error('User not found');
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId }
  });

  if (!tournament) {
    throw new Error('Tournament not found');
  }

  // Ensure user is an OrganizationMember first
  const orgMember = await prisma.organizationMember.upsert({
    where: {
      userId_organizationId: {
        userId: dbUser.id,
        organizationId: tournament.organizationId
      }
    },
    update: {},
    create: {
      userId: dbUser.id,
      organizationId: tournament.organizationId,
      role: 'PLAYER'
    }
  });

  if (orgMember.isBanned) {
    throw new Error('You are banned from this organization');
  }

  // Sign up
  await prisma.tournamentMember.upsert({
    where: {
      userId_tournamentId: {
        userId: dbUser.id,
        tournamentId: tournament.id
      }
    },
    update: {}, // if already signed up, do nothing
    create: {
      userId: dbUser.id,
      tournamentId: tournament.id,
      role: 'PLAYER'
    }
  });

  revalidatePath(currentPath);
}
