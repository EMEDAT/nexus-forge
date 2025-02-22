'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { User } from '@/types';

interface MentorshipRequestModalProps {
    isOpen: boolean;
    mentor: User | null;
    onCloseAction: () => void;  // Renamed from onClose
    onSubmitAction: (mentorId: string, message: string) => Promise<void>;  // Renamed from onSubmit
  }

  export default function MentorshipRequestModal({
    isOpen,
    mentor,
    onCloseAction,
    onSubmitAction,  
  }: MentorshipRequestModalProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !mentor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please write a message to the mentor');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
        await onSubmitAction(mentor.id, message);
        onCloseAction();
      } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to send mentorship request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCountryName = (country: string) => {
    switch (country) {
      case 'NIGERIA':
        return 'Nigeria';
      case 'UNITED_STATES':
        return 'United States';
      default:
        return country;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onCloseAction}
        />

        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <Image
                  src={mentor.profileImage || '/images/default-male-avatar.svg'}
                  alt={mentor.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  id="modal-title"
                >
                  Request Mentorship from {mentor.name}
                </h3>
                <div className="mt-2">
                  <div className="flex flex-col space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <span className="font-medium">Role:</span>
                      <span className="ml-2">
                        {mentor.role === 'PROFESSIONAL'
                          ? 'Professional Architect'
                          : mentor.role === 'VETERAN'
                          ? 'Veteran Architect'
                          : 'Architect'}
                      </span>
                    </div>
                    {mentor.experience && (
                      <div className="flex items-center">
                        <span className="font-medium">Experience:</span>
                        <span className="ml-2">{mentor.experience} years</span>
                      </div>
                    )}
                    {mentor.country && (
                      <div className="flex items-center">
                        <span className="font-medium">Country:</span>
                        <span className="ml-2">
                          {getCountryName(mentor.country)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center flex-wrap">
                      <span className="font-medium">Expertise:</span>
                      <div className="ml-2 flex flex-wrap gap-1 mt-1">
                        {mentor.expertise &&
                          mentor.expertise.map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                            >
                              {skill}
                            </span>
                          ))}
                        {(!mentor.expertise || mentor.expertise.length === 0) && (
                          <span className="text-gray-400 italic">
                            No expertise listed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Explain why you're interested in being mentored by this architect and what you hope to learn..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Be specific about your learning goals and availability.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/30 p-4">
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
              </form>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </button>
            <button
              type="button"
              onClick={onCloseAction}
              disabled={isSubmitting}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}