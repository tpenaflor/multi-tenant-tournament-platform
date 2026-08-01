import React from 'react';
import { LiveBracketEmbed } from '@/components/builder/LiveBracketEmbed';
import { TrophyIcon, UsersIcon, CalendarIcon, MapPinIcon, PlusIcon } from '@/components/ui/icons';

export default function TournamentsPage() {
  const mockTournaments = [
    {
      id: 'tourn-1',
      name: 'Atlanta Pickleball Summer Championship',
      sport: 'Pickleball',
      format: 'Double Elimination',
      division: "Men's & Women's Doubles 4.0-5.0",
      date: 'August 15-17, 2026',
      location: 'Atlanta Metro Sports Complex',
      teamsRegistered: 32,
      maxTeams: 32,
      status: 'In Progress (Quarterfinals)',
    },
    {
      id: 'tourn-2',
      name: 'Peach State Classic Tennis Open',
      sport: 'Tennis',
      format: 'Single Elimination',
      division: 'Open Singles',
      date: 'September 5-7, 2026',
      location: 'Piedmont Tennis Center',
      teamsRegistered: 24,
      maxTeams: 64,
      status: 'Registration Open',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/30 px-3 py-1 rounded-full mb-2">
            <TrophyIcon size={14} /> Active Tournaments
          </div>
          <h1 className="text-3xl font-extrabold text-white">Tournament Directory & Live Brackets</h1>
        </div>
        <a
          href="/builder"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-lg shadow-sky-500/20 transition-all self-start sm:self-auto"
        >
          <PlusIcon size={16} /> Create Tournament Event
        </a>
      </div>

      {/* Tournament Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {mockTournaments.map((t) => (
          <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase">{t.sport}</span>
                <h3 className="text-xl font-bold text-white">{t.name}</h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                {t.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className="text-slate-400" />
                <span>{t.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon size={16} className="text-slate-400" />
                <span>{t.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <UsersIcon size={16} className="text-slate-400" />
                <span>
                  {t.teamsRegistered} / {t.maxTeams} Teams Registered
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <a
                href="#live-bracket"
                className="flex-1 text-center py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-all"
              >
                View Live Brackets
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Live Bracket Tree */}
      <div id="live-bracket">
        <LiveBracketEmbed divisionName="Featured: Atlanta Open Grand Finals" format="Double Elimination" />
      </div>
    </div>
  );
}
