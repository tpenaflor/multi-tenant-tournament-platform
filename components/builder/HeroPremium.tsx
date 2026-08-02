import React from 'react';

export interface HeroPremiumProps {
  title?: string;
  subtitle?: string;
  overline?: string;
  ctaText?: string;
  ctaLink?: string;
  eventDate?: string;
}

export const HeroPremium: React.FC<HeroPremiumProps> = ({
  title = "Championship Series.",
  subtitle = "The ultimate proving ground. Are you ready to take the crown?",
  overline = "Pro Division presents",
  ctaText = "Register Now",
  ctaLink = "#",
  eventDate = "November 15, 2026"
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl my-4 text-white">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-900 via-slate-900 to-slate-900" aria-hidden="true"></div>
      <div className="relative z-10 grid gap-12 py-16 px-8 md:px-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
        
        {/* Left Content */}
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-400 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_12px_#38bdf8]"></span>
            The next chapter
          </div>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
            {overline}
          </p>
          <h1 className="mt-4 font-black text-6xl md:text-8xl tracking-tighter leading-[0.85] text-white">
            {title}
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-400">
            {subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={ctaLink} className="px-8 py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-sm uppercase tracking-wider transition-all">
              {ctaText} <span aria-hidden="true">↘</span>
            </a>
            <a href="#" className="px-8 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm uppercase tracking-wider transition-all">
              Past Events
            </a>
          </div>
        </div>

        {/* Right Content - Season Pass Card */}
        <aside className="rounded-3xl border border-slate-700 bg-slate-800/30 p-8 backdrop-blur-sm lg:justify-self-end w-full">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">S1 / FINALS</span>
            <span className="rounded-full border border-slate-600 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Up next</span>
          </div>
          <div className="my-8">
            <span className="font-black text-7xl md:text-8xl leading-none tracking-tighter text-white">Q4</span>
            <div className="mt-4 h-px bg-gradient-to-r from-sky-500 via-amber-400 to-transparent"></div>
          </div>
          <p className="text-2xl font-black tracking-tight text-white">
            {eventDate}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Registration closes soon. Secure your spot in the bracket.
          </p>
          
          <div className="mt-8 border-t border-slate-700/50 pt-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-3">Countdown</p>
            <div className="grid grid-cols-4 gap-2">
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 px-1 py-3 text-center">
                <span className="block text-2xl font-black tracking-tight text-white">12</span>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">Days</span>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 px-1 py-3 text-center">
                <span className="block text-2xl font-black tracking-tight text-white">04</span>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">Hours</span>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 px-1 py-3 text-center">
                <span className="block text-2xl font-black tracking-tight text-white">45</span>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">Mins</span>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 px-1 py-3 text-center">
                <span className="block text-2xl font-black tracking-tight text-white">22</span>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">Secs</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </section>
  );
};
