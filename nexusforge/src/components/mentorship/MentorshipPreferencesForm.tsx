'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MentorshipPreferences, MentorAvailability } from '@/types/mentorship';
import { User } from '@/types';

interface MentorshipPreferencesFormProps {
    user: User;
    initialPreferences?: MentorshipPreferences;
    onSubmitAction: (preferences: MentorshipPreferences, availability: MentorAvailability) => Promise<void>;
  }

const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const TIME_SLOTS = [
  '8:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 2:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM',
  '6:00 PM - 8:00 PM',
  '8:00 PM - 10:00 PM',
];

const EXPERIENCE_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner - First year students' },
  { value: 'INTERMEDIATE', label: 'Intermediate - 2-3 year students' },
  { value: 'ADVANCED', label: 'Advanced - Final year/Masters students' },
];

const COMMUNICATION_PREFERENCES = [
  { value: 'VIDEO', label: 'Video Calls' },
  { value: 'CHAT', label: 'Text Chat' },
  { value: 'IN_PERSON', label: 'In-Person Meetings' },
  { value: 'MIXED', label: 'Mixed (Flexible)' },
];

const COMMON_ARCHITECTURE_TOPICS = [
  'Architectural Design Principles',
  'Sustainable Architecture',
  'Building Codes & Regulations',
  'Structural Systems',
  'Digital Modeling & BIM',
  'Construction Management',
  'Architectural History & Theory',
  'Urban Planning',
  'Interior Design',
  'Landscape Architecture',
  'Architectural Drawing & Visualization',
  'Project Management',
  'Client Relations',
  'Professional Practice',
];

