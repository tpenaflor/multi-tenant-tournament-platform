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
    // Pass the actual Supabase auth error message to the UI
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // Find user in Prisma to determine their role and organization
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user?.role === 'PLATFORM_ADMIN') {
    return redirect('/platform-admin');
  }

  if ((user?.role === 'ORGANIZER' || user?.role === 'ADMIN') && user.organizationId) {
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
