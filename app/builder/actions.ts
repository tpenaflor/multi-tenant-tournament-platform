'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function savePageLayout(components: any[], tournamentId?: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if the organization exists for this user
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      include: { organization: true },
    });

    if (!dbUser || !dbUser.organization) {
      throw new Error('User is not assigned to an organization');
    }

    const org = dbUser.organization;
    const slug = tournamentId || '/';

    // Upsert the page for this organization
    await prisma.page.upsert({
      where: {
        organizationId_slug: {
          organizationId: org.id,
          slug,
        },
      },
      update: {
        components: JSON.stringify(components),
      },
      create: {
        title: tournamentId ? 'Tournament Page' : 'Home Page',
        slug,
        organizationId: org.id,
        components: JSON.stringify(components),
        published: true,
      },
    });

    // Revalidate the tenant page path so the changes appear immediately
    revalidatePath(`/tenant/${org.slug}`);

    return { success: true };
  } catch (error: any) {
    console.error('Error saving page layout:', error);
    return { success: false, error: error.message };
  }
}
