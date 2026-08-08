'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { isAiComponentEnabled } from '@/lib/featureFlags';

export async function savePageLayout(tenantSlug: string, components: any[], tournamentId?: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const org = await prisma.organization.findFirst({
      where: {
        OR: [
          { slug: tenantSlug },
          { customDomain: tenantSlug },
          ...(tenantSlug.includes('.') ? [] : [{ customDomain: { startsWith: `${tenantSlug}.` } }]),
        ],
      }
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    // Check if the user is an organizer of THIS organization
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      include: {
        organizationMembers: {
          where: { 
            organizationId: org.id,
            role: 'ORGANIZER' 
          },
        }
      },
    });

    if (!dbUser || !dbUser.organizationMembers || dbUser.organizationMembers.length === 0) {
      throw new Error('User is not an organizer of this organization');
    }

    const slug = tournamentId || '/';

    // Upsert the page for this organization
    await prisma.page.upsert({
      where: {
        organizationId_slug: {
          organizationId: org.id,
          slug,
        },
      },
      update: {
        components: JSON.stringify(components),
      },
      create: {
        title: tournamentId ? 'Tournament Page' : 'Home Page',
        slug,
        organizationId: org.id,
        components: JSON.stringify(components),
        published: true,
      },
    });

    // Revalidate the tenant page path so the changes appear immediately
    revalidatePath(`/tenant/${org.slug}`);

    return { success: true };
  } catch (error: any) {
    console.error('Error saving page layout:', error);
    return { success: false, error: error.message };
  }
}

export async function saveTenantTheme(tenantSlug: string, theme: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const org = await prisma.organization.findFirst({
      where: {
        OR: [
          { slug: tenantSlug },
          { customDomain: tenantSlug },
          ...(tenantSlug.includes('.') ? [] : [{ customDomain: { startsWith: `${tenantSlug}.` } }]),
        ],
      }
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      include: {
        organizationMembers: {
          where: { 
            organizationId: org.id,
            role: 'ORGANIZER' 
          },
        }
      },
    });

    if (!dbUser || !dbUser.organizationMembers || dbUser.organizationMembers.length === 0) {
      throw new Error('User is not an organizer of this organization');
    }

    await prisma.organization.update({
      where: { id: org.id },
      data: { theme },
    });

    revalidatePath(`/tenant/${org.slug}`);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error saving tenant theme:', error);
    return { success: false, error: error.message };
  }
}

export async function generateAiComponentAction(prompt?: string, imageBase64?: string) {
  if (!isAiComponentEnabled()) {
    return {
      success: false,
      error: 'AI Dynamic Component is currently disabled via feature flag.',
    };
  }

  if ((!prompt || prompt.trim().length === 0) && !imageBase64) {
    return {
      success: false,
      error: 'Please provide a text prompt or upload an image layout.',
    };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const parts: any[] = [
        {
          text: `You are an elite frontend UI designer specializing in Tailwind CSS and modern web components for a tournament and sports platform.
Generate complete, high-quality, responsive HTML using Tailwind CSS classes matching a sleek dark theme:
- Backgrounds: bg-slate-900/90, bg-slate-950, or subtle dark gradients (from-slate-900 to-slate-950).
- Borders: border border-slate-800 or border-slate-700/80 with rounded-2xl or rounded-3xl.
- Text & Badges: text-white for bold titles, text-slate-400 for descriptions, text-sky-400 or text-emerald-400 for accents.
- Layout: Use responsive CSS flexbox or grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3) with clear gaps (gap-4, gap-6) and padding (p-6, p-8).
${imageBase64 ? 'Analyze the visual structure, cards, grids, buttons, badges, and layout in the provided image. Recreate a matching responsive Tailwind CSS version of this layout for dark mode.' : ''}
Output ONLY raw HTML. Do NOT include markdown codeblocks or \`\`\`html tags.

User Request: "${prompt && prompt.trim().length > 0 ? prompt : 'Recreate this component layout in dark-mode Tailwind CSS'}"`,
        },
      ];

      if (imageBase64) {
        let mimeType = 'image/jpeg';
        let cleanBase64 = imageBase64;
        const match = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (match) {
          mimeType = match[1];
          cleanBase64 = match[2];
        }
        parts.push({
          inline_data: {
            mime_type: mimeType,
            data: cleanBase64,
          },
        });
      }

      // 1. Dynamically query available models for this specific key
      let candidateModels = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-pro',
      ];

      try {
        const listRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );
        if (listRes.ok) {
          const listData = await listRes.json();
          if (Array.isArray(listData.models)) {
            const availableNames = listData.models
              .filter((m: any) =>
                Array.isArray(m.supportedGenerationMethods) &&
                m.supportedGenerationMethods.includes('generateContent')
              )
              .map((m: any) => m.name.replace(/^models\//, ''));
            if (availableNames.length > 0) {
              candidateModels = availableNames;
            }
          }
        }
      } catch (e) {
        console.warn('Could not auto-list models, falling back to candidate list:', e);
      }

      let lastErrorMsg = '';

      for (const modelName of candidateModels) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts }],
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            let rawHtml = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            rawHtml = rawHtml.replace(/```html/g, '').replace(/```/g, '').trim();
            if (rawHtml) {
              return { success: true, htmlContent: rawHtml };
            }
          } else {
            const errorData = await response.json().catch(() => ({}));
            lastErrorMsg = errorData.error?.message || response.statusText;
          }
        } catch (e: any) {
          lastErrorMsg = e.message;
        }
      }

      return {
        success: false,
        error: `Gemini API call failed (${lastErrorMsg}). Please check that your GEMINI_API_KEY has Generative AI access enabled in Google AI Studio.`,
      };
    }

    // Smart fallback UI generator if GEMINI_API_KEY is not configured
    const fallbackHtml = generateFallbackTemplate(prompt || 'Custom Image Layout Component');
    return { success: true, htmlContent: fallbackHtml };
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return {
      success: false,
      error: `Generation error: ${error.message}`,
    };
  }
}

