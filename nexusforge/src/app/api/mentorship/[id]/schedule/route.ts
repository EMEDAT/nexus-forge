// src/app/api/mentorship/[id]/schedule/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mentorshipId = params.id;
    if (!mentorshipId) {
      return NextResponse.json(
        { error: 'Mentorship ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { nextSession } = body;

    if (!nextSession) {
      return NextResponse.json(
        { error: 'Next session date is required' },
        { status: 400 }
      );
    }

    // Validate the date
    const sessionDate = new Date(nextSession);
    if (isNaN(sessionDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Ensure the session date is in the future
    if (sessionDate <= new Date()) {
      return NextResponse.json(
        { error: 'Session date must be in the future' },
        { status: 400 }
      );
    }

    // Get the mentorship to verify user permissions
    const mentorship = await prisma.mentorship.findUnique({
      where: { id: mentorshipId },
    });

    if (!mentorship) {
      return NextResponse.json(
        { error: 'Mentorship not found' },
        { status: 404 }
      );
    }

    // Ensure the user is part of this mentorship
    if (mentorship.mentorId !== session.user.id && mentorship.menteeId !== session.user.id) {
      return NextResponse.json(
        { error: 'You are not authorized to schedule sessions for this mentorship' },
        { status: 403 }
      );
    }

    // Update the mentorship with the new session date
    const updatedMentorship = await prisma.mentorship.update({
      where: { id: mentorshipId },
      data: {
        nextSession: sessionDate,
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
          },
        },
        mentee: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            bio: true,
            expertise: true,
            experience: true,
          },
        },
      },
    });

    // Create activity records for both mentor and mentee
    await prisma.activity.createMany({
      data: [
        {
          userId: mentorship.mentorId,
          type: 'MENTORSHIP_SESSION_SCHEDULED',
          description: `Mentorship session scheduled for ${sessionDate.toLocaleString()}`,
        },
        {
          userId: mentorship.menteeId,
          type: 'MENTORSHIP_SESSION_SCHEDULED',
          description: `Mentorship session scheduled for ${sessionDate.toLocaleString()}`,
        },
      ],
    });

    return NextResponse.json(updatedMentorship);
  } catch (error) {
    console.error('Error scheduling mentorship session:', error);
    return NextResponse.json(
      { error: 'Failed to schedule mentorship session' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mentorshipId = params.id;
    if (!mentorshipId) {
      return NextResponse.json(
        { error: 'Mentorship ID is required' },
        { status: 400 }
      );
    }

    // Get the mentorship to verify user permissions
    const mentorship = await prisma.mentorship.findUnique({
      where: { id: mentorshipId },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            mentorshipPreferences: true,
          },
        },
        mentee: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    if (!mentorship) {
      return NextResponse.json(
        { error: 'Mentorship not found' },
        { status: 404 }
      );
    }

    // Ensure the user is part of this mentorship
    if (mentorship.mentorId !== session.user.id && mentorship.menteeId !== session.user.id) {
      return NextResponse.json(
        { error: 'You are not authorized to view this mentorship' },
        { status: 403 }
      );
    }

    return NextResponse.json(mentorship);
  } catch (error) {
    console.error('Error fetching mentorship:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mentorship' },
      { status: 500 }
    );
  }
}