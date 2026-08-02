/**
 * @jest-environment node
 */
import { getOrganizations, addOrganization, toggleOrganizationStatus } from '../actions';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    organization: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Platform Admin Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrganizations', () => {
    it('returns all organizations', async () => {
      const mockOrgs = [{ id: '1', name: 'Org 1' }];
      (prisma.organization.findMany as jest.Mock).mockResolvedValue(mockOrgs);

      const orgs = await getOrganizations();
      
      expect(orgs).toEqual(mockOrgs);
      expect(prisma.organization.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('addOrganization', () => {
    it('creates a new organization and revalidates path', async () => {
      const mockOrg = { id: '2', name: 'New Org', slug: 'new-org', isActive: true };
      (prisma.organization.create as jest.Mock).mockResolvedValue(mockOrg);

      const org = await addOrganization({ name: 'New Org', slug: 'new-org' });
      
      expect(org).toEqual(mockOrg);
      expect(prisma.organization.create).toHaveBeenCalledWith({
        data: {
          name: 'New Org',
          slug: 'new-org',
          isActive: true,
          users: {
            create: {
              email: 'admin@new-org.com',
              name: 'New Org Admin',
              role: 'ADMIN',
            },
          },
        },
      });
      expect(revalidatePath).toHaveBeenCalledWith('/platform-admin');
    });
  });

  describe('toggleOrganizationStatus', () => {
    it('updates organization active status and revalidates path', async () => {
      const mockOrg = { id: '1', isActive: false };
      (prisma.organization.update as jest.Mock).mockResolvedValue(mockOrg);

      const org = await toggleOrganizationStatus('1', false);
      
      expect(org).toEqual(mockOrg);
      expect(prisma.organization.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isActive: false },
      });
      expect(revalidatePath).toHaveBeenCalledWith('/platform-admin');
    });
  });
});
