// src/app/api/users/[id]/mentorship-preferences/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
// import { MentorAvailability } from '@/types/mentorship';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = params.id;
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'You can only update your own preferences' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { preferences, availability } = body;

    if (!preferences || !availability) {
      return NextResponse.json(
        { error: 'Preferences and availability are required' },
        { status: 400 }
      );
    }

    // Get user to check role
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Ensure only professionals and veterans can update mentorship preferences
    if (user.role !== 'PROFESSIONAL' && user.role !== 'VETERAN') {
      return NextResponse.json(
        { error: 'Only professional architects and veterans can update mentorship preferences' },
        { status: 403 }
      );
    }

    // Validate availability
    if (!['AVAILABLE', 'LIMITED', 'UNAVAILABLE'].includes(availability)) {
      return NextResponse.json(
        { error: 'Invalid availability status' },
        { status: 400 }
      );
    }

    // Update user preferences
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          mentorshipAvailable: availability,
          mentorshipPreferences: preferences as any,
        },
        select: {
          id: true,
          mentorshipAvailable: true,
          mentorshipPreferences: true,
          role: true,
        },
      });

    // Return only necessary data
    return NextResponse.json({
        id: updatedUser.id,
        mentorshipAvailable: updatedUser.mentorshipAvailable,
        mentorshipPreferences: updatedUser.mentorshipPreferences,
      });
    } catch (error) {
    console.error('Error updating mentorship preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update mentorship preferences' },
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

    const userId = params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        mentorshipAvailable: true,
        mentorshipPreferences: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching mentorship preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mentorship preferences' },
      { status: 500 }
    );
  }
}