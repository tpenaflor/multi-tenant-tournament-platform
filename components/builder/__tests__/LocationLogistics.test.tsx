import React from 'react';
import { render, screen } from '@testing-library/react';
import { LocationLogistics } from '../LocationLogistics';

describe('LocationLogistics', () => {
  it('renders default props correctly', () => {
    render(<LocationLogistics />);
    
    expect(screen.getByText('Atlanta Metro Pickleball Center')).toBeInTheDocument();
    expect(screen.getByText('450 Sportsplex Parkway, Atlanta, GA 30301')).toBeInTheDocument();
    expect(screen.getByText(/Free participant parking in Lot B/)).toBeInTheDocument();
    expect(screen.getByText(/Non-marking court shoes required/)).toBeInTheDocument();
  });

  it('renders provided props correctly', () => {
    render(
      <LocationLogistics
        venueName="New Venue"
        address="123 Main St"
        parkingInfo="No Parking"
        facilityRules="Be quiet"
      />
    );
    
    expect(screen.getByText('New Venue')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('No Parking')).toBeInTheDocument();
    expect(screen.getByText('Be quiet')).toBeInTheDocument();
  });
});
