// src/app/api/mentorship/requests/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestId = params.id;
    if (!requestId) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
    }

    const mentorshipRequest = await prisma.mentorshipRequest.findUnique({
      where: {
        id: requestId,
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
            mentorshipPreferences: true,
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
            country: true,
          },
        },
      },
    });

    if (!mentorshipRequest) {
      return NextResponse.json(
        { error: 'Mentorship request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(mentorshipRequest);
  } catch (error) {
    console.error('Error fetching mentorship request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mentorship request' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestId = params.id;
    if (!requestId) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { status, responseMessage } = body;

    if (!status || !['ACCEPTED', 'REJECTED', 'CANCELLED'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required' },
        { status: 400 }
      );
    }

    // Get the request details first to perform validations
    const mentorshipRequest = await prisma.mentorshipRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!mentorshipRequest) {
      return NextResponse.json(
        { error: 'Mentorship request not found' },
        { status: 404 }
      );
    }

    // Ensure the user is authorized to update this request
    const userId = session.user.id;
    const { mentorId, menteeId } = mentorshipRequest;
    
    if (userId !== mentorId && userId !== menteeId) {
      return NextResponse.json(
        { error: 'You are not authorized to update this request' },
        { status: 403 }
      );
    }

    // Only mentors can accept/reject, only mentees can cancel
    if ((status === 'ACCEPTED' || status === 'REJECTED') && userId !== mentorId) {
      return NextResponse.json(
        { error: 'Only mentors can accept or reject requests' },
        { status: 403 }
      );
    }

    if (status === 'CANCELLED' && userId !== menteeId) {
      return NextResponse.json(
        { error: 'Only mentees can cancel requests' },
        { status: 403 }
      );
    }

    // Update the request status
    const updatedRequest = await prisma.mentorshipRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status,
        ...(responseMessage && { message: responseMessage }),
      },
    });

    // If the request is accepted, create a mentorship
    if (status === 'ACCEPTED') {
      await prisma.mentorship.create({
        data: {
          mentorId: mentorshipRequest.mentorId,
          menteeId: mentorshipRequest.menteeId,
          status: 'ACTIVE',
          startDate: new Date(),
        },
      });

      // Create activities for both users
      await prisma.activity.createMany({
        data: [
          {
            userId: mentorshipRequest.menteeId,
            type: 'MENTORSHIP_STARTED',
            description: `Your mentorship request was accepted`,
          },
          {
            userId: mentorshipRequest.mentorId,
            type: 'MENTORSHIP_STARTED',
            description: `You accepted a mentorship request`,
          },
        ],
      });
    } else {
      // Create appropriate activities based on the status
      const activityType = 
        status === 'REJECTED' ? 'MENTORSHIP_REQUEST_REJECTED' :
        status === 'CANCELLED' ? 'MENTORSHIP_REQUEST_CANCELLED' : '';
      
      const menteeDescription = 
        status === 'REJECTED' ? 'Your mentorship request was rejected' :
        status === 'CANCELLED' ? 'You cancelled your mentorship request' : '';
      
      const mentorDescription = 
        status === 'REJECTED' ? 'You rejected a mentorship request' :
        status === 'CANCELLED' ? 'A mentorship request was cancelled' : '';

      if (activityType) {
        await prisma.activity.createMany({
          data: [
            {
              userId: mentorshipRequest.menteeId,
              type: activityType,
              description: menteeDescription,
            },
            {
              userId: mentorshipRequest.mentorId,
              type: activityType,
              description: mentorDescription,
            },
          ],
        });
      }
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Error updating mentorship request:', error);
    return NextResponse.json(
      { error: 'Failed to update mentorship request' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestId = params.id;
    if (!requestId) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
    }

    // Get the request details first to perform validations
    const mentorshipRequest = await prisma.mentorshipRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!mentorshipRequest) {
      return NextResponse.json(
        { error: 'Mentorship request not found' },
        { status: 404 }
      );
    }

    // Ensure the user is authorized to delete this request
    const userId = session.user.id;
    const { mentorId, menteeId } = mentorshipRequest;
    
    if (userId !== mentorId && userId !== menteeId) {
      return NextResponse.json(
        { error: 'You are not authorized to delete this request' },
        { status: 403 }
      );
    }

    await prisma.mentorshipRequest.delete({
      where: {
        id: requestId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting mentorship request:', error);
    return NextResponse.json(
      { error: 'Failed to delete mentorship request' },
      { status: 500 }
    );
  }
}