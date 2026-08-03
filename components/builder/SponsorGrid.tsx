import React from 'react';

export interface SponsorGridProps {
  title?: string;
}

export const SponsorGrid: React.FC<SponsorGridProps> = ({
  title = "Official Tournament Partners & Sponsors",
}) => {
  const sponsors = [
    { name: "Apex Paddle Co.", tier: "Title Sponsor", color: "from-tenant-primary/20 to-blue-600/10 border-tenant-primary/40" },
    { name: "ProPickle Gear", tier: "Gold Sponsor", color: "from-amber-500/20 to-yellow-600/10 border-amber-500/40" },
    { name: "HydrateX Electrolytes", tier: "Gold Sponsor", color: "from-amber-500/20 to-yellow-600/10 border-amber-500/40" },
    { name: "Courtside Apparel", tier: "Silver Sponsor", color: "from-slate-700/40 to-slate-800/40 border-slate-700" },
  ];

  return (
    <div className="my-6 rounded-2xl bg-tenant-bg/80 border border-slate-800 p-6 shadow-xl text-tenant-text">
      <h3 className="text-xl font-bold text-center text-white mb-6">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sponsors.map((s, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border bg-gradient-to-b ${s.color} text-center space-y-1 hover:scale-105 transition-all shadow-md`}
          >
            <div className="text-lg font-black text-white">{s.name}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{s.tier}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
