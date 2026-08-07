/**
 * @jest-environment node
 */
import { login, logout } from '../actions';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    organization: {
      findUnique: jest.fn(),
    },
  },
}));

const mockSignInWithPassword = jest.fn();
const mockSignOut = jest.fn();

jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signOut: mockSignOut,
    },
  })),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

describe('Login Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('redirects platform admin to /platform-admin upon successful login', async () => {
      mockSignInWithPassword.mockResolvedValue({ data: { user: { email: 'admin@bracket.sports' } }, error: null });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        email: 'admin@bracket.sports',
        isPlatformAdmin: true,
      });

      const formData = new FormData();
      formData.append('email', '  Admin@Bracket.Sports  ');
      formData.append('password', 'Password123!');

      await expect(login(formData)).rejects.toThrow('REDIRECT:/platform-admin');
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'admin@bracket.sports',
        password: 'Password123!',
      });
    });



    it('redirects to /login?error=... on authentication failure', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' },
      });

      const formData = new FormData();
      formData.append('email', 'wrong@example.com');
      formData.append('password', 'wrongpass');

      await expect(login(formData)).rejects.toThrow('REDIRECT:/login?error=Invalid%20login%20credentials');
    });
  });

  describe('logout', () => {
    it('signs out of supabase and redirects to /login', async () => {
      mockSignOut.mockResolvedValue({ error: null });

      await expect(logout()).rejects.toThrow('REDIRECT:/login');
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
