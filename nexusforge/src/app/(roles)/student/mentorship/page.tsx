// src/app/(roles)/student/mentorship/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MentorDiscoveryCard from '@/components/roles/student/MentorDiscoveryCard';
import MentorshipRequestModal from '@/components/mentorship/MentorshipRequestModal';
import { User } from '@/types';
import { MentorSearchFilters, MentorPreview, MentorAvailability } from '@/types/mentorship';


export default function StudentMentorshipPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<MentorSearchFilters>({
    country: undefined,
    expertise: [],
    availability: 'AVAILABLE',
  });

  // For search/filter functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [availableExpertise, setAvailableExpertise] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMentors: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchMentors();
      fetchExpertiseOptions();
    }
  }, [status, router, filters, pagination.currentPage]);

  const fetchExpertiseOptions = async () => {
    // This could be from an API or hardcoded
    setAvailableExpertise([
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
    ]);
  };

  const fetchMentors = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.currentPage.toString());
      queryParams.append('limit', '9'); // Number of mentors per page

      if (filters.country) {
        queryParams.append('country', filters.country);
      }

      if (filters.expertise && filters.expertise.length > 0) {
        queryParams.append('expertise', filters.expertise.join(','));
      }

      if (filters.availability) {
        queryParams.append('availability', filters.availability);
      }

      if (filters.experienceYears) {
        queryParams.append('experienceMin', filters.experienceYears.toString());
      }

      const response = await fetch(`/api/mentors/search?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch mentors');
      }

      const data = await response.json();
      setMentors(data.mentors);
      setPagination({
        currentPage: data.pagination.page,
        totalPages: data.pagination.pages,
        totalMentors: data.pagination.total,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching mentors');
      console.error('Error fetching mentors:', err);
    } finally {
      setLoading(false);
    }
  };

  const convertUserToMentorPreview = (user: User): MentorPreview => ({
    id: user.id,
    name: user.name,
    role: user.role,
    country: user.country,
    profileImage: user.profileImage,
    bio: user.bio,
    expertise: user.expertise,
    experience: user.experience,
    mentorshipAvailable: user.mentorshipAvailable || 'UNAVAILABLE',
    mentorshipPreferences: user.mentorshipPreferences || {}
  });

  const handleRequestMentorship = (mentorId: string) => {
    const mentor = mentors.find((m) => m.id === mentorId);
    if (mentor) {
      setSelectedMentor(mentor);
      setIsModalOpen(true);
    }
  };

  const handleSubmitRequest = async (mentorId: string, message: string) => {
    try {
      const response = await fetch('/api/mentorship/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId,
          menteeId: session?.user?.id,
          message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send mentorship request');
      }

      // Success! Close modal and maybe show a success message
      setIsModalOpen(false);
      // You could add a success toast/notification here
    } catch (error) {
      console.error('Error sending mentorship request:', error);
      throw error; // Re-throw so the modal component can handle it
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Reset to first page when filters change
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const handleExpertiseChange = (expertise: string) => {
    setFilters((prev) => {
      const currentExpertise = [...(prev.expertise || [])];
      
      if (currentExpertise.includes(expertise)) {
        return {
          ...prev,
          expertise: currentExpertise.filter((e) => e !== expertise),
        };
      } else {
        return {
          ...prev,
          expertise: [...currentExpertise, expertise],
        };
      }
    });
    // Reset to first page when filters change
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: newPage,
      }));
    }
  };

  const filteredMentors = mentors.filter((mentor) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      mentor.name.toLowerCase().includes(searchLower) ||
      mentor.bio?.toLowerCase().includes(searchLower) ||
      mentor.expertise?.some((exp) => exp.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Find a Mentor</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Connect with experienced architects who can guide your architectural journey
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Search mentors
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                name="search"
                placeholder="Search by name, bio, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              />
            </div>
          </div>

          {/* Country Filter */}
          <div className="w-full md:w-auto">
            <label htmlFor="country" className="sr-only">
              Country
            </label>
            <select
              id="country"
              name="country"
              value={filters.country || ''}
              onChange={handleFilterChange}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Countries</option>
              <option value="NIGERIA">Nigeria</option>
              <option value="UNITED_STATES">United States</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div className="w-full md:w-auto">
            <label htmlFor="availability" className="sr-only">
              Availability
            </label>
            <select
              id="availability"
              name="availability"
              value={filters.availability || ''}
              onChange={handleFilterChange}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Any Availability</option>
              <option value="AVAILABLE">Available</option>
              <option value="LIMITED">Limited Availability</option>
            </select>
          </div>

          {/* Experience Filter */}
          <div className="w-full md:w-auto">
            <label htmlFor="experienceYears" className="sr-only">
              Minimum Experience
            </label>
            <select
              id="experienceYears"
              name="experienceYears"
              value={filters.experienceYears || ''}
              onChange={handleFilterChange}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Any Experience</option>
              <option value="3">3+ years</option>
              <option value="5">5+ years</option>
              <option value="10">10+ years</option>
              <option value="15">15+ years</option>
            </select>
          </div>
        </div>

        {/* Expertise Filter Tags */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Expertise:
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableExpertise.map((expertise) => (
              <button
                key={expertise}
                onClick={() => handleExpertiseChange(expertise)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filters.expertise?.includes(expertise)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {expertise}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing{' '}
          <span className="font-medium text-gray-900 dark:text-white">
            {filteredMentors.length}
          </span>{' '}
          of{' '}
          <span className="font-medium text-gray-900 dark:text-white">
            {pagination.totalMentors}
          </span>{' '}
          mentors
        </p>
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
                Error loading mentors
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
      ) : (
        <>
          {/* Mentors Grid */}
          {filteredMentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <MentorDiscoveryCard
                  key={mentor.id}
                  mentor={convertUserToMentorPreview(mentor)}
                  onRequestMentorship={handleRequestMentorship}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No mentors found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search filters to find more mentors.
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page numbers */}
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      pagination.currentPage === i + 1
                        ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-200'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Mentorship Request Modal */}
      <MentorshipRequestModal
        isOpen={isModalOpen}
        mentor={selectedMentor}
        onCloseAction={() => setIsModalOpen(false)}  // Renamed
        onSubmitAction={handleSubmitRequest}  // Renamed
        />
    </div>
  );
}