/**
 * @jest-environment node
 */
import { GET, POST } from '../route';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    tournament: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('Tournaments API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('returns tournaments on success', async () => {
      const mockTournaments = [{ id: '1', name: 'Test Tournament' }];
      (prisma.tournament.findMany as jest.Mock).mockResolvedValue(mockTournaments);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.tournaments).toEqual(mockTournaments);
      expect(prisma.tournament.findMany).toHaveBeenCalledTimes(1);
    });

    it('returns 500 on error', async () => {
      (prisma.tournament.findMany as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('DB Error');
    });
  });

  describe('POST', () => {
    it('creates a tournament on success', async () => {
      const mockTournament = { id: '1', name: 'New Tournament' };
      (prisma.tournament.create as jest.Mock).mockResolvedValue(mockTournament);

      const req = new NextRequest('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Tournament', slug: 'new-tournament' }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.tournament).toEqual(mockTournament);
      expect(prisma.tournament.create).toHaveBeenCalledTimes(1);
    });

    it('returns 500 on error', async () => {
      (prisma.tournament.create as jest.Mock).mockRejectedValue(new Error('Create Error'));

      const req = new NextRequest('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ name: 'New Tournament' }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Create Error');
    });
  });
});
