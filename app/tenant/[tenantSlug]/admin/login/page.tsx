import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { login, signInWithGoogle } from '@/app/actions/auth';
import prisma from '@/lib/prisma';

export default async function AdminLoginPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
  const { tenantSlug } = await params;
  
  // Verify if already logged in via Supabase
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: {
        organizationMembers: {
          where: { role: 'ORGANIZER' },
          include: { organization: true }
        }
      }
    });

    const isOrganizerForThisTenant = dbUser?.organizationMembers?.some(m => m.organization.slug === tenantSlug);
    
    if (isOrganizerForThisTenant || dbUser?.isPlatformAdmin) {
      return redirect('/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-tenant-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-tenant-primary px-8 py-10 text-center">
          <h2 className="text-3xl font-black text-white tracking-tight mb-2">Organizer Access</h2>
          <p className="text-white/80 font-medium">Log in to manage this tenant</p>
        </div>
        
        <div className="p-8">
          <form action={login} className="space-y-4">
            {/* Pass tenantSlug but indicate it's an admin login so it redirects properly */}
            <input type="hidden" name="tenantSlug" value={tenantSlug} />
            <input type="hidden" name="isAdminLogin" value="true" />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-tenant-primary transition-shadow"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-tenant-primary transition-shadow"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-tenant-primary hover:bg-tenant-primary/90 text-white font-bold py-3 rounded-xl shadow-lg transition-all mt-6"
            >
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
