export type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'color' | 'select' | 'ai-prompt' | 'tags' | 'info-grid-items' | 'design-settings' | 'image';

export interface FieldSchema {
  name: string;
  label: string;
  type: FieldType;
  defaultValue?: any;
  options?: { label: string; value: string }[]; // For select fields
  placeholder?: string;
  helpText?: string;
}

export interface ComponentSchema {
  id: string; // The internal type name, e.g. 'HeroBanner'
  title: string; // Human readable, e.g. 'Hero Banner'
  description: string;
  isPremium?: boolean;
  requiresTournament?: boolean;
  hideIfTournament?: boolean;
  fields: FieldSchema[];
}

/** Design overrides that every component can accept */
export interface DesignSettings {
  backgroundColor?: string;
  textColor?: string;
  primaryColor?: string;
  fontFamily?: string;
  alignment?: 'left' | 'center' | 'right';
}

/** 
 * Curated Google Fonts available in the builder.
 * These are popular, web-safe, and cover a broad stylistic range.
 */
export const GOOGLE_FONTS = [
  { label: 'Default (Inherit)', value: '' },
  { label: 'Inter', value: 'Inter' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'Outfit', value: 'Outfit' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Lato', value: 'Lato' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Raleway', value: 'Raleway' },
  { label: 'Oswald', value: 'Oswald' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Merriweather', value: 'Merriweather' },
  { label: 'Bebas Neue', value: 'Bebas Neue' },
  { label: 'Space Grotesk', value: 'Space Grotesk' },
  { label: 'DM Sans', value: 'DM Sans' },
  { label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans' },
  { label: 'Sora', value: 'Sora' },
  { label: 'Archivo', value: 'Archivo' },
  { label: 'Barlow', value: 'Barlow' },
  { label: 'Rubik', value: 'Rubik' },
  { label: 'Nunito', value: 'Nunito' },
];

/**
 * Build a Google Fonts import URL for one or more font families.
 * Returns a URL suitable for @import or <link> usage.
 */
export function buildGoogleFontsUrl(families: string[]): string {
  const unique = [...new Set(families.filter(Boolean))];
  if (unique.length === 0) return '';
  const familyParams = unique.map(f => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700;800;900`).join('&');
  return `https://fonts.googleapis.com/css2?${familyParams}&display=swap`;
}
