export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950">
      <div className="max-w-4xl w-full text-center space-y-6">
        <div className="inline-block px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-sm font-semibold tracking-wide uppercase mb-2">
          Bracket Sports Platform MVP
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          Multi-Tenant Tournament Builder
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Build interactive sports tournament websites, run automated brackets (Pickleball, Tennis, Badminton), manage court assignments, and track live scores in real-time.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <a
            href="/login"
            className="px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium shadow-lg shadow-sky-600/25 transition-all"
          >
            Login
          </a>
        </div>
      </div>
    </main>
  );
}
