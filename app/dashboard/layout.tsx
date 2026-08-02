import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { logout } from '@/app/login/actions';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-extrabold tracking-tight text-white">Tenant Dashboard</h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <a href="/builder" className="text-sky-400 hover:text-sky-300 transition-colors">Home Page Builder</a>
          <span className="text-slate-500">|</span>
          <a href="/settings" className="text-slate-300 hover:text-white transition-colors">Settings</a>
          <form action={logout}>
             <button type="submit" className="text-rose-400 hover:text-rose-300 transition-colors ml-4">
                Logout
             </button>
          </form>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
