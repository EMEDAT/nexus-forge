// src/components/mentorship/MentorProfileCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User } from '@/types';

interface MentorProfileCardProps {
  mentor: User & {
    _count?: {
      mentorshipsAsMentor: number;
    };
  };
  onRequestMentorship?: (mentorId: string) => void;
}

export default function MentorProfileCard({
  mentor,
  onRequestMentorship,
}: MentorProfileCardProps) {
  const router = useRouter();

  const handleViewProfile = () => {
    router.push(`/mentorship/mentors/${mentor.id}`);
  };

  const handleRequestMentorship = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRequestMentorship) {
      onRequestMentorship(mentor.id);
    }
  };

  const getAvailabilityBadgeColor = (availability: string) => {
    switch (availability) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'LIMITED':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNAVAILABLE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCountryFlag = (country: string) => {
    switch (country) {
      case 'NIGERIA':
        return '/images/nigeria-flag.svg';
      case 'UNITED_STATES':
        return '/images/us-flag.svg';
      default:
        return '';
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={handleViewProfile}
    >
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative h-16 w-16 flex-shrink-0">
            <Image
              src={mentor.profileImage || '/images/default-male-avatar.svg'}
              alt={mentor.name}
              fill
              className="rounded-full object-cover"
            />
            {mentor.mentorshipAvailable && (
              <div
                className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                  mentor.mentorshipAvailable === 'AVAILABLE'
                    ? 'bg-green-500'
                    : mentor.mentorshipAvailable === 'LIMITED'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {mentor.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {mentor.role === 'PROFESSIONAL'
                ? 'Professional Architect'
                : mentor.role === 'VETERAN'
                ? 'Veteran Architect'
                : 'Architect'}
            </p>
            <div className="flex items-center mt-1 space-x-2">
              {mentor.country && (
                <div className="flex items-center">
                  <Image
                    src={getCountryFlag(mentor.country)}
                    alt={mentor.country}
                    width={16}
                    height={16}
                    className="mr-1"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {mentor.country === 'NIGERIA'
                      ? 'Nigeria'
                      : mentor.country === 'UNITED_STATES'
                      ? 'United States'
                      : mentor.country}
                  </span>
                </div>
              )}
              {mentor.experience && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {mentor.experience}+ years
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {mentor.bio || 'No bio available'}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {mentor.expertise?.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
            >
              {skill}
            </span>
          ))}
          {mentor.expertise && mentor.expertise.length > 3 && (
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              +{mentor.expertise.length - 3} more
            </span>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityBadgeColor(
                mentor.mentorshipAvailable || 'UNAVAILABLE'
              )}`}
            >
              {mentor.mentorshipAvailable === 'AVAILABLE'
                ? 'Available'
                : mentor.mentorshipAvailable === 'LIMITED'
                ? 'Limited Availability'
                : 'Unavailable'}
            </span>
          </div>
          {mentor._count && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {mentor._count.mentorshipsAsMentor} active mentees
            </div>
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={handleRequestMentorship}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={mentor.mentorshipAvailable === 'UNAVAILABLE'}
          >
            Request Mentorship
          </button>
        </div>
      </div>
    </div>
  );
}