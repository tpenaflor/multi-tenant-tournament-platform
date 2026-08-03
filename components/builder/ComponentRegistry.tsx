import React from 'react';
import { HeroBanner, HeroBannerProps } from './HeroBanner';
import { LiveBracketEmbed, LiveBracketEmbedProps } from './LiveBracketEmbed';
import { SponsorGrid, SponsorGridProps } from './SponsorGrid';
import { LocationLogistics, LocationLogisticsProps } from './LocationLogistics';
import { TournamentList, TournamentListProps } from './TournamentList';
import { AIDynamicBlock, AIDynamicBlockProps } from './AIDynamicBlock';
import { HeroPremium, HeroPremiumProps } from './HeroPremium';
import { FeatureSection, FeatureSectionProps } from './FeatureSection';
import { InfoGrid, InfoGridProps } from './InfoGrid';
import { ImageBanner, ImageBannerProps } from './ImageBanner';
import { MarqueeDivider, MarqueeDividerProps } from './MarqueeDivider';
import { ComponentSchema } from './schema';

export interface ComponentItem {
  id: string;
  type: string;
  props: Record<string, any>;
}

export const COMPONENT_SCHEMAS: ComponentSchema[] = [
  {
    id: 'HeroBanner',
    title: 'Hero Banner',
    description: 'Title, CTA & Dates',
    isPremium: false,
    requiresTournament: false,
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'date', label: 'Date', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'ctaText', label: 'CTA Text', type: 'text' },
      { name: 'ctaLink', label: 'CTA Link', type: 'text' },
    ]
  },
  {
    id: 'TournamentList',
    title: 'Tournament List',
    description: 'Active & upcoming events',
    isPremium: false,
    requiresTournament: false,
    hideIfTournament: true,
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ]
  },
  {
    id: 'LiveBracketEmbed',
    title: 'Live Bracket',
    description: 'Interactive bracket tree',
    isPremium: false,
    requiresTournament: true,
    fields: [
      { name: 'divisionName', label: 'Division Name', type: 'text' },
      { name: 'format', label: 'Format', type: 'text' },
    ]
  },
  {
    id: 'SponsorGrid',
    title: 'Sponsor Grid',
    description: 'Partner logos & tiers',
    isPremium: false,
    requiresTournament: false,
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
    ]
  },
  {
    id: 'LocationLogistics',
    title: 'Location & Venue',
    description: 'Parking & Facility rules',
    isPremium: false,
    requiresTournament: true,
    fields: [
      { name: 'venueName', label: 'Venue Name', type: 'text' },
      { name: 'address', label: 'Address', type: 'text' },
    ]
  },
  {
    id: 'HeroPremium',
    title: 'Hero Premium',
    description: 'Striking hero with countdown',
    isPremium: true,
    requiresTournament: false,
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'overline', label: 'Overline', type: 'text' },
      { name: 'eventDate', label: 'Event Date', type: 'text' },
      { name: 'ctaText', label: 'CTA Text', type: 'text' },
      { name: 'ctaLink', label: 'CTA Link', type: 'text' },
    ]
  },
  {
    id: 'FeatureSection',
    title: 'Feature Section',
    description: 'Split grid feature highlight',
    isPremium: true,
    requiresTournament: false,
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'featureTitle', label: 'Feature Title', type: 'text' },
      { name: 'featureDescription', label: 'Feature Description', type: 'textarea' },
      { name: 'featureTags', label: 'Feature Tags (comma separated)', type: 'tags' },
    ]
  },
  {
    id: 'InfoGrid',
    title: 'Info Grid',
    description: '3-column stats/info',
    isPremium: true,
    requiresTournament: false,
    fields: [
      { name: 'items', label: 'Grid Items', type: 'info-grid-items' }
    ]
  },
  {
    id: 'ImageBanner',
    title: 'Image Banner',
    description: 'Large image with gradient overlay',
    isPremium: true,
    requiresTournament: false,
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'overline', label: 'Overline', type: 'text' },
      { name: 'imageUrl', label: 'Image URL', type: 'text' },
    ]
  },
  {
    id: 'MarqueeDivider',
    title: 'Marquee Divider',
    description: 'Scrolling text band separator',
    isPremium: true,
    requiresTournament: false,
    fields: [
      { name: 'text', label: 'Marquee Text', type: 'text' },
    ]
  },
  {
    id: 'AIDynamicBlock',
    title: '✨ AI Custom Component',
    description: 'Prompt or upload screenshot',
    isPremium: true,
    requiresTournament: false,
    fields: [
      { name: 'aiGenerator', label: 'AI Generator', type: 'ai-prompt' },
      { name: 'title', label: 'Section Title (Optional)', type: 'text' },
      { name: 'htmlContent', label: 'Raw HTML Content', type: 'textarea' }
    ]
  }
];

export const renderBuilderComponent = (component: ComponentItem, dynamicData?: any) => {
  switch (component.type) {
    case 'HeroBanner':
      return <HeroBanner key={component.id} {...(component.props as HeroBannerProps)} />;
    case 'LiveBracketEmbed':
      return <LiveBracketEmbed key={component.id} {...(component.props as LiveBracketEmbedProps)} />;
    case 'SponsorGrid':
      return <SponsorGrid key={component.id} {...(component.props as SponsorGridProps)} />;
    case 'LocationLogistics':
      return <LocationLogistics key={component.id} {...(component.props as LocationLogisticsProps)} />;
    case 'TournamentList':
      return <TournamentList key={component.id} {...(component.props as TournamentListProps)} tournaments={dynamicData?.tournaments} basePath={dynamicData?.basePath} />;
    case 'AIDynamicBlock':
      return <AIDynamicBlock key={component.id} {...(component.props as AIDynamicBlockProps)} dynamicData={dynamicData} />;
    case 'HeroPremium':
      return <HeroPremium key={component.id} {...(component.props as HeroPremiumProps)} />;
    case 'FeatureSection':
      return <FeatureSection key={component.id} {...(component.props as FeatureSectionProps)} />;
    case 'InfoGrid':
      return <InfoGrid key={component.id} {...(component.props as InfoGridProps)} />;
    case 'ImageBanner':
      return <ImageBanner key={component.id} {...(component.props as ImageBannerProps)} />;
    case 'MarqueeDivider':
      return <MarqueeDivider key={component.id} {...(component.props as MarqueeDividerProps)} />;
    default:
      return null;
  }
};
