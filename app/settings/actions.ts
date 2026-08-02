'use server';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password || password.length < 6) {
    return redirect(`/settings?error=${encodeURIComponent('Password must be at least 6 characters.')}`);
  }

  if (password !== confirmPassword) {
    return redirect(`/settings?error=${encodeURIComponent('Passwords do not match.')}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return redirect(`/settings?error=${encodeURIComponent(error.message)}`);
  }

  return redirect(`/settings?success=${encodeURIComponent('Password updated successfully.')}`);
}

export async function updateProfile(formData: FormData) {
  const name = formData.get('name') as string;

  if (!name || name.trim() === '') {
    return redirect(`/settings?error=${encodeURIComponent('Name cannot be empty.')}`);
  }
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return redirect('/login');
  }

  try {
    await prisma.user.update({
      where: { email: user.email },
      data: { name },
    });
  } catch (error: any) {
    return redirect(`/settings?error=${encodeURIComponent(error.message || 'Failed to update profile.')}`);
  }

  return redirect(`/settings?success=${encodeURIComponent('Profile updated successfully.')}`);
}
