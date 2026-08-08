import React from 'react';
import Image from 'next/image';

export interface ModernHeroProps {
  kicker?: string;
  title?: string; // HTML allowed for styling like <br> and <em>
  lede?: string;
  buttonText?: string;
  buttonLink?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export const ModernHero: React.FC<ModernHeroProps> = ({
  kicker = 'Pickleball, but make it a whole social thing.',
  title = 'Come for the <br> <em>rally.</em> Stay for <br> the people.',
  lede = 'A friendly club for meeting new people, finding your game, and enjoying a little healthy competition.',
  buttonText = 'Explore events',
  buttonLink = '/events',
  imageSrc = '/pickle-mascot-transparent.png',
  imageAlt = 'Mascot',
}) => {
  return (
    <section className="modern-hero">
      <div className="modern-shell modern-hero-grid">
        <div>
          {kicker && <p className="modern-kicker">{kicker}</p>}
          {title && <h1 dangerouslySetInnerHTML={{ __html: title }} />}
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
