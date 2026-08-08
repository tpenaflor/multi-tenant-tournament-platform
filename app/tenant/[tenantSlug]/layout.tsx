import { prisma } from '@/lib/prisma';
import React from 'react';
import { buildGoogleFontsUrl } from '@/components/builder/schema';

interface TenantLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tenantSlug: string }>;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : null;
}

export default async function TenantLayout({ children, params }: TenantLayoutProps) {
  const { tenantSlug } = await params;

  // Fetch the organization to get the theme
  const org = await prisma.organization.findFirst({
    where: {
      OR: [
        { slug: tenantSlug },
        { customDomain: tenantSlug },
        ...(tenantSlug.includes('.') ? [] : [{ customDomain: { startsWith: `${tenantSlug}.` } }]),
      ],
    },
  });

  let themeStyles: Record<string, string | null> = {};
  let globalFontFamily = '';

  if (org && org.theme) {
    try {
      const theme = JSON.parse(org.theme);
      const pColor = theme.primaryColor || '#0ea5e9';
      const bColor = theme.backgroundColor || '#020617';
      const tColor = theme.textColor || '#f8fafc';
      const accentColor = theme.accentColor || '#ec4899';
      const bgAltColor = theme.bgAltColor || '#0f172a';
      const borderColor = theme.borderColor || '#334155';
      globalFontFamily = theme.fontFamily || '';
      
      themeStyles = {
        '--tenant-primary': pColor,
        '--tenant-bg': bColor,
        '--tenant-text': tColor,
        '--tenant-accent': accentColor,
        '--tenant-bg-alt': bgAltColor,
        '--tenant-border': borderColor,
        '--tenant-primary-rgb': hexToRgb(pColor),
        '--tenant-bg-rgb': hexToRgb(bColor),
        '--tenant-text-rgb': hexToRgb(tColor),
      };
    } catch (e) {
      console.error('Failed to parse theme JSON', e);
    }
  } else {
    // Default fallback theme
    themeStyles = {
      '--tenant-primary': '#0ea5e9',
      '--tenant-bg': '#020617',
      '--tenant-text': '#f8fafc',
      '--tenant-accent': '#ec4899',
      '--tenant-bg-alt': '#0f172a',
      '--tenant-border': '#334155',
      '--tenant-primary-rgb': '14 165 233',
      '--tenant-bg-rgb': '2 6 23',
      '--tenant-text-rgb': '248 250 252',
    };
  }

  // Build Google Fonts URL for the global font
  const googleFontsUrl = globalFontFamily ? buildGoogleFontsUrl([globalFontFamily]) : '';

  // Apply font family as an inline style alongside CSS variables
  const fontStyle = globalFontFamily ? { fontFamily: `"${globalFontFamily}", sans-serif` } : {};
  const combinedStyles = { ...themeStyles, ...fontStyle } as React.CSSProperties;

  return (
    <div style={combinedStyles} className="min-h-screen bg-tenant-bg text-tenant-text">
      {/* Dynamically load Google Fonts */}
      {googleFontsUrl && (
        <link rel="stylesheet" href={googleFontsUrl} />
      )}
      {children}
    </div>
  );
}
