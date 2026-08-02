import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { updatePassword, updateProfile } from './actions';
import { CheckCircleIcon } from '@/components/ui/icons';

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect('/login');
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!dbUser) {
    redirect('/login');
  }

  const error = searchParams.error as string;
  const success = searchParams.success as string;

  let dashboardUrl = '/';
  if (dbUser.role === 'PLATFORM_ADMIN') {
    dashboardUrl = '/platform-admin';
  } else if (dbUser.role === 'ORGANIZER' || dbUser.role === 'ADMIN') {
    dashboardUrl = '/builder';
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
            <p className="text-slate-400 mt-1">Manage your profile and security preferences.</p>
          </div>
          <Link
            href={dashboardUrl}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-sm flex items-center gap-2">
            <CheckCircleIcon size={18} />
            {success}
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white">Profile Information</h2>
          <form action={updateProfile} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={dbUser.name}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder-slate-600"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={dbUser.email}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 opacity-70 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500">Email address cannot be changed currently.</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium shadow-lg shadow-sky-600/25 transition-all text-sm"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white">Security</h2>
          <form action={updatePassword} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder-slate-600"
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder-slate-600"
                placeholder="Confirm new password"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium shadow-lg shadow-sky-600/25 transition-all text-sm"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
