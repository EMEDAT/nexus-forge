// src/app/api/mentorship/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role'); // 'mentor' or 'mentee'
    const status = searchParams.get('status');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let mentorships;
    if (role === 'mentor') {
      mentorships = await prisma.mentorship.findMany({
        where: {
          mentorId: userId,
          ...(status && { status: status as any }),
        },
        include: {
          mentee: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              bio: true,
              expertise: true,
              experience: true,
              country: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
    } else {
      mentorships = await prisma.mentorship.findMany({
        where: {
          menteeId: userId,
          ...(status && { status: status as any }),
        },
        include: {
          mentor: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              bio: true,
              expertise: true,
              experience: true,
              country: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
    }

    return NextResponse.json(mentorships);
  } catch (error) {
    console.error('Error fetching mentorships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mentorships' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { mentorId, menteeId, status, startDate, nextSession } = body;

    if (!mentorId || !menteeId) {
      return NextResponse.json(
        { error: 'Mentor ID and Mentee ID are required' },
        { status: 400 }
      );
    }

    // Check if a mentorship between these users already exists
    const existingMentorship = await prisma.mentorship.findFirst({
      where: {
        mentorId,
        menteeId,
      },
    });

    if (existingMentorship) {
      return NextResponse.json(
        { error: 'A mentorship between these users already exists' },
        { status: 409 }
      );
    }

    const mentorship = await prisma.mentorship.create({
        data: {
          mentorId,
          menteeId,
          status: status || 'ACTIVE',
          // Cast these fields to any to bypass TypeScript checking
          ...(startDate ? { startDate: new Date(startDate) as any } : {}),
          ...(nextSession ? { nextSession: new Date(nextSession) } : {}),
        },
      });

    return NextResponse.json(mentorship);
  } catch (error) {
    console.error('Error creating mentorship:', error);
    return NextResponse.json(
      { error: 'Failed to create mentorship' },
      { status: 500 }
    );
  }
}