import React from 'react';
import { DesignSettings } from './schema';
import { buildDesignCssVars } from './designUtils';

export interface MarqueeDividerProps {
  text?: string;
  design?: DesignSettings;
}

export const MarqueeDivider: React.FC<MarqueeDividerProps> = ({
  text = "CHAMPIONSHIP FINALS • NEXT MATCH • PRO DIVISION • ",
  design,
}) => {
  const repeatedText = Array(10).fill(text).join('');

  return (
    <div style={buildDesignCssVars(design)} className="relative flex overflow-hidden bg-tenant-primary py-3 my-8 -mx-4 sm:-mx-8 lg:-mx-12 rotate-1">
      <div className="animate-marquee whitespace-nowrap text-[11px] font-black uppercase tracking-[0.25em] text-tenant-bg/80">
        {repeatedText}
      </div>
      <div className="absolute top-0 animate-marquee2 whitespace-nowrap text-[11px] font-black uppercase tracking-[0.25em] text-tenant-bg/80">
        {repeatedText}
      </div>
    </div>
  );
};
