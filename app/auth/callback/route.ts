import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const tenantSlug = requestUrl.searchParams.get('tenant');
  
  if (code) {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && session?.user) {
      // Sync with Prisma
      const email = session.user.email!;
      const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || null;
      
      const prismaUser = await prisma.user.upsert({
        where: { email },
        update: {}, // Don't overwrite name if they already exist
        create: {
          id: session.user.id, // Keep IDs synced if possible
          email,
          name,
        }
      });
      
      // Auto-enroll in tenant if tenantSlug is present
      if (tenantSlug) {
        const org = await prisma.organization.findUnique({
          where: { slug: tenantSlug }
        });
        
        if (org) {
          // Check if already a member, if not create as PLAYER
          const existingMember = await prisma.organizationMember.findUnique({
            where: {
              userId_organizationId: {
                userId: prismaUser.id,
                organizationId: org.id
              }
            }
          });
          
          if (!existingMember) {
            await prisma.organizationMember.create({
              data: {
                userId: prismaUser.id,
                organizationId: org.id,
                role: 'PLAYER'
              }
            });
          }
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  let redirectUrl = '/';

  if (!tenantSlug) {
    // If they logged in on the main domain via OAuth, route them properly
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: {
          organizationMembers: {
            where: { role: 'ORGANIZER' }
          }
        }
      });

      if (dbUser?.isPlatformAdmin) {
        redirectUrl = '/platform-admin';
      } else if (dbUser?.organizationMembers && dbUser.organizationMembers.length > 0) {
        redirectUrl = '/dashboard';
      } else {
        redirectUrl = '/settings';
      }
    }
  }

  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
