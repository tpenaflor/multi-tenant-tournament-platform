import React from 'react';
import { render, screen } from '@testing-library/react';
import TournamentsPage from '../page';

describe('TournamentsPage', () => {
  it('renders the tournaments page and mock data', () => {
    render(<TournamentsPage />);
    
    expect(screen.getByText('Tournament Directory & Live Brackets')).toBeInTheDocument();
    expect(screen.getByText('Atlanta Pickleball Summer Championship')).toBeInTheDocument();
    expect(screen.getByText('Peach State Classic Tennis Open')).toBeInTheDocument();
    expect(screen.getByText('Create Tournament Event')).toBeInTheDocument();
    
    // Featured Live Bracket embed should be rendered
    expect(screen.getByText('Featured: Atlanta Open Grand Finals')).toBeInTheDocument();
  });
});
