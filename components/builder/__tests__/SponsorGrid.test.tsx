import React from 'react';
import { render, screen } from '@testing-library/react';
import { SponsorGrid } from '../SponsorGrid';

describe('SponsorGrid', () => {
  it('renders default title and sponsors', () => {
    render(<SponsorGrid />);
    
    expect(screen.getByText('Official Tournament Partners & Sponsors')).toBeInTheDocument();
    expect(screen.getByText('Apex Paddle Co.')).toBeInTheDocument();
    expect(screen.getByText('ProPickle Gear')).toBeInTheDocument();
    expect(screen.getByText('HydrateX Electrolytes')).toBeInTheDocument();
    expect(screen.getByText('Courtside Apparel')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<SponsorGrid title="Our Awesome Sponsors" />);
    
    expect(screen.getByText('Our Awesome Sponsors')).toBeInTheDocument();
  });
});
