'use server';

import { prisma } from '@/lib/prisma';
import { supabaseAdmin, supabase } from '@/lib/supabase';
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

  // Create the user in Supabase Auth using Admin API if service role key is available, fallback to signUp
  let authError = null;
  try {
    const { error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: defaultPassword,
      email_confirm: true,
    });
    authError = error;
  } catch (err) {
    // Fallback to signUp if admin API is not supported with current key
    const { error } = await supabase.auth.signUp({
      email,
      password: defaultPassword,
    });
    authError = error;
  }

  if (authError && !authError.message.includes('already registered')) {
    console.error('Failed to create Supabase auth user:', authError);
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
