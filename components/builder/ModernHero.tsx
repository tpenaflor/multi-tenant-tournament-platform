import React from 'react';
import { DesignSettings } from './schema';
import { buildDesignCssVars } from './designUtils';

export interface ModernHeroProps {
  kicker?: string;
  title?: string; // HTML allowed for styling like <br> and <em>
  titleImage?: string;
  lede?: string;
  buttonText?: string;
  buttonLink?: string;
  imageSrc?: string;
  imageAlt?: string;
  design?: DesignSettings;
}

export const ModernHero: React.FC<ModernHeroProps> = ({
  kicker = 'Pickleball, but make it a whole social thing.',
  title = 'Come for the <br> <em>rally.</em> Stay for <br> the people.',
  titleImage,
  lede = 'A friendly club for meeting new people, finding your game, and enjoying a little healthy competition.',
  buttonText = 'Explore events',
  buttonLink = '/events',
  imageSrc = '/pickle-mascot-transparent.png',
  imageAlt = 'Mascot',
  design,
}) => {
  return (
    <section className="modern-hero" style={buildDesignCssVars(design)}>
      <div className="modern-shell modern-hero-grid">
        <div>
          {kicker && <p className="modern-kicker">{kicker}</p>}
          {titleImage ? (
            <img src={titleImage} alt={title || 'Hero'} style={{ maxHeight: '8rem', objectFit: 'contain' }} />
          ) : (
            title && <h1 dangerouslySetInnerHTML={{ __html: title }} />
          )}
          {lede && <p className="modern-lede">{lede}</p>}
          {(buttonText || buttonLink) && (
            <div className="modern-actions">
              <a className="modern-button" href={buttonLink || '#'}>
                {buttonText} <span>→</span>
              </a>
            </div>
          )}
        </div>
        {imageSrc && (
          <img
            className="modern-hero-image"
            src={imageSrc}
            alt={imageAlt}
            width={1254}
            height={1254}
          />
        )}
      </div>
    </section>
  );
};
