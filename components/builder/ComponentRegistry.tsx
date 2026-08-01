import React from 'react';
import { HeroBanner, HeroBannerProps } from './HeroBanner';
import { LiveBracketEmbed, LiveBracketEmbedProps } from './LiveBracketEmbed';
import { SponsorGrid, SponsorGridProps } from './SponsorGrid';
import { LocationLogistics, LocationLogisticsProps } from './LocationLogistics';

export interface ComponentItem {
  id: string;
  type: 'HeroBanner' | 'LiveBracketEmbed' | 'SponsorGrid' | 'LocationLogistics';
  props: Record<string, any>;
}

export const renderBuilderComponent = (component: ComponentItem) => {
  switch (component.type) {
    case 'HeroBanner':
      return <HeroBanner key={component.id} {...(component.props as HeroBannerProps)} />;
    case 'LiveBracketEmbed':
      return <LiveBracketEmbed key={component.id} {...(component.props as LiveBracketEmbedProps)} />;
    case 'SponsorGrid':
      return <SponsorGrid key={component.id} {...(component.props as SponsorGridProps)} />;
    case 'LocationLogistics':
      return <LocationLogistics key={component.id} {...(component.props as LocationLogisticsProps)} />;
    default:
      return null;
  }
};
