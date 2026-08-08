import React from 'react';
import { DesignSettings } from './schema';
import { buildDesignCssVars } from './designUtils';

export interface ModernIntroProps {
  eyebrow?: string;
  title?: string;
  titleImage?: string;
  description?: string;
  linkText?: string;
  linkHref?: string;
  design?: DesignSettings;
}

export const ModernIntro: React.FC<ModernIntroProps> = ({
  eyebrow = 'THE GOOD STUFF',
  title = 'All skill levels. <br> <em>Zero pressure.</em>',
  titleImage,
  description = 'Whether you are brand new to pickleball or already have a wicked backhand, this is your excuse to get out, play more, and leave with a few new group-chat notifications.',
  linkText = 'Find an event',
  linkHref = '/events',
  design,
}) => {
  return (
    <section className="modern-intro" id="about" style={buildDesignCssVars(design)}>
      <div className="modern-shell modern-two-col">
        {eyebrow && <p className="modern-eyebrow">{eyebrow}</p>}
        <div>
          {titleImage ? (
            <img src={titleImage} alt={title || 'Intro'} style={{ maxHeight: '6rem', objectFit: 'contain' }} />
          ) : (
            title && <h2 dangerouslySetInnerHTML={{ __html: title }} />
          )}
          {description && <p>{description}</p>}
          {(linkText || linkHref) && (
            <a className="modern-underlined" href={linkHref || '#'}>
              {linkText} <span>→</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
