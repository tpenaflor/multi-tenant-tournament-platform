import React from 'react';

export interface MarqueeDividerProps {
  text?: string;
}

export const MarqueeDivider: React.FC<MarqueeDividerProps> = ({
  text = "CHAMPIONSHIP FINALS • NEXT MATCH • PRO DIVISION • "
}) => {
  const repeatedText = Array(10).fill(text).join('');

  return (
    <div className="relative flex overflow-hidden bg-sky-500 py-3 my-8 -mx-4 sm:-mx-8 lg:-mx-12 rotate-1">
      <div className="animate-marquee whitespace-nowrap text-[11px] font-black uppercase tracking-[0.25em] text-slate-900/80">
        {repeatedText}
      </div>
      <div className="absolute top-0 animate-marquee2 whitespace-nowrap text-[11px] font-black uppercase tracking-[0.25em] text-slate-900/80">
        {repeatedText}
      </div>
    </div>
  );
};
