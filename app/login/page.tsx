import { login } from './actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 p-8">
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
      </div>
    </main>
  );
}
