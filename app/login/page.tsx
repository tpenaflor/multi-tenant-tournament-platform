import { login } from './actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <main className="flex-1 flex items-center justify-center bg-slate-950 p-8">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to your Bracket Sports account</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
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
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2.5 rounded-lg shadow-lg shadow-sky-500/20 transition-all mt-6"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="border-b border-slate-700 w-1/5 lg:w-1/4"></span>
          <a href="#" className="text-xs text-center text-slate-500 uppercase">or sign in with</a>
          <span className="border-b border-slate-700 w-1/5 lg:w-1/4"></span>
        </div>

        <form action={async () => {
          'use server';
          // Extract tenant slug from host
          const { headers } = await import('next/headers');
          const headersList = await headers();
          const host = headersList.get('host') || '';
          const hostWithoutPort = host.split(':')[0];
          
          let tenantSlug = undefined;
          const rootDomain = (
            process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
            process.env.VERCEL_URL ||
            'multi-tenant-tournament-platform.vercel.app'
          ).toLowerCase().split(':')[0];
          
          if (hostWithoutPort.endsWith(`.${rootDomain}`)) {
            tenantSlug = hostWithoutPort.substring(0, hostWithoutPort.length - rootDomain.length - 1);
          } else if (hostWithoutPort.endsWith('.localhost')) {
            tenantSlug = hostWithoutPort.substring(0, hostWithoutPort.length - '.localhost'.length);
          }
          
          const { signInWithGoogle } = await import('./actions');
          await signInWithGoogle(tenantSlug);
        }}>
          <button
            type="submit"
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-2.5 rounded-lg shadow-lg transition-all mt-6 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </form>
      </div>
    </main>
  );
}
