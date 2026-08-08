import { DesignSettings } from './schema';
import React from 'react';

/**
 * Builds an inline style object from a DesignSettings prop.
 * Components use this to apply per-component overrides on top of the global theme.
 * Only non-empty values are included, so the global theme is inherited by default.
 */
export function buildDesignStyles(design?: DesignSettings): React.CSSProperties {
  if (!design) return {};
  
  const styles: Record<string, string> = {};
  
  if (design.backgroundColor) styles.backgroundColor = design.backgroundColor;
  if (design.textColor) styles.color = design.textColor;
  if (design.fontFamily) styles.fontFamily = `"${design.fontFamily}", sans-serif`;
  if (design.alignment) styles.textAlign = design.alignment;
  
  return styles as React.CSSProperties;
}

/**
 * Builds CSS variable overrides from a DesignSettings prop.
 * This allows child elements using tenant CSS variables (like bg-tenant-primary)
 * to be overridden at the component level.
 */
export function buildDesignCssVars(design?: DesignSettings): React.CSSProperties {
  if (!design) return {};
  
  const vars: Record<string, string> = {};
  
  if (design.primaryColor) vars['--tenant-primary'] = design.primaryColor;
  if (design.backgroundColor) vars['--tenant-bg'] = design.backgroundColor;
  if (design.textColor) vars['--tenant-text'] = design.textColor;
  if (design.fontFamily) vars.fontFamily = `"${design.fontFamily}", sans-serif`;
  if (design.alignment) vars.textAlign = design.alignment;
  
  return vars as React.CSSProperties;
}
