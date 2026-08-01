import React from 'react';
import { render, screen } from '@testing-library/react';
import { HeroBanner } from '../HeroBanner';

describe('HeroBanner', () => {
  it('renders default props correctly', () => {
    render(<HeroBanner />);
    
    expect(screen.getByText('Summer Pickleball Championship 2026')).toBeInTheDocument();
    expect(screen.getByText('The largest regional bracket tournament featuring singles, doubles, and mixed divisions.')).toBeInTheDocument();
    expect(screen.getByText(/August 15-17, 2026/)).toBeInTheDocument();
    expect(screen.getByText(/Atlanta Sports Complex, Court 1-12/)).toBeInTheDocument();
    expect(screen.getByText('Register Now')).toBeInTheDocument();
    expect(screen.getByText('View Live Brackets')).toBeInTheDocument();
  });

  it('renders provided props correctly', () => {
    render(
      <HeroBanner
        title="Custom Tournament"
        subtitle="Custom Subtitle"
        date="Oct 10, 2026"
        location="NY Courts"
        ctaText="Sign Up Here"
      />
    );
    
    expect(screen.getByText('Custom Tournament')).toBeInTheDocument();
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
    expect(screen.getByText(/Oct 10, 2026/)).toBeInTheDocument();
    expect(screen.getByText(/NY Courts/)).toBeInTheDocument();
    expect(screen.getByText('Sign Up Here')).toBeInTheDocument();
  });
});
