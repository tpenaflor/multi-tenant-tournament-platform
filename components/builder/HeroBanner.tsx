import React from 'react';
import { DesignSettings } from './schema';
import { buildDesignCssVars } from './designUtils';

export interface HeroBannerProps {
  title?: string;
  titleImage?: string;
  subtitle?: string;
  date?: string;
  location?: string;
  ctaText?: string;
  ctaLink?: string;
  design?: DesignSettings;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title = "Summer Pickleball Championship 2026",
  titleImage,
  subtitle = "The largest regional bracket tournament featuring singles, doubles, and mixed divisions.",
  date = "August 15-17, 2026",
  location = "Atlanta Sports Complex, Court 1-12",
  ctaText = "Register Now",
  ctaLink = "#register",
  design,
}) => {
  return (
    <section style={buildDesignCssVars(design)} className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-900 via-indigo-950 to-tenant-bg border border-tenant-primary/20 p-8 md:p-12 shadow-2xl text-tenant-text my-4">
      <div className="relative z-10 max-w-3xl space-y-4">
        <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wider text-tenant-primary">
          <span className="bg-tenant-primary/10 border border-tenant-primary/30 px-3 py-1 rounded-full">📍 {location}</span>
          <span className="bg-tenant-primary/10 border border-tenant-primary/30 px-3 py-1 rounded-full">📅 {date}</span>
        </div>
        {titleImage ? (
          <img src={titleImage} alt={title} className="max-h-28 object-contain" />
        ) : (
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
            {title}
          </h1>
        )}
        <p className="text-slate-300 text-lg md:text-xl font-normal leading-relaxed">
          {subtitle}
        </p>
        <div className="pt-2 flex flex-wrap gap-4">
          <a
            href={ctaLink}
            className="px-8 py-3.5 rounded-xl bg-tenant-primary hover:bg-tenant-primary text-white font-bold shadow-lg shadow-tenant-primary/30 transition-all hover:scale-105 active:scale-95"
          >
            {ctaText}
          </a>
          <a
            href="#brackets"
            className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition-all"
          >
            View Live Brackets
          </a>
        </div>
      </div>
    </section>
  );
};
