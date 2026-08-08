import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      include: {
        organizationMembers: {
          where: { role: 'ORGANIZER' },
          include: { organization: true }
        }
      }
    });

    if (dbUser?.isPlatformAdmin) {
      redirect('/platform-admin');
    }

    if (dbUser?.organizationMembers && dbUser.organizationMembers.length > 0) {
      const org = dbUser.organizationMembers[0].organization;
      redirect(`/tenant/${org.slug}/dashboard`);
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

          <LoginForm />

        </div>
      </div>
    </main>
  );
}
