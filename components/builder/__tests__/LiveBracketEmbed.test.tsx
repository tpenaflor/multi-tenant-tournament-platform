import React from 'react';
import { render, screen } from '@testing-library/react';
import { LiveBracketEmbed } from '../LiveBracketEmbed';

describe('LiveBracketEmbed', () => {
  it('renders default props correctly', () => {
    render(<LiveBracketEmbed />);
    
    expect(screen.getByText("Men's Doubles Open 4.5+")).toBeInTheDocument();
    expect(screen.getByText('Double Elimination')).toBeInTheDocument();
    expect(screen.getByText('Live Tournament Bracket')).toBeInTheDocument();
    expect(screen.getByText('● Live Updates')).toBeInTheDocument();
    expect(screen.getByText('Quarterfinals')).toBeInTheDocument();
    expect(screen.getByText('Semifinals')).toBeInTheDocument();
    expect(screen.getByText('Grand Finals 🏆')).toBeInTheDocument();
  });

  it('renders provided props correctly', () => {
    render(
      <LiveBracketEmbed
        divisionName="Women's Singles"
        format="Single Elimination"
      />
    );
    
    expect(screen.getByText("Women's Singles")).toBeInTheDocument();
    expect(screen.getByText('Single Elimination')).toBeInTheDocument();
  });
});
