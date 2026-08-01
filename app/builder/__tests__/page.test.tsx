import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BuilderPage from '../page';
import * as actions from '../actions';

// Mock the actions
jest.mock('../actions', () => ({
  savePageLayout: jest.fn(),
}));

describe('BuilderPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the builder page with initial components', () => {
    render(<BuilderPage />);
    
    expect(screen.getByText('Drag-and-Drop Page Builder')).toBeInTheDocument();
    expect(screen.getByText('Atlanta Pickleball Open 2026')).toBeInTheDocument();
    expect(screen.getByText("Men's Doubles 4.5+ Open")).toBeInTheDocument();
  });

  it('adds a new component when clicking on sidebar', () => {
    render(<BuilderPage />);
    
    const initialCanvasCount = screen.getByText(/Live Interactive Page Canvas/);
    expect(initialCanvasCount).toHaveTextContent('4 components');

    // Add a HeroBanner
    const addHeroBannerBtn = screen.getByText('Hero Banner').closest('button');
    fireEvent.click(addHeroBannerBtn!);

    expect(screen.getByText(/Live Interactive Page Canvas/)).toHaveTextContent('5 components');
  });

  it('selects a component and shows it in the CMS editor', () => {
    render(<BuilderPage />);
    
    // Find the HeroBanner component in the canvas and click it
    // The HeroBanner has text 'Atlanta Pickleball Open 2026'
    const heroBannerTitle = screen.getByText('Atlanta Pickleball Open 2026');
    // We click the wrapper
    fireEvent.click(heroBannerTitle);

    // Now the CMS should show Editing HeroBanner
    expect(screen.getByText('Editing')).toBeInTheDocument();
    
    // The input for title should exist
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('calls savePageLayout when save is clicked', async () => {
    (actions.savePageLayout as jest.Mock).mockResolvedValue({ success: true });
    
    render(<BuilderPage />);
    
    const saveBtn = screen.getByText('Save Layout');
    fireEvent.click(saveBtn);
    
    expect(saveBtn).toHaveTextContent('Saving...');
    
    await waitFor(() => {
      expect(actions.savePageLayout).toHaveBeenCalledTimes(1);
    });
    
    expect(screen.getByText('Page Layout Saved to Database!')).toBeInTheDocument();
  });

  it('removes a component when trash icon is clicked', () => {
    render(<BuilderPage />);
    
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
    render(<BuilderPage />);
    
    // Select the HeroBanner component
    const heroBannerTitle = screen.getByText('Atlanta Pickleball Open 2026');
    fireEvent.click(heroBannerTitle);

    // Find the title input and change it
    const inputs = screen.getAllByRole('textbox');
    const titleInput = inputs[0]; // Title is the first input for HeroBanner
    fireEvent.change(titleInput, { target: { value: 'New Updated Title' } });

    // The canvas should reflect the new title
    expect(screen.getByText('New Updated Title')).toBeInTheDocument();
  });
});
