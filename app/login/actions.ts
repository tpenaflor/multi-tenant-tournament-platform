'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function login(formData: FormData) {
  const rawEmail = formData.get('email') as string;
  const email = rawEmail?.toLowerCase().trim() || '';
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

  // Find user in Prisma to determine their global role
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user?.isPlatformAdmin) {
    return redirect('/platform-admin');
  }

  if (!user) {
    return redirect('/login?error=User%20profile%20not%20found%20in%20database');
  }

  return redirect('/');
}

export async function signInWithGoogle(tenantSlug?: string) {
  const supabase = await createClient();
  
  // Pass tenantSlug in query params so callback can know which tenant to enroll them in
  const redirectUrl = new URL(process.env.NEXT_PUBLIC_ROOT_DOMAIN 
    ? (process.env.NODE_ENV === 'production' ? `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/auth/callback` : `http://localhost:3000/auth/callback`)
    : 'http://localhost:3000/auth/callback');

  if (tenantSlug) {
    redirectUrl.searchParams.set('tenant', tenantSlug);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl.toString(),
    },
  });

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    return redirect(data.url);
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/login');
}
