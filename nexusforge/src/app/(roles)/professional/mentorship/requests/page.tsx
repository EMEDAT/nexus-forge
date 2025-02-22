'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MentorshipRequest } from '@/types/mentorship';
import { User } from '@/types';

export default function ProfessionalMentorshipRequestsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<(MentorshipRequest & { mentee: User })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRequest, setActiveRequest] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<'PENDING' | 'ALL' | 'ACCEPTED' | 'REJECTED'>('PENDING');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchRequests();
    }
  }, [status, router, currentFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!session?.user?.id) return;

      const statusParam = currentFilter !== 'ALL' ? `&status=${currentFilter}` : '';
      const response = await fetch(
        `/api/mentorship/requests?userId=${session.user.id}&role=mentor${statusParam}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch mentorship requests');
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching requests'
      );
      console.error('Error fetching mentorship requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/mentorship/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'ACCEPTED',
          responseMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to accept request');
      }

      // Update local state
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status: 'ACCEPTED' } : req
        )
      );
      
      setActiveRequest(null);
      setResponseMessage('');
      
      // Optionally show success message
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to accept mentorship request'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (requestId: string) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/mentorship/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'REJECTED',
          responseMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject request');
      }

      // Update local state
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status: 'REJECTED' } : req
        )
      );
      
      setActiveRequest(null);
      setResponseMessage('');
      
      // Optionally show success message
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to reject mentorship request'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Pending
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Accepted
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Rejected
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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

  const pendingRequests = requests.filter((req) => req.status === 'PENDING');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mentorship Requests
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage requests from students seeking your mentorship
          </p>
        </div>
        <div>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setCurrentFilter('PENDING')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                currentFilter === 'PENDING'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Pending
              {pendingRequests.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-100 rounded-full">
                  {pendingRequests.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setCurrentFilter('ACCEPTED')}
              className={`px-4 py-2 text-sm font-medium ${
                currentFilter === 'ACCEPTED'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-t border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Accepted
            </button>
            <button
              type="button"
              onClick={() => setCurrentFilter('REJECTED')}
              className={`px-4 py-2 text-sm font-medium ${
                currentFilter === 'REJECTED'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-t border-b border-r border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Rejected
            </button>
            <button
              type="button"
              onClick={() => setCurrentFilter('ALL')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                currentFilter === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                An error occurred
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No {currentFilter.toLowerCase() !== 'all' ? currentFilter.toLowerCase() : ''} mentorship requests
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {currentFilter === 'PENDING'
              ? "You don't have any pending mentorship requests at the moment."
              : currentFilter === 'ALL'
              ? "You haven't received any mentorship requests yet."
              : `You don't have any ${currentFilter.toLowerCase()} mentorship requests.`}
          </p>
          {currentFilter !== 'PENDING' && pendingRequests.length > 0 && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setCurrentFilter('PENDING')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Pending Requests ({pendingRequests.length})
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {requests.map((request) => (
              <li key={request.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={request.mentee.profileImage || '/images/default-male-avatar.svg'}
                      alt={request.mentee.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-medium text-gray-900 dark:text-white">
                        <span className="truncate">{request.mentee.name}</span>
                      </h2>
                      <div className="ml-2 flex-shrink-0 flex">
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="truncate flex items-center">
                        <span className="mr-1.5">
                          {request.mentee.country && (
                            <Image
                              src={getCountryFlag(request.mentee.country)}
                              alt={request.mentee.country}
                              width={16}
                              height={16}
                              className="inline-block mr-1"
                            />
                          )}
                        </span>
                        <span>
                          Student • {request.mentee.experience || 0} years experience
                        </span>
                      </span>
                      <span className="mx-2 inline-block">•</span>
                      <span>Requested {formatDate(request.createdAt.toString())}</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                        "{request.message}"
                      </p>
                    </div>
                    
                    {/* Expertise Tags */}
                    {request.mentee.expertise && request.mentee.expertise.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {request.mentee.expertise.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions for pending requests */}
                    {request.status === 'PENDING' && (
                      <div className="mt-4">
                        {activeRequest === request.id ? (
                          <div className="space-y-4">
                            <div>
                              <label
                                htmlFor="responseMessage"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                              >
                                Response Message (Optional)
                              </label>
                              <textarea
                                id="responseMessage"
                                name="responseMessage"
                                rows={3}
                                value={responseMessage}
                                onChange={(e) => setResponseMessage(e.target.value)}
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                                placeholder="Share any additional information or next steps..."
                              ></textarea>
                            </div>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleAccept(request.id)}
                                disabled={submitting}
                                className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed"
                              >
                                {submitting ? 'Processing...' : 'Accept Request'}
                              </button>
                              <button
                                onClick={() => handleReject(request.id)}
                                disabled={submitting}
                                className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed"
                              >
                                {submitting ? 'Processing...' : 'Decline Request'}
                              </button>
                              <button
                                onClick={() => {
                                  setActiveRequest(null);
                                  setResponseMessage('');
                                }}
                                disabled={submitting}
                                className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => setActiveRequest(request.id)}
                              className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Respond to Request
                            </button>
                            <button
                              onClick={() => router.push(`/profile/${request.mentee.id}`)}
                              className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              View Profile
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions for non-pending requests */}
                    {request.status !== 'PENDING' && (
                      <div className="mt-4">
                        <button
                          onClick={() => router.push(`/profile/${request.mentee.id}`)}
                          className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Profile
                        </button>
                        {request.status === 'ACCEPTED' && (
                          <button
                            onClick={() => router.push(`/mentorship/${request.id}`)}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            View Mentorship
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}