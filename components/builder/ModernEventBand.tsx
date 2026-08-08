import React from 'react';

export interface ModernEventBandProps {
  eyebrow?: string;
  title?: string;
  eventDate?: string;
  eventDetails?: string;
  buttonText?: string;
  buttonLink?: string;
}

export const ModernEventBand: React.FC<ModernEventBandProps> = ({
  eyebrow = 'TENTATIVE · UP NEXT',
  title = 'The Social Pickle <br> <em>Debut</em>',
  eventDate = 'AUG 29, 2026',
  eventDetails = 'Tournament · Venue to be announced',
  buttonText = 'Explore events',
  buttonLink = '/events',
}) => {
  return (
    <section className="modern-event-band">
      <div className="modern-shell modern-event-card">
        <div>
          {eyebrow && <p className="modern-eyebrow">{eyebrow}</p>}
          {title && <h2 dangerouslySetInnerHTML={{ __html: title }} />}
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
