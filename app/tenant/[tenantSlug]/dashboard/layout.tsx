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

  return (
    <div className="min-h-screen bg-tenant-bg text-tenant-text flex flex-col">
      <DashboardHeader tenantSlug={tenantSlug} />
      
      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
        {props.children}
      </main>
    </div>
  );
}
