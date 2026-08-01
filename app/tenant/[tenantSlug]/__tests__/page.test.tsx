import React from 'react';
import { render, screen } from '@testing-library/react';
import TenantPage from '../page';
import { prisma } from '@/lib/prisma';

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    page: {
      findFirst: jest.fn(),
    },
    organization: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn().mockResolvedValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    },
  }),
}));


describe('TenantPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders fallback state when no page components found', async () => {
    (prisma.organization.findUnique as jest.Mock).mockResolvedValue({ id: 'org-1', isActive: true });
    (prisma.page.findFirst as jest.Mock).mockResolvedValue(null);

    const params = Promise.resolve({ tenantSlug: 'test-tenant' });
    
    const ui = await TenantPage({ params });
    render(ui);

    expect(screen.getByText('Welcome to test tenant Tournament Portal')).toBeInTheDocument();
    expect(screen.getByText('Tenant Domain Active')).toBeInTheDocument();
    expect(screen.getByText(/test-tenant/)).toBeInTheDocument();
    expect(screen.getByText(/No dynamic layout has been published/)).toBeInTheDocument();
  });

  it('renders offline message when organization is inactive', async () => {
    (prisma.organization.findUnique as jest.Mock).mockResolvedValue({ id: 'org-1', isActive: false });

    const params = Promise.resolve({ tenantSlug: 'test-tenant' });
    
    const ui = await TenantPage({ params });
    render(ui);

    expect(screen.getByText('Site is Offline')).toBeInTheDocument();
    expect(screen.queryByText('Tenant Domain Active')).not.toBeInTheDocument();
  });

  it('renders not found when organization does not exist', async () => {
    (prisma.organization.findUnique as jest.Mock).mockResolvedValue(null);

    const params = Promise.resolve({ tenantSlug: 'test-tenant' });
    
    const ui = await TenantPage({ params });
    render(ui);

    expect(screen.getByText('Tenant Not Found')).toBeInTheDocument();
  });

  it('renders dynamic components when found in database', async () => {
    const mockComponents = [
      { id: '1', type: 'HeroBanner', props: { title: 'Dynamic Tenant Title' } }
    ];

    (prisma.organization.findUnique as jest.Mock).mockResolvedValue({ id: 'org-1', isActive: true });

    (prisma.page.findFirst as jest.Mock).mockResolvedValue({
      id: 'page-1',
      components: JSON.stringify(mockComponents),
    });

    const params = Promise.resolve({ tenantSlug: 'test-tenant' });
    
    const ui = await TenantPage({ params });
    render(ui);

    expect(screen.getByText('Dynamic Tenant Title')).toBeInTheDocument();
    expect(screen.queryByText('Welcome to test tenant Tournament Portal')).not.toBeInTheDocument();
  });
});
