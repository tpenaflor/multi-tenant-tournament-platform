import { savePageLayout } from '../actions';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    organization: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    page: {
      upsert: jest.fn(),
    },
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Builder Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('savePageLayout', () => {
    it('creates organization if it does not exist and upserts page', async () => {
      (prisma.organization.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.organization.create as jest.Mock).mockResolvedValue({ id: 'org-1', slug: 'new-org' });
      (prisma.page.upsert as jest.Mock).mockResolvedValue({});

      const components = [{ type: 'HeroBanner' }];
      const result = await savePageLayout('new-org', components);

      expect(prisma.organization.findUnique).toHaveBeenCalledWith({ where: { slug: 'new-org' } });
      expect(prisma.organization.create).toHaveBeenCalledTimes(1);
      expect(prisma.page.upsert).toHaveBeenCalledTimes(1);
      expect(revalidatePath).toHaveBeenCalledWith('/tenant/new-org');
      expect(result.success).toBe(true);
    });

    it('uses existing organization and upserts page', async () => {
      (prisma.organization.findUnique as jest.Mock).mockResolvedValue({ id: 'org-1', slug: 'existing-org' });
      (prisma.page.upsert as jest.Mock).mockResolvedValue({});

      const components = [{ type: 'LiveBracketEmbed' }];
      const result = await savePageLayout('existing-org', components);

      expect(prisma.organization.findUnique).toHaveBeenCalledWith({ where: { slug: 'existing-org' } });
      expect(prisma.organization.create).not.toHaveBeenCalled();
      expect(prisma.page.upsert).toHaveBeenCalledTimes(1);
      expect(revalidatePath).toHaveBeenCalledWith('/tenant/existing-org');
      expect(result.success).toBe(true);
    });

    it('returns error if database operation fails', async () => {
      (prisma.organization.findUnique as jest.Mock).mockRejectedValue(new Error('DB connection failed'));

      const result = await savePageLayout('error-org', []);

      expect(result.success).toBe(false);
      expect(result.error).toBe('DB connection failed');
    });
  });
});
