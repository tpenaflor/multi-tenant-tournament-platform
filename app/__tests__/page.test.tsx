/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import Home from '../page';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects platform admin to /platform-admin', async () => {
    (createClient as jest.Mock).mockResolvedValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { email: 'admin@test.com' } } }) },
    });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      isPlatformAdmin: true,
      organizationMembers: [],
    });

    await Home();
    expect(redirect).toHaveBeenCalledWith('/platform-admin');
  });

  it('redirects organizer to /dashboard', async () => {
    (createClient as jest.Mock).mockResolvedValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { email: 'org@test.com' } } }) },
    });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-1',
      organizationMembers: [{ role: 'ORGANIZER', organization: { slug: 'test-org' } }],
    });

    await Home();
    expect(redirect).toHaveBeenCalledWith('/tenant/test-org/dashboard');
  });

  it('redirects regular user to /settings', async () => {
    (createClient as jest.Mock).mockResolvedValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { email: 'player@test.com' } } }) },
    });
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      isPlatformAdmin: false,
      organizationMembers: [],
    });

    await Home();
    expect(redirect).toHaveBeenCalledWith('/settings');
  });

  it('renders login page if not logged in', async () => {
    (createClient as jest.Mock).mockResolvedValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null } }) },
    });

    const jsx = await Home();
    render(jsx);

    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });
});
