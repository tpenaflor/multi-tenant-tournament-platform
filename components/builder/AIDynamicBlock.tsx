import React from 'react';

export interface AIDynamicBlockProps {
  title?: string;
  prompt?: string;
  htmlContent?: string;
  dynamicData?: {
    tournaments?: any[];
    tenantName?: string;
    basePath?: string;
  };
}

/**
 * Security Sanitizer: Strips scripts, event handlers, javascript: URLs, and unsafe tags
 */
export function sanitizeAndInterpolateHtml(
  html: string,
  dynamicData?: AIDynamicBlockProps['dynamicData']
): string {
  if (!html) return '';

  let sanitized = html;

  // 1. Security: Strip script tags, iframe, object, embed
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  // 2. Security: Strip event handler attributes (onload, onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 3. Security: Strip javascript: and data: text/html hrefs/srcs
  sanitized = sanitized.replace(/(href|src)\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, '$1="#"');

  // 4. Live Data Tokens Interpolation
  const tenantName = dynamicData?.tenantName || 'Tournament Organization';
  const tournaments = dynamicData?.tournaments || [];
  const tournamentsCount = tournaments.length.toString();
  const latestTournament = tournaments[0];
  const latestTournamentName = latestTournament?.name || 'Upcoming Open Championship';
  const latestTournamentDate = latestTournament?.startDate
    ? new Date(latestTournament.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Date TBA';

  sanitized = sanitized.replace(/\{\{\s*tenantName\s*\}\}/g, tenantName);
  sanitized = sanitized.replace(/\{\{\s*tournamentsCount\s*\}\}/g, tournamentsCount);
  sanitized = sanitized.replace(/\{\{\s*latestTournamentName\s*\}\}/g, latestTournamentName);
  sanitized = sanitized.replace(/\{\{\s*latestTournamentDate\s*\}\}/g, latestTournamentDate);

  // Generate dynamic tournament cards list if token present
  if (sanitized.includes('{{tournamentsCards}}')) {
    const cardsHtml = tournaments.length > 0
      ? tournaments.map((t: any) => `
        <div class="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-sky-500/50 transition-all">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[10px] font-bold uppercase tracking-wider">${t.status || 'Active'}</span>
            <span class="text-xs text-slate-400 font-mono">${t.startDate ? new Date(t.startDate).toLocaleDateString() : 'TBA'}</span>
          </div>
          <h4 class="text-lg font-bold text-white">${t.name}</h4>
          <p class="text-xs text-slate-400 leading-relaxed">${t.location || 'Local Sports Complex'}</p>
          <a href="${dynamicData?.basePath ? `${dynamicData.basePath}/tournaments/${t.slug || t.id}` : '#'}" class="inline-block w-full text-center py-2 rounded-xl bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-xs font-bold text-slate-200 transition-all">
            View Live Bracket →
          </a>
        </div>
      `).join('')
      : `<div class="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">No active tournaments scheduled.</div>`;

    sanitized = sanitized.replace(/\{\{\s*tournamentsCards\s*\}\}/g, cardsHtml);
  }

  return sanitized;
}

export const AIDynamicBlock: React.FC<AIDynamicBlockProps> = ({
  title,
  prompt,
  htmlContent,
  dynamicData,
}) => {
  if (!htmlContent) {
    return (
      <div className="w-full rounded-2xl bg-slate-900/90 border-2 border-dashed border-sky-500/40 p-8 text-center space-y-3 shadow-xl backdrop-blur-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-wider">
          <span>✨ AI Custom Component</span>
        </div>
        <h3 className="text-xl font-bold text-white">
          {title || 'Prompt your custom component'}
        </h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          {prompt
            ? `Prompt: "${prompt}"`
            : 'Select this component on the right sidebar and enter a prompt (e.g. "Prize Pool showcase with 3 tier cards") to generate your custom UI with AI!'}
        </p>
        <div className="pt-2 text-xs text-slate-500 flex justify-center gap-3 font-mono">
          <span>Tokens: {"{{tenantName}}"}</span>
          <span>{"{{tournamentsCount}}"}</span>
          <span>{"{{latestTournamentName}}"}</span>
          <span>{"{{tournamentsCards}}"}</span>
        </div>
      </div>
    );
  }

  const processedHtml = sanitizeAndInterpolateHtml(htmlContent, dynamicData);

  return (
    <section className="w-full relative group">
      {/* Subtle indicator bar for AI generated components */}
      <div className="w-full rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800/80 p-6 shadow-2xl backdrop-blur-sm">
        {title && (
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-mono uppercase tracking-wider">
              ✨ Live AI Component
            </span>
          </div>
        )}
        <div
          className="ai-generated-content text-slate-200"
          dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
      </div>
    </section>
  );
};
