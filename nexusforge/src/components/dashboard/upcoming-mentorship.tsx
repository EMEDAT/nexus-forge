// src/components/dashboard/upcoming-mentorship.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { Mentorship } from '@/types/mentorship';

interface UpcomingMentorshipProps {
  userId: string;
  userRole: string;
}

interface MentorshipWithUser extends Omit<Mentorship, 'mentor' | 'mentee'> {
  mentor?: User;
  mentee?: User;
}

export default function UpcomingMentorship({ userId, userRole }: UpcomingMentorshipProps) {
  const router = useRouter();
  const [upcomingMentorships, setUpcomingMentorships] = useState<MentorshipWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingMentorships = async () => {
      setLoading(true);
      setError(null);
      try {
        const role = userRole === 'STUDENT' ? 'mentee' : 'mentor';
        const response = await fetch(
          `/api/mentorship?userId=${userId}&role=${role}&status=ACTIVE`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch upcoming mentorships');
        }

        const mentorships = await response.json();
        
        // Sort by next session date
        const sortedMentorships = mentorships
          .filter((m: MentorshipWithUser) => m.nextSession)
          .sort((a: MentorshipWithUser, b: MentorshipWithUser) => {
            if (!a.nextSession) return 1;
            if (!b.nextSession) return -1;
            return new Date(a.nextSession).getTime() - new Date(b.nextSession).getTime();
          })
          .slice(0, 3); // Take only the next 3 sessions
        
        setUpcomingMentorships(sortedMentorships);
      } catch (err) {
        console.error('Error fetching upcoming mentorships:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'An error occurred while fetching mentorships'
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUpcomingMentorships();
    }
  }, [userId, userRole]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const getTimeFromNow = (dateString: string) => {
    const now = new Date();
    const sessionDate = new Date(dateString);
    const diffMs = sessionDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `In ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
      }
      return `In ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays > 1 && diffDays < 7) {
      return `In ${diffDays} days`;
    } else {
      return formatDate(dateString);
    }
  };

  const isPastDate = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  const getMentorImage = (mentorship: MentorshipWithUser) => {
    if (userRole === 'STUDENT') {
      return mentorship.mentor?.profileImage || '/images/default-male-avatar.svg';
    } else {
      return mentorship.mentee?.profileImage || '/images/default-male-avatar.svg';
    }
  };

  const getMentorName = (mentorship: MentorshipWithUser) => {
    if (userRole === 'STUDENT') {
      return mentorship.mentor?.name || 'Mentor';
    } else {
      return mentorship.mentee?.name || 'Mentee';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 animate-pulse">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
          Upcoming Mentorship Sessions
        </h3>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
          Upcoming Mentorship Sessions
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Could not load upcoming sessions. Please try again later.
        </div>
      </div>
    );
  }

  if (upcomingMentorships.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
          Upcoming Mentorship Sessions
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          No upcoming mentorship sessions.
          {userRole === 'STUDENT' ? (
            <button
              className="block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => router.push('/roles/student/mentorship')}
            >
              Find a mentor &rarr;
            </button>
          ) : (
            <button
              className="block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => router.push('/roles/professional/mentorship/settings')}
            >
              Update availability &rarr;
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Upcoming Mentorship Sessions
        </h3>
        <button
          onClick={() => router.push(`/roles/${userRole.toLowerCase()}/mentorship`)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          View all &rarr;
        </button>
      </div>
      <div className="space-y-6">
        {upcomingMentorships.map((mentorship) => (
          <div
            key={mentorship.id}
            className={`flex items-start space-x-4 p-4 rounded-lg ${
              isPastDate(mentorship.nextSession ? mentorship.nextSession.toString() : '')
                ? 'bg-gray-50 dark:bg-gray-700'
                : 'bg-blue-50 dark:bg-blue-900/20'
            }`}
          >
            <div className="relative flex-shrink-0">
              <Image
                src={getMentorImage(mentorship)}
                alt={getMentorName(mentorship)}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {userRole === 'STUDENT' ? 'Mentorship with ' : 'Mentoring '} 
                {getMentorName(mentorship)}
              </p>
              {mentorship.nextSession && (
                <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {formatDate(mentorship.nextSession.toString())}{' '}
                    <span className="font-medium">
                      at {formatTime(mentorship.nextSession.toString())}
                    </span>
                  </span>
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
              {mentorship.nextSession && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isPastDate(mentorship.nextSession.toString())
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}
                >
                  {isPastDate(mentorship.nextSession.toString())
                    ? 'Overdue'
                    : getTimeFromNow(mentorship.nextSession.toString())}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <button
          onClick={() => router.push(`/roles/${userRole.toLowerCase()}/mentorship/schedule`)}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {userRole === 'STUDENT'
            ? 'Schedule new session'
            : 'Manage mentorship sessions'}
        </button>
      </div>
    </div>
  );
}