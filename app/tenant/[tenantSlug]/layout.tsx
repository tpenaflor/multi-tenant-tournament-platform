import { prisma } from '@/lib/prisma';
import React from 'react';

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

  let themeStyles = {};
  if (org && org.theme) {
    try {
      const theme = JSON.parse(org.theme);
      const pColor = theme.primaryColor || '#0ea5e9';
      const bColor = theme.backgroundColor || '#020617';
      const tColor = theme.textColor || '#f8fafc';
      
      themeStyles = {
        '--tenant-primary': pColor,
        '--tenant-bg': bColor,
        '--tenant-text': tColor,
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
      '--tenant-primary': '#0ea5e9', // sky-500
      '--tenant-bg': '#020617', // slate-950
      '--tenant-text': '#f8fafc', // slate-50
      '--tenant-primary-rgb': '14 165 233',
      '--tenant-bg-rgb': '2 6 23',
      '--tenant-text-rgb': '248 250 252',
    };
  }

  return (
    <div style={themeStyles as React.CSSProperties} className="min-h-screen bg-tenant-bg text-tenant-text font-sans">
      {children}
    </div>
  );
}
