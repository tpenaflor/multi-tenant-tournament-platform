import React from 'react';

export interface LiveBracketEmbedProps {
  divisionName?: string;
  tournamentName?: string;
  division?: string;
  format?: string;
}

export const LiveBracketEmbed: React.FC<LiveBracketEmbedProps> = ({
  divisionName,
  tournamentName,
  division,
  format = "Double Elimination",
}) => {
  const displayTitle = tournamentName || divisionName || division || "Men's Doubles Open 4.5+";

  return (
    <div id="brackets" className="my-6 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Live Tournament Bracket</span>
          <h2 className="text-2xl font-bold text-white mt-1">{displayTitle}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium animate-pulse">
            ● Live Updates
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
            {format}
          </span>
        </div>
      </div>

      {/* Bracket Tree Visual Simulation */}
      <div className="overflow-x-auto pb-4">
        <div className="flex items-center gap-8 min-w-[700px] p-2">
          {/* Quarterfinals */}
          <div className="space-y-6 w-56">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quarterfinals</div>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1.5 shadow-md">
              <div className="flex justify-between items-center text-sm font-semibold text-white">
                <span>1. J. Smith / M. Davis</span>
                <span className="bg-sky-600 px-2 py-0.5 rounded text-xs">11</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-400">
                <span>8. T. Wilson / R. Miller</span>
                <span className="px-2 py-0.5 text-xs">4</span>
              </div>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1.5 shadow-md">
              <div className="flex justify-between items-center text-sm text-slate-400">
                <span>4. A. Johnson / B. Lee</span>
                <span className="px-2 py-0.5 text-xs">8</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold text-white">
                <span>5. C. Martinez / E. Clark</span>
                <span className="bg-sky-600 px-2 py-0.5 rounded text-xs">11</span>
              </div>
            </div>
          </div>

          {/* Semifinals */}
          <div className="space-y-12 w-56">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Semifinals</div>
            <div className="p-3 bg-slate-800/90 rounded-xl border border-sky-500/40 space-y-1.5 shadow-lg">
              <div className="flex justify-between items-center text-sm font-semibold text-white">
                <span>J. Smith / M. Davis</span>
                <span className="bg-emerald-600 px-2 py-0.5 rounded text-xs">11</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-400">
                <span>C. Martinez / E. Clark</span>
                <span className="px-2 py-0.5 text-xs">9</span>
              </div>
            </div>
          </div>

          {/* Finals */}
          <div className="w-56">
            <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">Grand Finals 🏆</div>
            <div className="p-4 bg-gradient-to-br from-slate-800 to-sky-950 rounded-xl border-2 border-sky-400 space-y-2 shadow-2xl">
              <div className="text-xs text-sky-300 font-bold uppercase">Championship Match</div>
              <div className="flex justify-between items-center text-sm font-bold text-white">
                <span>J. Smith / M. Davis</span>
                <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-black text-xs">ON COURT 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
