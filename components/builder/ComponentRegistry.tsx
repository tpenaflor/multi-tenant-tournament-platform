import React from 'react';
import { HeroBanner, HeroBannerProps } from './HeroBanner';
import { LiveBracketEmbed, LiveBracketEmbedProps } from './LiveBracketEmbed';
import { SponsorGrid, SponsorGridProps } from './SponsorGrid';
import { LocationLogistics, LocationLogisticsProps } from './LocationLogistics';
import { TournamentList, TournamentListProps } from './TournamentList';
import { AIDynamicBlock, AIDynamicBlockProps } from './AIDynamicBlock';

export interface ComponentItem {
  id: string;
  type: 'HeroBanner' | 'LiveBracketEmbed' | 'SponsorGrid' | 'LocationLogistics' | 'TournamentList' | 'AIDynamicBlock';
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
    default:
      return null;
  }
};
