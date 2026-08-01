import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: {
        brackets: true,
        organization: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, tournaments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, sport, format, organizationId } = body;

    // Create tournament with initial bracket state schema
    const tournament = await prisma.tournament.create({
      data: {
        name,
        slug,
        sport: sport || 'Pickleball',
        format: format || 'SingleElimination',
        organizationId: organizationId || 'org-atlanta-1',
        brackets: {
          create: [
            {
              name: `${name} Open Bracket`,
              division: 'Open Division 4.0+',
              data: JSON.stringify({
                rounds: [
                  { id: 'r1', name: 'Quarterfinals' },
                  { id: 'r2', name: 'Semifinals' },
                  { id: 'r3', name: 'Finals' },
                ],
              }),
            },
          ],
        },
      },
      include: {
        brackets: true,
      },
    });

    return NextResponse.json({ success: true, tournament });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
