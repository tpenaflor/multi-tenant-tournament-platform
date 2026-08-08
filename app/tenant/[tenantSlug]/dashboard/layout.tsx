import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardHeader from './DashboardHeader';

export default async function DashboardLayout(props: {
  children: React.ReactNode;
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const defaultThemeStyles = {
    '--tenant-primary': '#0ea5e9',
    '--tenant-bg': '#020617',
    '--tenant-text': '#f8fafc',
    '--tenant-accent': '#ec4899',
    '--tenant-bg-alt': '#0f172a',
    '--tenant-border': '#334155',
    '--tenant-font-sans': 'ui-sans-serif, system-ui, sans-serif',
    '--tenant-font-serif': 'ui-serif, Georgia, serif',
    '--tenant-primary-rgb': '14 165 233',
    '--tenant-bg-rgb': '2 6 23',
    '--tenant-text-rgb': '248 250 252',
  } as React.CSSProperties;

  return (
    <div style={defaultThemeStyles} className="min-h-screen bg-tenant-bg text-tenant-text flex flex-col">
      <DashboardHeader tenantSlug={tenantSlug} />
      
      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
        {props.children}
      </main>
    </div>
  );
}
