'use server';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function checkOrganizerAccess() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: {
      organizationMembers: {
        where: { role: 'ORGANIZER' }
      }
    }
  });

  const activeOrgMember = dbUser?.organizationMembers?.[0];

  if (!dbUser || !activeOrgMember) {
    throw new Error('Forbidden');
  }

  return { dbUser, organizationId: activeOrgMember.organizationId };
}

export async function toggleUserRole(memberId: string, currentRole: string) {
  const { organizationId } = await checkOrganizerAccess();
  
  const member = await prisma.organizationMember.findUnique({
    where: { id: memberId }
  });

  if (!member || member.organizationId !== organizationId) {
    throw new Error('Forbidden');
  }

  await prisma.organizationMember.update({
    where: { id: memberId },
    data: { role: currentRole === 'ORGANIZER' ? 'PLAYER' : 'ORGANIZER' }
  });

  revalidatePath('/dashboard/users');
}

export async function toggleUserBan(memberId: string, currentlyBanned: boolean) {
  const { organizationId } = await checkOrganizerAccess();
  
  const member = await prisma.organizationMember.findUnique({
    where: { id: memberId }
  });

  if (!member || member.organizationId !== organizationId) {
    throw new Error('Forbidden');
  }

  await prisma.organizationMember.update({
    where: { id: memberId },
    data: { isBanned: !currentlyBanned }
  });

  revalidatePath('/dashboard/users');
}
