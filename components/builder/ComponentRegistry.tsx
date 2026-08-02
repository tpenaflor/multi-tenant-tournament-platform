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

export interface ComponentItem {
  id: string;
  type: 'HeroBanner' | 'LiveBracketEmbed' | 'SponsorGrid' | 'LocationLogistics' | 'TournamentList' | 'AIDynamicBlock' | 'HeroPremium' | 'FeatureSection' | 'InfoGrid' | 'ImageBanner' | 'MarqueeDivider';
  props: Record<string, any>;
}

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
