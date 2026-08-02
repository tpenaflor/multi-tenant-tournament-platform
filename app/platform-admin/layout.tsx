import { ReactNode } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { logout } from '@/app/login/actions';
import { SettingsIcon } from '@/components/ui/icons';

export default async function PlatformAdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user: authUser }, error } = await supabase.auth.getUser();
  
  if (error || !authUser?.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: authUser.email.toLowerCase() }
  });

  if (user?.role !== 'PLATFORM_ADMIN') {
    redirect('/'); // Unauthorized users are booted to the home page
  }

  
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">Platform Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-slate-300 hover:text-white transition-colors">Back to Main Site</Link>
            <Link href="/settings" className="text-slate-300 hover:text-white transition-colors" title="Settings">
              <SettingsIcon size={20} />
            </Link>
            <form action={logout}>
              <button type="submit" className="text-sm px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-8">
        {children}
      </main>
    </div>
  );
}
