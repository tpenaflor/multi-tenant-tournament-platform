import { ComponentItem } from '@/components/builder/ComponentRegistry';

export interface TournamentTemplate {
  id: string;
  name: string;
  description: string;
  components: ComponentItem[];
}

export const TOURNAMENT_TEMPLATES: TournamentTemplate[] = [
  {
    id: 'standard',
    name: 'Standard Tournament',
    description: 'A traditional, clean layout suitable for most events.',
    components: [
      {
        id: 'comp-standard-hero',
        type: 'HeroBanner',
        props: {
          title: 'Upcoming Tournament',
          subtitle: 'Welcome to our platform.',
          date: 'TBD',
          location: 'TBD',
          ctaText: 'Register Now',
          ctaLink: '#register',
        },
      },
      {
        id: 'comp-standard-list',
        type: 'TournamentList',
        props: {
          title: 'All Tournaments',
          description: 'Browse our events.',
        },
      },
    ],
  },
  {
    id: 'premium-tournament',
    name: 'Premium Tournament',
    description: 'A visually striking, modern layout inspired by professional tournaments.',
    components: [
      {
        id: 'comp-premium-hero',
        type: 'HeroPremium',
        props: {
          title: 'Championship Series.',
          subtitle: 'The ultimate proving ground. Are you ready to take the crown?',
          overline: 'Pro Division presents',
          ctaText: 'Register Now',
          ctaLink: '#',
          eventDate: 'November 15, 2026',
        },
      },
      {
        id: 'comp-premium-marquee',
        type: 'MarqueeDivider',
        props: {
          text: 'CHAMPIONSHIP FINALS • NEXT MATCH • PRO DIVISION • '
        }
      },
      {
        id: 'comp-premium-features',
        type: 'FeatureSection',
        props: {
          eyebrow: 'Spotlight / Main Event',
          title: 'Elevate your competitive experience.',
          description: 'Join hundreds of players competing for glory, prizes, and ranking points. Our tournaments are designed to bring out your best performance in a professional environment.',
          featureTitle: 'Pro Bracket Format.',
          featureDescription: 'Experience our newly revamped double-elimination bracket system, ensuring every team gets a fair shot at the finals. Live scoring and instant updates included.',
          featureTags: ["Double Elimination", "Live Scoring", "Cash Prizes"]
        }
      },
      {
        id: 'comp-premium-info',
        type: 'InfoGrid',
        props: {
          items: [
            { title: 'Date', subtitle: 'Nov 15, 2026', description: 'Main Arena', highlight: false },
            { title: 'Prize Pool', subtitle: '$10,000', description: 'Distributed across top 3', highlight: true },
            { title: 'Registration', subtitle: 'Open Now', description: 'Early bird pricing available', highlight: true }
          ]
        }
      },
      {
        id: 'comp-premium-image',
        type: 'ImageBanner',
        props: {
          title: 'Where legends are made.',
          overline: 'Global Championship Series',
          imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        }
      }
    ],
  }
];
