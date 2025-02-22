// src/app/api/mentorship/requests/route.ts
// src/app/api/mentorship/requests/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { MentorAvailability } from '@/types/mentorship';
import { PrismaClient } from '@prisma/client';

// Cast prisma to include mentorshipRequest
const prismaWithMentorshipRequest = prisma as PrismaClient & {
  mentorshipRequest: any
};

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

    let requests;
    if (role === 'mentor') {
      // Fetch requests received by the mentor
      requests = await prismaWithMentorshipRequest.mentorshipRequest.findMany({
        where: {
          mentorId: userId,
          ...(status && { status }),
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
          createdAt: 'desc',
        },
      });
    } else {
      // Fetch requests sent by the mentee
      requests = await prismaWithMentorshipRequest.mentorshipRequest.findMany({
        where: {
          menteeId: userId,
          ...(status && { status }),
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
          createdAt: 'desc',
        },
      });
    }

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching mentorship requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mentorship requests' },
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

    const body: {
        mentorId: string;
        menteeId: string;
        message?: string;
      } = await request.json();
    const { mentorId, menteeId, message } = body;

    if (!mentorId || !menteeId) {
      return NextResponse.json(
        { error: 'Mentor ID and Mentee ID are required' },
        { status: 400 }
      );
    }

    // Check if a request between these users already exists
    const existingRequest = await prismaWithMentorshipRequest.mentorshipRequest.findFirst({
      where: {
        mentorId,
        menteeId,
        status: 'PENDING',
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'A pending request between these users already exists' },
        { status: 409 }
      );
    }

    // Check if a mentorship between these users already exists
    const existingMentorship = await prisma.mentorship.findFirst({
      where: {
        mentorId,
        menteeId,
        status: 'ACTIVE',
      },
    });

    if (existingMentorship) {
      return NextResponse.json(
        { error: 'An active mentorship between these users already exists' },
        { status: 409 }
      );
    }

    const newRequest = await prismaWithMentorshipRequest.mentorshipRequest.create({
        data: {
          mentorId,
          menteeId,
          message,
          status: 'PENDING',
        },
      });

    // Create an activity for both users
    await prisma.activity.createMany({
      data: [
        {
          userId: menteeId,
          type: 'MENTORSHIP_REQUEST_SENT',
          description: `You sent a mentorship request to a mentor`,
        },
        {
          userId: mentorId,
          type: 'MENTORSHIP_REQUEST_RECEIVED',
          description: `You received a mentorship request from a mentee`,
        },
      ],
    });

    return NextResponse.json(newRequest);
  } catch (error) {
    console.error('Error creating mentorship request:', error);
    return NextResponse.json(
      { error: 'Failed to create mentorship request' },
      { status: 500 }
    );
  }
}