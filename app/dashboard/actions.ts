'use server';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createTournament(formData: FormData) {
  const name = formData.get('name') as string;
  const sport = formData.get('sport') as string;
  const format = formData.get('format') as string;

  if (!name) {
    throw new Error('Tournament name is required');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

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

  const organizationId = activeOrgMember.organizationId;

  // Basic slugification for tournament (must be unique per organization)
  let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  // ensure slug uniqueness in this org
  let existing = await prisma.tournament.findUnique({
    where: {
      organizationId_slug: {
        organizationId,
        slug
      }
    }
  });

  let counter = 1;
  while(existing) {
    const newSlug = `${slug}-${counter}`;
    existing = await prisma.tournament.findUnique({
      where: {
        organizationId_slug: {
          organizationId,
          slug: newSlug
        }
      }
    });
    if (!existing) {
      slug = newSlug;
      break;
    }
    counter++;
  }

  await prisma.tournament.create({
    data: {
      name,
      slug,
      sport,
      format,
      status: 'DRAFT',
      organizationId
    }
  });

  revalidatePath('/dashboard');
}

export async function deleteTournament(id: string) {
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

  const organizationId = activeOrgMember.organizationId;

  const tournament = await prisma.tournament.findUnique({
    where: { id }
  });

  if (!tournament || tournament.organizationId !== organizationId) {
    throw new Error('Forbidden or Not Found');
  }

  await prisma.tournament.delete({
    where: { id }
  });

  revalidatePath('/dashboard');
}
