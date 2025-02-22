// src/app/api/mentors/search/route.ts
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
    const country = searchParams.get('country');
    const expertise = searchParams.get('expertise')?.split(',');
    const experienceMin = searchParams.get('experienceMin');
    const availability = searchParams.get('availability');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build the where clause for the query
    const where: any = {
      OR: [
        { role: 'PROFESSIONAL' },
        { role: 'VETERAN' }
      ],
      mentorshipAvailable: {
        in: availability ? [availability] : ['AVAILABLE', 'LIMITED']
      }
    };

    if (country) {
      where.country = country;
    }

    if (expertise && expertise.length > 0) {
      where.expertise = {
        hasSome: expertise
      };
    }

    if (experienceMin) {
      where.experience = {
        gte: parseInt(experienceMin)
      };
    }

    // Query for mentors
    const mentors = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        country: true,
        state: true,
        profileImage: true,
        bio: true,
        expertise: true,
        experience: true,
        mentorshipAvailable: true,
        mentorshipPreferences: true,
        createdAt: true,
        _count: {
          select: {
            mentorshipsAsMentor: true
          }
        }
      },
      orderBy: {
        experience: 'desc'
      },
      skip,
      take: limit
    });

    // Get total count for pagination
    const totalMentors = await prisma.user.count({
      where
    });

    return NextResponse.json({
      mentors,
      pagination: {
        total: totalMentors,
        page,
        limit,
        pages: Math.ceil(totalMentors / limit)
      }
    });
  } catch (error) {
    console.error('Error searching mentors:', error);
    return NextResponse.json(
      { error: 'Failed to search mentors' },
      { status: 500 }
    );
  }
}