export default function MentorshipPreferencesForm({
    user,
    initialPreferences,
    onSubmitAction, // Renamed
  }: MentorshipPreferencesFormProps) {
  const router = useRouter();
  const [availability, setAvailability] = useState<MentorAvailability>(
    user.mentorshipAvailable || 'UNAVAILABLE'
  );
  const [preferences, setPreferences] = useState<MentorshipPreferences>(
    initialPreferences || {
      availableHours: {},
      preferredTopics: [],
      experienceLevel: 'INTERMEDIATE',
      maxMentees: 3,
      sessionDuration: 60,
      communicationPreference: 'MIXED',
      languages: ['English'],
      notes: '',
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Convert JSON preferences if needed
  useEffect(() => {
    if (typeof initialPreferences === 'string') {
      try {
        setPreferences(JSON.parse(initialPreferences));
      } catch (e) {
        console.error('Failed to parse preferences JSON:', e);
      }
    }
  }, [initialPreferences]);

  const handleAvailabilityChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setAvailability(e.target.value as MentorAvailability);
  };

  const handleTimeSlotToggle = (day: string, timeSlot: string) => {
    setPreferences((prev) => {
      const availableHours = { ...prev.availableHours };
      const daySlots = [...(availableHours[day as keyof typeof availableHours] || [])];
      
      if (daySlots.includes(timeSlot)) {
        // Remove the time slot
        const updatedSlots = daySlots.filter((slot) => slot !== timeSlot);
        availableHours[day as keyof typeof availableHours] = updatedSlots;
      } else {
        // Add the time slot
        availableHours[day as keyof typeof availableHours] = [...daySlots, timeSlot];
      }
      
      return {
        ...prev,
        availableHours,
      };
    });
  };

  const handleTopicToggle = (topic: string) => {
    setPreferences((prev) => {
      const topics = [...(prev.preferredTopics || [])];
      
      if (topics.includes(topic)) {
        // Remove the topic
        return {
          ...prev,
          preferredTopics: topics.filter((t) => t !== topic),
        };
      } else {
        // Add the topic
        return {
          ...prev,
          preferredTopics: [...topics, topic],
        };
      }
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: name === 'maxMentees' || name === 'sessionDuration'
        ? parseInt(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Validate preferences
      if (availability !== 'UNAVAILABLE' && 
          (!preferences.availableHours || 
           Object.values(preferences.availableHours).every(slots => !slots || slots.length === 0))) {
        throw new Error('Please select at least one available time slot');
      }

      await onSubmitAction(preferences, availability);
      setSuccessMessage('Your mentorship preferences have been updated successfully!');
      
      // Redirect after a delay
      setTimeout(() => {
        if (user.role === 'PROFESSIONAL') {
          router.push('/roles/professional/mentorship');
        } else if (user.role === 'VETERAN') {
          router.push('/roles/veteran/mentorship');
        }
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update mentorship preferences. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTimeSlotSelected = (day: string, timeSlot: string): boolean => {
    const daySlots = preferences.availableHours?.[day as keyof typeof preferences.availableHours];
    return Array.isArray(daySlots) && daySlots.includes(timeSlot);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Mentorship Preferences
      </h2>

      {successMessage && (
        <div className="mb-6 rounded-md bg-green-50 dark:bg-green-900/30 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Success
              </h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                {successMessage}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-md bg-red-50 dark:bg-red-900/30 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Availability Selection */}
          <div>
            <label
              htmlFor="availability"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Mentorship Availability
            </label>
            <select
              id="availability"
              name="availability"
              value={availability}
              onChange={handleAvailabilityChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="AVAILABLE">Available (Actively seeking mentees)</option>
              <option value="LIMITED">Limited Availability (Selective mentoring)</option>
              <option value="UNAVAILABLE">Unavailable (Not mentoring at this time)</option>
            </select>
          </div>

          {/* Only show the rest of the form if mentor is available or limited */}
          {availability !== 'UNAVAILABLE' && (
            <>
              {/* Available Hours */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Available Hours
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Select the time slots when you're typically available for mentoring.
                </p>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Day
                        </th>
                        {TIME_SLOTS.map((slot) => (
                          <th
                            key={slot}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            {slot}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {DAYS_OF_WEEK.map((day) => (
                        <tr key={day}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {day}
                          </td>
                          {TIME_SLOTS.map((slot) => (
                            <td key={`${day}-${slot}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <button
                                type="button"
                                onClick={() => handleTimeSlotToggle(day, slot)}
                                className={`h-6 w-6 rounded border ${
                                  isTimeSlotSelected(day, slot)
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                                }`}
                                aria-label={`Toggle ${slot} on ${day}`}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Preferred Topics */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Preferred Mentoring Topics
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Select the topics you're comfortable mentoring on.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {COMMON_ARCHITECTURE_TOPICS.map((topic) => (
                    <div key={topic} className="flex items-center">
                      <input
                        id={`topic-${topic}`}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                        checked={(preferences.preferredTopics || []).includes(topic)}
                        onChange={() => handleTopicToggle(topic)}
                      />
                      <label
                        htmlFor={`topic-${topic}`}
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        {topic}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Level Preference */}
              <div>
                <label
                  htmlFor="experienceLevel"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Preferred Mentee Experience Level
                </label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={preferences.experienceLevel || 'INTERMEDIATE'}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {EXPERIENCE_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Mentees */}
              <div>
                <label
                  htmlFor="maxMentees"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Maximum Number of Mentees
                </label>
                <input
                  type="number"
                  name="maxMentees"
                  id="maxMentees"
                  min="1"
                  max="10"
                  value={preferences.maxMentees || 3}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  How many mentees can you comfortably mentor at once?
                </p>
              </div>

              {/* Session Duration */}
              <div>
                <label
                  htmlFor="sessionDuration"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Typical Session Duration (minutes)
                </label>
                <select
                  id="sessionDuration"
                  name="sessionDuration"
                  value={preferences.sessionDuration || 60}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              {/* Communication Preference */}
              <div>
                <label
                  htmlFor="communicationPreference"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Preferred Communication Method
                </label>
                <select
                  id="communicationPreference"
                  name="communicationPreference"
                  value={preferences.communicationPreference || 'MIXED'}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {COMMUNICATION_PREFERENCES.map((pref) => (
                    <option key={pref.value} value={pref.value}>
                      {pref.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Additional Notes for Potential Mentees
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={preferences.notes || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Any additional information you'd like potential mentees to know..."
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}