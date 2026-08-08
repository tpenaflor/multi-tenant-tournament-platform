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
import { ModernHero, ModernHeroProps } from './ModernHero';
import { ModernIntro, ModernIntroProps } from './ModernIntro';
import { ModernEventBand, ModernEventBandProps } from './ModernEventBand';
import { ModernCommunity, ModernCommunityProps } from './ModernCommunity';
import './modern.css';

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
      { name: 'titleImage', label: 'Title Image (Replaces Title Text)', type: 'image' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'date', label: 'Date', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'ctaText', label: 'CTA Text', type: 'text' },
      { name: 'ctaLink', label: 'CTA Link', type: 'text' },
      { name: 'design', label: 'Design Overrides', type: 'design-settings' },
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
      { name: 'design', label: 'Design Overrides', type: 'design-settings' },
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
      { name: 'design', label: 'Design Overrides', type: 'design-settings' },
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
      { name: 'design', label: 'Design Overrides', type: 'design-settings' },
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
      { name: 'design', label: 'Design Overrides', type: 'design-settings' },
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
      { name: 'titleImage', label: 'Title Image (Replaces Title Text)', type: 'image' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'overline', label: 'Overline', type: 'text' },
      { name: 'eventDate', label: 'Event Date', type: 'text' },
      { name: 'ctaText', label: 'CTA Text', type: 'text' },
      { name: 'ctaLink', label: 'CTA Link', type: 'text' },
      { name: 'design', label: 'Design Overrides', type: 'design-settings' },
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
      { name: 'titleImage', label: 'Title Image (Replaces Title Text)', type: 'image' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'featureTitle', label: 'Feature Title', type: 'text' },
      { name: 'featureDescription', label: 'Feature Description', type: 'textarea' },
      { name: 'featureTags', label: 'Feature Tags (comma separated)', type: 'tags' },
      { name: 'design', label: 'Design Overrides', type: 'design-settings' },
    ]
  },
  {
    id: 'InfoGrid',
    title: 'Info Grid',
    description: '3-column stats/info',
    isPremium: true,
    requiresTournament: false,
    fields: [
      { name: 'items', label: 'Grid Items', type: 'info-grid-items' },
      { name: 'design', label: 'Design Overrides', type: 'design-settings' },
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
      { name: 'titleImage', label: 'Title Image (Replaces Title Text)', type: 'image' },
      { name: 'overline', label: 'Overline', type: 'text' },
      { name: 'imageUrl', label: 'Image URL', type: 'text' },
      { name: 'design', label: 'Design Overrides', type: 'design-settings' },
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
      { name: 'design', label: 'Design Overrides', type: 'design-settings' },
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
  },
  {
    id: 'ModernHero',
    title: 'Modern Hero',
    description: 'Dynamic layout with large typography',
    isPremium: false,
    requiresTournament: false,
    fields: [
      { name: 'kicker', label: 'Kicker', type: 'text' },
      { name: 'title', label: 'Title (HTML allowed)', type: 'textarea' },
      { name: 'titleImage', label: 'Title Image (Replaces Title Text)', type: 'image' },
      { name: 'lede', label: 'Lede', type: 'textarea' },
      { name: 'buttonText', label: 'Button Text', type: 'text' },
      { name: 'buttonLink', label: 'Button Link', type: 'text' },
      { name: 'imageSrc', label: 'Image URL', type: 'text' },
      { name: 'design', label: 'Design Overrides', type: 'design-settings' },
    ]
  },
  {
    id: 'ModernIntro',
    title: 'Modern Intro',
    description: 'Split column introduction',
    isPremium: false,
    requiresTournament: false,
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'title', label: 'Title (HTML allowed)', type: 'textarea' },
      { name: 'titleImage', label: 'Title Image (Replaces Title Text)', type: 'image' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'linkText', label: 'Link Text', type: 'text' },
      { name: 'linkHref', label: 'Link URL', type: 'text' },
      { name: 'design', label: 'Design Overrides', type: 'design-settings' },
    ]
  },
  {
    id: 'ModernEventBand',
    title: 'Modern Event Band',
    description: 'Highlighted upcoming event',
    isPremium: false,
    requiresTournament: false,
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'title', label: 'Title (HTML allowed)', type: 'textarea' },
      { name: 'titleImage', label: 'Title Image (Replaces Title Text)', type: 'image' },
      { name: 'eventDate', label: 'Event Date', type: 'text' },
      { name: 'eventDetails', label: 'Event Details', type: 'text' },
      { name: 'buttonText', label: 'Button Text', type: 'text' },
      { name: 'buttonLink', label: 'Button Link', type: 'text' },
      { name: 'design', label: 'Design Overrides', type: 'design-settings' },
    ]
  },
  {
    id: 'ModernCommunity',
    title: 'Modern Community',
    description: 'Footer-like community links',
    isPremium: false,
    requiresTournament: false,
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'title', label: 'Title (HTML allowed)', type: 'textarea' },
      { name: 'link1Text', label: 'Link 1 Text', type: 'text' },
      { name: 'link1Href', label: 'Link 1 URL', type: 'text' },
      { name: 'link2Text', label: 'Link 2 Text', type: 'text' },
      { name: 'link2Href', label: 'Link 2 URL', type: 'text' },
      { name: 'design', label: 'Design Overrides', type: 'design-settings' },
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
    case 'ModernHero':
      return <ModernHero key={component.id} {...(component.props as ModernHeroProps)} />;
    case 'ModernIntro':
      return <ModernIntro key={component.id} {...(component.props as ModernIntroProps)} />;
    case 'ModernEventBand':
      return <ModernEventBand key={component.id} {...(component.props as ModernEventBandProps)} />;
    case 'ModernCommunity':
      return <ModernCommunity key={component.id} {...(component.props as ModernCommunityProps)} />;
    default:
      return null;
  }
};
