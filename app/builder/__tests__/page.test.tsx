import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BuilderClient from '../BuilderClient';
import { ComponentItem } from '@/components/builder/ComponentRegistry';
import * as actions from '../actions';

// Mock the actions
jest.mock('../actions', () => ({
  savePageLayout: jest.fn(),
}));

describe('BuilderClient', () => {
  const initialComponents: ComponentItem[] = [
    {
      id: 'comp-1',
      type: 'HeroBanner',
      props: {
        title: 'Atlanta Pickleball Open 2026',
        subtitle: 'The premier pickleball tournament of the South',
        date: 'July 14-16, 2026',
        location: 'Atlanta Tennis & Pickleball Center',
        ctaText: 'Register Now',
        ctaLink: '#register',
      },
    },
    {
      id: 'comp-2',
      type: 'LiveBracketEmbed',
      props: {
        tournamentName: "Men's Doubles 4.5+ Open",
        division: 'Men\'s Doubles 4.5+',
        liveStatus: 'Live - Round 2',
      },
    },
    {
      id: 'comp-3',
      type: 'LocationLogistics',
      props: {
        venueName: 'Atlanta Tennis & Pickleball Center',
        address: '100 Parkway Dr, Atlanta, GA 30301',
        parkingInfo: 'Free parking available in Lots A & B.',
      },
    },
    {
      id: 'comp-4',
      type: 'SponsorGrid',
      props: {
        tierName: 'Gold Sponsors',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the builder page with initial components', () => {
    render(<BuilderClient initialComponents={initialComponents} tenantSlug="bay-area-pickleball" />);
    
    expect(screen.getByText('Drag-and-Drop Page Builder')).toBeInTheDocument();
    expect(screen.getByText('Atlanta Pickleball Open 2026')).toBeInTheDocument();
    expect(screen.getByText("Men's Doubles 4.5+ Open")).toBeInTheDocument();
  });

  it('adds a new component when clicking on sidebar', () => {
    render(<BuilderClient initialComponents={initialComponents} tenantSlug="bay-area-pickleball" />);
    
    const initialCanvasCount = screen.getByText(/Live Interactive Page Canvas/);
    expect(initialCanvasCount).toHaveTextContent('4 components');

    // Add a HeroBanner
    const addHeroBannerBtn = screen.getByText('Hero Banner').closest('button');
    fireEvent.click(addHeroBannerBtn!);

    expect(screen.getByText(/Live Interactive Page Canvas/)).toHaveTextContent('5 components');
  });

  it('selects a component and shows it in the CMS editor', () => {
    render(<BuilderClient initialComponents={initialComponents} tenantSlug="bay-area-pickleball" />);
    
    // Find the HeroBanner component in the canvas and click it
    const heroBannerTitle = screen.getByText('Atlanta Pickleball Open 2026');
    fireEvent.click(heroBannerTitle);

    // Now the CMS should show Editing HeroBanner
    expect(screen.getByText('Editing')).toBeInTheDocument();
    
    // The input for title should exist
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('calls savePageLayout when save is clicked', async () => {
    (actions.savePageLayout as jest.Mock).mockResolvedValue({ success: true });
    
    render(<BuilderClient initialComponents={initialComponents} tenantSlug="bay-area-pickleball" />);
    
    const saveBtn = screen.getByText('Save Layout');
    fireEvent.click(saveBtn);
    
    expect(saveBtn).toHaveTextContent('Saving...');
    
    await waitFor(() => {
      expect(actions.savePageLayout).toHaveBeenCalledTimes(1);
    });
    
    expect(screen.getByText('Page Layout Saved to Database!')).toBeInTheDocument();
  });

  it('removes a component when trash icon is clicked', () => {
    render(<BuilderClient initialComponents={initialComponents} tenantSlug="bay-area-pickleball" />);
    
    // Select the first component
    const heroBannerTitle = screen.getByText('Atlanta Pickleball Open 2026');
    fireEvent.click(heroBannerTitle);

    // Click the remove button (TrashIcon) for the first component
    const removeBtns = screen.getAllByTitle('Remove Component');
    fireEvent.click(removeBtns[0]);

    // It should be removed from the canvas
    expect(screen.queryByText('Atlanta Pickleball Open 2026')).not.toBeInTheDocument();
  });

  it('updates a component property via the CMS editor', () => {
    render(<BuilderClient initialComponents={initialComponents} tenantSlug="bay-area-pickleball" />);
    
    // Select the HeroBanner component
    const heroBannerTitle = screen.getByText('Atlanta Pickleball Open 2026');
    fireEvent.click(heroBannerTitle);

    // Find the title input and change it
    const inputs = screen.getAllByRole('textbox');
    const titleInput = inputs[0];
    fireEvent.change(titleInput, { target: { value: 'New Updated Title' } });

    // The canvas should reflect the new title
    expect(screen.getByText('New Updated Title')).toBeInTheDocument();
  });
});