function generateFallbackTemplate(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('prize') || p.includes('pool') || p.includes('reward') || p.includes('award')) {
    return `
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">Official Rewards</span>
          <h3 className="text-2xl font-black text-white">Tournament Prize Pool</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 border border-amber-500/30 p-6 rounded-2xl text-center space-y-3 relative overflow-hidden group hover:border-amber-500 transition-all">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center font-black text-xl">🥇</div>
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">1st Place Champion</div>
            <div className="text-3xl font-black text-amber-400">$2,500</div>
            <p className="text-xs text-slate-400">Plus Gold Trophy & Custom Paddle Set</p>
          </div>
          <div className="bg-slate-900/90 border border-slate-700/80 p-6 rounded-2xl text-center space-y-3 relative overflow-hidden group hover:border-slate-500 transition-all">
            <div className="w-12 h-12 rounded-full bg-slate-400/20 text-slate-300 mx-auto flex items-center justify-center font-black text-xl">🥈</div>
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">2nd Place Runner-Up</div>
            <div className="text-3xl font-black text-slate-200">$1,200</div>
            <p className="text-xs text-slate-400">Plus Silver Medal & Sponsor Merch</p>
          </div>
          <div className="bg-slate-900/90 border border-amber-800/30 p-6 rounded-2xl text-center space-y-3 relative overflow-hidden group hover:border-amber-700 transition-all">
            <div className="w-12 h-12 rounded-full bg-amber-800/20 text-amber-600 mx-auto flex items-center justify-center font-black text-xl">🥉</div>
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">3rd Place Finalist</div>
            <div className="text-3xl font-black text-amber-600">$500</div>
            <p className="text-xs text-slate-400">Plus Bronze Medal & Gift Card</p>
          </div>
        </div>
      </div>
    `;
  }

  if (p.includes('faq') || p.includes('question') || p.includes('help')) {
    return `
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-widest">Help Center</span>
          <h3 className="text-2xl font-black text-white">Frequently Asked Questions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-2">
            <h4 className="font-bold text-white text-base">What equipment is allowed?</h4>
            <p className="text-slate-400 text-sm">All paddles must be USAPA approved. Tournament balls will be provided at match check-in.</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-2">
            <h4 className="font-bold text-white text-base">When do brackets go live?</h4>
            <p className="text-slate-400 text-sm">Live seeding and match schedules will be published 24 hours prior to day 1 events.</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-2">
            <h4 className="font-bold text-white text-base">What is the refund policy?</h4>
            <p className="text-slate-400 text-sm">Full refunds are available up to 7 days before event start date minus a $10 processing fee.</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-2">
            <h4 className="font-bold text-white text-base">Are spectators allowed?</h4>
            <p className="text-slate-400 text-sm">Yes! General admission for spectators is completely free. Bleacher seating is first come, first served.</p>
          </div>
        </div>
      </div>
    `;
  }

  if (p.includes('rule') || p.includes('notice') || p.includes('guideline') || p.includes('conduct')) {
    return `
      <div className="bg-slate-900/90 border border-sky-500/30 p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 font-bold text-lg">📌</div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Player Notice & Court Guidelines</h3>
            <p className="text-xs text-slate-400">Please review all venue requirements prior to match check-in</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
          <div className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Check in at main desk 30 minutes before your division start time.</span>
          </div>
          <div className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Non-marking court shoes mandatory for all indoor courts.</span>
          </div>
          <div className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Both players must report final match scores immediately after game play.</span>
          </div>
          <div className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Hydration stations & complimentary athlete snacks available in Lot B.</span>
          </div>
        </div>
      </div>
    `;
  }

  // Default custom feature card generator
  return `
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl space-y-4 shadow-xl">
      <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
        Custom Dynamic Section
      </div>
      <h3 className="text-2xl font-bold text-white capitalize">${prompt}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">
        This component was generated dynamically from your prompt: <span className="text-sky-400 font-medium font-mono border-b border-sky-400/30">${prompt}</span>.
      </p>
      <div className="pt-4 border-t border-slate-800 flex items-center gap-4">
        <div className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold">
          ⚡ Powered by AI
        </div>
        <div className="px-4 py-2 rounded-xl bg-sky-500/10 text-sky-400 text-xs font-semibold border border-sky-500/20">
          Fully Customizable
        </div>
      </div>
    </div>
  `;
}
