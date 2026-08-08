import React from 'react';

export interface ModernIntroProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  linkText?: string;
  linkHref?: string;
}

export const ModernIntro: React.FC<ModernIntroProps> = ({
  eyebrow = 'THE GOOD STUFF',
  title = 'All skill levels. <br> <em>Zero pressure.</em>',
  description = 'Whether you are brand new to pickleball or already have a wicked backhand, this is your excuse to get out, play more, and leave with a few new group-chat notifications.',
  linkText = 'Find an event',
  linkHref = '/events',
}) => {
  return (
    <section className="modern-intro" id="about">
      <div className="modern-shell modern-two-col">
        {eyebrow && <p className="modern-eyebrow">{eyebrow}</p>}
        <div>
          {title && <h2 dangerouslySetInnerHTML={{ __html: title }} />}
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
