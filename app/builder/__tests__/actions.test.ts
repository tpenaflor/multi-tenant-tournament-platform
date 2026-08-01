import { savePageLayout } from '../actions';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    page: {
      upsert: jest.fn(),
    },
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

describe('Builder Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('savePageLayout', () => {
    it('saves page layout for authenticated user organization', async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { email: 'admin@bayareapickleball.com' } },
            error: null,
          }),
        },
      };
      (createClient as jest.Mock).mockResolvedValue(mockSupabase);

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        email: 'admin@bayareapickleball.com',
        organization: { id: 'org-1', slug: 'bay-area-pickleball' },
      });
      (prisma.page.upsert as jest.Mock).mockResolvedValue({});

      const components = [{ type: 'HeroBanner' }];
      const result = await savePageLayout(components);

      expect(createClient).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'admin@bayareapickleball.com' },
        include: { organization: true },
      });
      expect(prisma.page.upsert).toHaveBeenCalledTimes(1);
      expect(revalidatePath).toHaveBeenCalledWith('/tenant/bay-area-pickleball');
      expect(result.success).toBe(true);
    });

    it('returns error if user is unauthenticated', async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: new Error('Auth error'),
          }),
        },
      };
      (createClient as jest.Mock).mockResolvedValue(mockSupabase);

      const result = await savePageLayout([]);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });

    it('returns error if user has no organization', async () => {
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { email: 'noorg@test.com' } },
            error: null,
          }),
        },
      };
      (createClient as jest.Mock).mockResolvedValue(mockSupabase);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-2',
        email: 'noorg@test.com',
        organization: null,
      });

      const result = await savePageLayout([]);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User is not assigned to an organization');
    });
  });
});
