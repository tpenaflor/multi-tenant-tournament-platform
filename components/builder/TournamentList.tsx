import React from 'react';
import { TrophyIcon, CalendarIcon, MapPinIcon } from '../ui/icons';
import { DesignSettings } from './schema';
import { buildDesignCssVars } from './designUtils';

export interface TournamentListProps {
  title?: string;
  description?: string;
  tournaments?: any[]; // Passed via dynamicData from Server Components
  basePath?: string; // Passed via dynamicData from Server Components
  design?: DesignSettings;
}

export const TournamentList: React.FC<TournamentListProps> = ({
  title = "Upcoming & Active Tournaments",
  description = "Find and register for upcoming events.",
  tournaments,
  basePath = '',
  design,
}) => {
  // Use provided tournaments or fallback to mock data for the builder preview when no real data exists
  const displayTournaments = tournaments && tournaments.length > 0 ? tournaments.map(t => ({
    id: t.id,
    name: t.name,
    sport: t.sport || 'Pickleball',
    status: t.status === 'PUBLISHED' ? 'Active' : t.status === 'COMPLETED' ? 'Completed' : 'Upcoming',
    date: t.startDate ? new Date(t.startDate).toLocaleDateString() : 'TBD',
    location: 'Main Complex', // Placeholder since location isn't in our schema yet
    slug: t.slug,
  })) : [
    {
      id: '1',
      name: 'Summer Open Championship',
      sport: 'Pickleball',
      status: 'Active',
      date: 'Aug 15 - Aug 17, 2026',
      location: 'Main Complex',
      slug: 'summer-open'
    },
    {
      id: '2',
      name: 'Fall Classic Singles',
      sport: 'Tennis',
      status: 'Upcoming',
      date: 'Sep 10 - Sep 12, 2026',
      location: 'North Courts',
      slug: 'fall-classic'
    },
    {
      id: '3',
      name: 'Spring Qualifier',
      sport: 'Pickleball',
      status: 'Completed',
      date: 'Mar 1 - Mar 3, 2026',
      location: 'Main Complex',
      slug: 'spring-qualifier'
    }
  ];

  return (
    <div style={buildDesignCssVars(design)} className="my-8 rounded-2xl bg-tenant-bg border border-slate-800 p-8 shadow-xl text-tenant-text">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white">{title}</h2>
        {description && <p className="text-slate-400 mt-2">{description}</p>}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {displayTournaments.map(t => (
          <div key={t.id} className="bg-tenant-bg border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-tenant-primary uppercase flex items-center gap-1">
                  <TrophyIcon size={12} /> {t.sport}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                  t.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                  t.status === 'Completed' ? 'bg-slate-800 text-slate-400 border-slate-700' :
                  'bg-tenant-primary/10 text-tenant-primary border-tenant-primary/30'
                }`}>
                  {t.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{t.name}</h3>
              
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={14} className="opacity-70" />
                  <span>{t.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon size={14} className="opacity-70" />
                  <span>{t.location}</span>
                </div>
              </div>
            </div>
            
            <a 
              href={`${basePath}/tournaments/${t.slug}`}
              className="w-full mt-5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium py-2 rounded-lg transition-colors text-center inline-block"
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
