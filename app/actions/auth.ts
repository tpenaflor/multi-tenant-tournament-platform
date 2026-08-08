'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function login(formData: FormData) {
  const rawEmail = formData.get('email') as string;
  const email = rawEmail?.toLowerCase().trim() || '';
  const password = formData.get('password') as string;

  const tenantSlug = formData.get('tenantSlug') as string | undefined;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Pass the actual Supabase auth error message to the UI
    return redirect(`/?error=${encodeURIComponent(error.message)}`);
  }

  // Find user in Prisma to determine their global role
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      organizationMembers: {
        where: { role: 'ORGANIZER' },
        include: { organization: true }
      }
    }
  });

  if (user?.isPlatformAdmin) {
    return redirect('/platform-admin');
  }

  const isAdminLogin = formData.get('isAdminLogin') === 'true';

  // If they logged in on a specific tenant site, don't redirect them across tenants
  if (tenantSlug) {
    // Check if they are an organizer for THIS tenant
    const isOrganizerForThisTenant = user?.organizationMembers?.some(m => m.organization.slug === tenantSlug);
    if (isOrganizerForThisTenant) {
      return redirect('/dashboard');
    }

    if (isAdminLogin) {
      return { error: 'You do not have organizer access for this tenant.' };
    }
    
    // Otherwise, they just logged in as a player, stay on the tenant site
    return redirect('/');
  }

  // If they logged in on the main platform, redirect them to their primary organization if they have one
  if (user?.organizationMembers && user.organizationMembers.length > 0) {
    const org = user.organizationMembers[0].organization;
    // Construct the absolute URL to ensure we hit the correct domain
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'multi-tenant-tournament-platform.vercel.app';
    const protocol = rootDomain.includes('localhost') ? 'http' : 'https';
    const orgDomain = org.customDomain || `${org.slug}.${rootDomain}`;
    return redirect(`${protocol}://${orgDomain}/dashboard`);
  }

  if (!user) {
    return redirect('/?error=User%20profile%20not%20found%20in%20database');
  }

  // Fallback
  return redirect('/settings');
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
    return redirect(`/?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    return redirect(data.url);
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/');
}
