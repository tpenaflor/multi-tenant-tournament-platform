export type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'color' | 'select' | 'ai-prompt' | 'tags' | 'info-grid-items';

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
