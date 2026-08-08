import React from 'react';

export interface ModernCommunityProps {
  eyebrow?: string;
  title?: string;
  link1Text?: string;
  link1Href?: string;
  link2Text?: string;
  link2Href?: string;
}

export const ModernCommunity: React.FC<ModernCommunityProps> = ({
  eyebrow = 'FIND YOUR PEOPLE',
  title = 'Good games. <br> <em>Better company.</em>',
  link1Text = 'Instagram',
  link1Href = 'https://instagram.com',
  link2Text = 'Join us on RecClub',
  link2Href = 'https://reclub.co',
}) => {
  return (
    <section className="modern-community modern-shell">
      <div>
        {eyebrow && <p className="modern-eyebrow">{eyebrow}</p>}
        {title && <h2 dangerouslySetInnerHTML={{ __html: title }} />}
      </div>
      <div className="modern-link-stack">
        {link1Text && (
          <a href={link1Href || '#'} target="_blank" rel="noreferrer">
            {link1Text} <span>↗</span>
          </a>
        )}
        {link2Text && (
          <a href={link2Href || '#'} target="_blank" rel="noreferrer">
            {link2Text} <span>↗</span>
          </a>
        )}
      </div>
    </section>
  );
};
