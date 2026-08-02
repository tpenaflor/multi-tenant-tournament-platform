import React from 'react';

export interface FeatureSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  featureTitle?: string;
  featureDescription?: string;
  featureTags?: string[];
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  eyebrow = "Spotlight / Main Event",
  title = "Elevate your competitive experience.",
  description = "Join hundreds of players competing for glory, prizes, and ranking points. Our tournaments are designed to bring out your best performance in a professional environment.",
  featureTitle = "Pro Bracket Format.",
  featureDescription = "Experience our newly revamped double-elimination bracket system, ensuring every team gets a fair shot at the finals. Live scoring and instant updates included.",
  featureTags = ["Double Elimination", "Live Scoring", "Cash Prizes"]
}) => {
  return (
    <section className="bg-slate-100 rounded-3xl py-16 md:py-24 my-4 border border-slate-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        
        {/* Left Col - Sticky Title */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">
            {eyebrow}
          </p>
          <h2 className="font-black text-5xl sm:text-6xl tracking-tight leading-[0.95] text-slate-900">
            {title}
          </h2>
        </div>

        {/* Right Col - Content & Cards */}
        <div className="lg:pt-8">
          <p className="max-w-xl text-xl leading-relaxed text-slate-600">
            {description}
          </p>

          {/* Feature Highlight Card */}
          <div className="mt-12 overflow-hidden rounded-3xl bg-slate-900 p-8 sm:p-10 text-white shadow-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" aria-hidden="true"></span>
              New division
            </span>
            <h3 className="mt-6 font-black text-4xl sm:text-5xl tracking-tight leading-none text-white">
              {featureTitle}
            </h3>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
              {featureDescription}
            </p>
            
            <ul className="mt-8 flex flex-wrap gap-3">
              {featureTags.map((tag, idx) => (
                <li 
                  key={idx} 
                  className={`rounded-full px-4 py-2 text-xs font-bold ${idx === 0 ? 'bg-amber-400 text-slate-900' : 'border border-slate-700 text-slate-300'}`}
                >
                  {tag}
                </li>
              ))}
            </ul>
            
            <a href="#register" className="mt-10 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm uppercase tracking-wider transition-all">
              View Full Ruleset <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
