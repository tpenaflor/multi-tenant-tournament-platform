'use server';

import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// In a real app with Supabase Auth, you'd check the user's role here
// via Supabase session -> Prisma User -> Role.
// For now, we will assume this is protected by middleware/layout.

export async function getOrganizations() {
  return await prisma.organization.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function addOrganization(data: { name: string; slug: string }) {
  const email = `admin@${data.slug}.com`;
  const defaultPassword = 'Password123!';

  // Create the user in Supabase Auth
  const { error: authError } = await supabase.auth.signUp({
    email,
    password: defaultPassword,
  });

  if (authError) {
    console.error('Failed to create Supabase auth user:', authError);
    // Depending on your requirements, you might want to throw here
  }

  const org = await prisma.organization.create({
    data: {
      name: data.name,
      slug: data.slug,
      isActive: true,
      users: {
        create: {
          email,
          name: `${data.name} Admin`,
          role: 'ADMIN',
        },
      },
    },
  });
  revalidatePath('/platform-admin');
  return org;
}

export async function toggleOrganizationStatus(id: string, isActive: boolean) {
  const org = await prisma.organization.update({
    where: { id },
    data: { isActive },
  });
  revalidatePath('/platform-admin');
  return org;
}
