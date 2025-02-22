// src\components\roles\student\MentorDiscoveryCard.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import { MentorAvailability, MentorshipPreferences } from '@/types/mentorship';

// Define the MentorPreview interface
interface MentorPreview {
  id: string;
  name: string;
  role: string;
  country: string;
  profileImage: string | null;
  bio: string | null;
  expertise: string[];
  experience: number | null;
  mentorshipAvailable: MentorAvailability;
  mentorshipPreferences: MentorshipPreferences | string;
}

interface MentorDiscoveryCardProps {
  mentor: MentorPreview;  // Changed from User to MentorPreview
  countryCode?: string;
  onRequestMentorship?: (mentorId: string) => void;
}

export default function MentorDiscoveryCard({
  mentor,
  countryCode,
  onRequestMentorship,
}: MentorDiscoveryCardProps) {
  const mentorshipPreferences: MentorshipPreferences = 
    typeof mentor.mentorshipPreferences === 'string'
      ? JSON.parse(mentor.mentorshipPreferences)
      : mentor.mentorshipPreferences || {};

  const getExperienceLabel = (years: number | null) => {
    if (!years) return 'Experience not specified';
    if (years < 5) return 'Early Career';
    if (years < 10) return 'Mid Career';
    if (years < 20) return 'Experienced';
    return 'Veteran Architect';
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

  const getCommunicationPreferenceIcon = (pref: string) => {
    switch (pref) {
      case 'VIDEO':
        return '📹';
      case 'CHAT':
        return '💬';
      case 'IN_PERSON':
        return '🤝';
      case 'MIXED':
      default:
        return '📱';
    }
  };

  const handleRequestClick = () => {
    // Add a check to ensure onRequestMentorship exists before calling it
    if (onRequestMentorship) {
      onRequestMentorship(mentor.id);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Availability Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            mentor.mentorshipAvailable === 'AVAILABLE'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
              : mentor.mentorshipAvailable === 'LIMITED'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
          }`}
        >
          {mentor.mentorshipAvailable === 'AVAILABLE'
            ? 'Available'
            : mentor.mentorshipAvailable === 'LIMITED'
            ? 'Limited Availability'
            : 'Unavailable'}
        </span>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Profile Image */}
          <div className="relative h-24 w-24 mx-auto md:mx-0 flex-shrink-0">
            <Image
              src={mentor.profileImage || '/images/default-male-avatar.svg'}
              alt={mentor.name}
              fill
              className="rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
            />
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
              {mentor.country && (
                <Image
                  src={getCountryFlag(mentor.country)}
                  alt={mentor.country}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              )}
            </div>
          </div>

          {/* Mentor Info */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {mentor.name}
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
              {mentor.role === 'PROFESSIONAL'
                ? 'Professional Architect'
                : mentor.role === 'VETERAN'
                ? 'Veteran Architect'
                : 'Architect'}
              {mentor.experience && ` • ${getExperienceLabel(mentor.experience)}`}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
              {mentor.bio || 'No bio available.'}
            </p>

            {/* Expertise Tags */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {mentor.expertise?.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                >
                  {skill}
                </span>
              ))}
              {mentor.expertise && mentor.expertise.length > 4 && (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  +{mentor.expertise.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mentorship Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <span className="block text-gray-500 dark:text-gray-400 text-xs">Preferred Mentees</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {mentorshipPreferences?.experienceLevel === 'BEGINNER'
                ? 'Beginner Students'
                : mentorshipPreferences?.experienceLevel === 'ADVANCED'
                ? 'Advanced Students'
                : 'All Experience Levels'}
            </span>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <span className="block text-gray-500 dark:text-gray-400 text-xs">Communication</span>
            <span className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
              {getCommunicationPreferenceIcon(mentorshipPreferences?.communicationPreference || 'MIXED')}
              <span className="ml-1">
                {mentorshipPreferences?.communicationPreference === 'VIDEO'
                  ? 'Video Calls'
                  : mentorshipPreferences?.communicationPreference === 'CHAT'
                  ? 'Text Chat'
                  : mentorshipPreferences?.communicationPreference === 'IN_PERSON'
                  ? 'In-Person'
                  : 'Flexible'}
              </span>
            </span>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <span className="block text-gray-500 dark:text-gray-400 text-xs">Session Length</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {mentorshipPreferences?.sessionDuration
                ? `${mentorshipPreferences.sessionDuration} minutes`
                : 'Flexible'}
            </span>
          </div>
        </div>

        {/* Preferred Topics */}
        {mentorshipPreferences?.preferredTopics && mentorshipPreferences.preferredTopics.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mentors On:</h4>
            <div className="flex flex-wrap gap-2">
              {mentorshipPreferences.preferredTopics.slice(0, 5).map((topic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100"
                >
                  {topic}
                </span>
              ))}
              {mentorshipPreferences.preferredTopics.length > 5 && (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  +{mentorshipPreferences.preferredTopics.length - 5} more topics
                </span>
              )}
            </div>
          </div>
        )}

        {/* Request Button */}
        <div className="mt-6">
          <button
            onClick={handleRequestClick}
            disabled={mentor.mentorshipAvailable === 'UNAVAILABLE'}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Request Mentorship
          </button>
        </div>
      </div>
    </div>
  );
}