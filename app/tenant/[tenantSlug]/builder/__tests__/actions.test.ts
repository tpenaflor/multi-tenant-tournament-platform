import { savePageLayout } from '../actions';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    organization: {
      findFirst: jest.fn(),
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

      (prisma.organization.findFirst as jest.Mock).mockResolvedValue({
        id: 'org-1',
        slug: 'bay-area-pickleball'
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-1',
        email: 'admin@bayareapickleball.com',
        organizationMembers: [{ role: 'ORGANIZER', organizationId: 'org-1' }],
      });
      (prisma.page.upsert as jest.Mock).mockResolvedValue({});

      const components = [{ type: 'HeroBanner' }];
      const result = await savePageLayout('bay-area-pickleball', components);

      expect(createClient).toHaveBeenCalledTimes(1);
      expect(prisma.organization.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'admin@bayareapickleball.com' },
        include: {
          organizationMembers: {
            where: { 
              organizationId: 'org-1',
              role: 'ORGANIZER' 
            },
          }
        },
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

      const result = await savePageLayout('bay-area-pickleball', []);

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
      (prisma.organization.findFirst as jest.Mock).mockResolvedValue({
        id: 'org-2',
        slug: 'test-org'
      });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-2',
        email: 'noorg@test.com',
        organizationMembers: [],
      });

      const result = await savePageLayout('test-org', []);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User is not an organizer of this organization');
    });
  });
});
