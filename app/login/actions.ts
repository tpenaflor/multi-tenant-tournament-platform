'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Basic error handling for the UI to read
    return redirect('/login?error=Could not authenticate user');
  }

  // Find user in Prisma to determine their role and organization
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user?.role === 'PLATFORM_ADMIN') {
    return redirect('/platform-admin');
  }

  if (user?.role === 'ORGANIZER' && user.organizationId) {
    const org = await prisma.organization.findUnique({
      where: { id: user.organizationId },
    });
    if (org) {
      // NOTE: Normally you'd redirect to a dedicated dashboard. 
      // For now, redirecting to the builder page or the tenant page.
      return redirect(`/builder`);
    }
  }

  return redirect('/');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/login');
}
