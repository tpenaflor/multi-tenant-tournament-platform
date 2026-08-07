import { login, signInWithGoogle } from './login/actions';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      include: {
        organizationMembers: {
          where: { role: 'ORGANIZER' }
        }
      }
    });

    if (dbUser?.isPlatformAdmin) {
      redirect('/platform-admin');
    }

    if (dbUser?.organizationMembers && dbUser.organizationMembers.length > 0) {
      redirect('/dashboard');
    }

    // Default for players logging in on the main domain
    redirect('/settings');
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950 p-6 lg:p-12">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        
        {/* Left Side: Hero Branding */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-sm font-semibold tracking-wide uppercase mb-2">
            Bracket Sports Platform MVP
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Multi-Tenant <br className="hidden lg:block" /> Tournament Builder
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0">
            Build interactive sports tournament websites, run automated brackets (Pickleball, Tennis, Badminton), manage court assignments, and track live scores in real-time.
          </p>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-96 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl flex-shrink-0">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Get Started</h2>
            <p className="text-sm text-slate-400">Join the platform or sign in</p>
          </div>

          <form action={login} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-sky-500/20 transition-all mt-6"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between">
            <span className="border-b border-slate-800 w-1/4"></span>
            <span className="text-xs text-center text-slate-500 uppercase font-medium">or continue with</span>
            <span className="border-b border-slate-800 w-1/4"></span>
          </div>

          <form action={async () => {
            'use server';
            await signInWithGoogle(undefined); // No tenant slug for main platform domain
          }}>
            <button
              type="submit"
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 rounded-xl shadow-lg transition-all mt-6 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </form>

        </div>
      </div>
    </main>
  );
}
