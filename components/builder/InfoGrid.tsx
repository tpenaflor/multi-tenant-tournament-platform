import React from 'react';

export interface InfoGridProps {
  items?: { title: string; subtitle: string; description: string; highlight?: boolean }[];
}

export const InfoGrid: React.FC<InfoGridProps> = ({
  items = [
    { title: "Date", subtitle: "Nov 15, 2026", description: "Main Arena", highlight: false },
    { title: "Prize Pool", subtitle: "$10,000", description: "Distributed across top 3", highlight: true },
    { title: "Registration", subtitle: "Open Now", description: "Early bird pricing available", highlight: true }
  ]
}) => {
  return (
    <div className="grid gap-1 overflow-hidden rounded-3xl bg-slate-200/50 sm:grid-cols-3 my-4">
      {items.map((item, index) => (
        <div key={index} className="relative bg-white p-8">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">
              0{index + 1}
            </span>
            {item.highlight && (
              <span className="rounded-full bg-rose-500 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">
                New
              </span>
            )}
          </div>
          <p className="mt-8 font-black text-2xl tracking-tight text-tenant-bg">
            {item.title}
          </p>
          <p className="mt-2 text-sm font-bold text-tenant-bg">
            {item.subtitle}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
};
