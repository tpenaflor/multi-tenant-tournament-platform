import React from 'react';
import { DesignSettings } from './schema';
import { buildDesignCssVars } from './designUtils';

export interface ModernEventBandProps {
  eyebrow?: string;
  title?: string;
  titleImage?: string;
  eventDate?: string;
  eventDetails?: string;
  buttonText?: string;
  buttonLink?: string;
  design?: DesignSettings;
}

export const ModernEventBand: React.FC<ModernEventBandProps> = ({
  eyebrow = 'TENTATIVE · UP NEXT',
  title = 'The Social Pickle <br> <em>Debut</em>',
  titleImage,
  eventDate = 'AUG 29, 2026',
  eventDetails = 'Tournament · Venue to be announced',
  buttonText = 'Explore events',
  buttonLink = '/events',
  design,
}) => {
  return (
    <section className="modern-event-band" style={buildDesignCssVars(design)}>
      <div className="modern-shell modern-event-card">
        <div>
          {eyebrow && <p className="modern-eyebrow">{eyebrow}</p>}
          {titleImage ? (
            <img src={titleImage} alt={title || 'Event'} style={{ maxHeight: '6rem', objectFit: 'contain' }} />
          ) : (
            title && <h2 dangerouslySetInnerHTML={{ __html: title }} />
          )}
        </div>
        <div className="modern-event-details">
          <div>
            {eventDate && <p className="modern-event-date">{eventDate}</p>}
            {eventDetails && <p>{eventDetails}</p>}
          </div>
          {(buttonText || buttonLink) && (
            <a className="modern-button modern-button-light" href={buttonLink || '#'}>
              {buttonText} <span>→</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
