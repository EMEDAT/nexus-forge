// src\components\roles\professional\MentorshipSettingsForm.tsx


'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Check, 
  X, 
  Clock, 
  UserPlus, 
  MessageSquare, 
  Filter 
} from 'lucide-react';

import { User } from '@/types';
import { 
  MentorshipRequest, 
  MentorshipRequestStatus 
} from '@/types/mentorship';

import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';

interface MentorshipRequestManagerProps {
  userId: string;
}

export default function MentorshipRequestManager({ 
  userId 
}: MentorshipRequestManagerProps) {
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<MentorshipRequestStatus | 'ALL'>('ALL');
  const [selectedRequest, setSelectedRequest] = useState<MentorshipRequest | null>(null);

  useEffect(() => {
    const fetchMentorshipRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/mentorship/requests?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch mentorship requests');
        }

        const data = await response.json();
        setRequests(data);
      } catch (err) {
        console.error('Error fetching mentorship requests:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMentorshipRequests();
  }, [userId]);

  const handleRequestAction = async (
    requestId: string, 
    action: 'ACCEPT' | 'REJECT'
  ) => {
    try {
      const response = await fetch(`/api/mentorship/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED' 
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action.toLowerCase()} mentorship request`);
      }

      // Optimistically update the UI
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId 
            ? { 
                ...request, 
                status: action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED' 
              } 
            : request
        )
      );
    } catch (err) {
      console.error(`Error ${action.toLowerCase()}ing request:`, err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const filteredRequests = requests.filter(request => 
    selectedFilter === 'ALL' || request.status === selectedFilter
  );

  const renderRequestStatus = (status: MentorshipRequestStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="flex items-center text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">
            <Check className="h-3 w-3 mr-1" /> Accepted
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs">
            <X className="h-3 w-3 mr-1" /> Rejected
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="flex items-center text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs">
            <X className="h-3 w-3 mr-1" /> Cancelled
          </span>
        );
    }
  };

  const renderFilterButton = (filter: MentorshipRequestStatus | 'ALL') => {
    const isActive = selectedFilter === filter;
    return (
      <button
        key={filter}
        onClick={() => setSelectedFilter(filter)}
        className={`px-3 py-1 rounded-full text-xs transition-colors duration-200 ${
          isActive 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {filter === 'ALL' ? 'All Requests' : filter}
      </button>
    );
  };

  const openRequestDetails = (request: MentorshipRequest) => {
    setSelectedRequest(request);
  };

  const closeRequestDetails = () => {
    setSelectedRequest(null);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-6">
        <div className="flex items-center text-red-600">
          <X className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
          Mentorship Requests
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-300">
          {requests.length} total requests
        </span>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-gray-100 dark:bg-gray-800 flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-500" />
        {(['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'] as const).map((filter: 'ALL' | MentorshipRequestStatus) => 
            renderFilterButton(filter)
          )}
      </div>

      {/* Request List */}
      {filteredRequests.length === 0 ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p>No mentorship requests {selectedFilter !== 'ALL' && `with status ${selectedFilter}`}</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {filteredRequests.map(request => (
            <div 
              key={request.id} 
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
              onClick={() => openRequestDetails(request)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {request.mentee?.profileImage ? (
                    <Image 
                      src={request.mentee.profileImage} 
                      alt={request.mentee.name || 'Mentee'} 
                      width={40} 
                      height={40} 
                      className="rounded-full" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {request.mentee?.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {request.mentee?.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {request.mentee?.role} • {request.mentee?.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {renderRequestStatus(request.status)}
                  
                  {request.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRequestAction(request.id, 'ACCEPT');
                        }}
                        className="bg-green-100 text-green-600 p-2 rounded-full hover:bg-green-200 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRequestAction(request.id, 'REJECT');
                        }}
                        className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={closeRequestDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mentorship Request Details</DialogTitle>
            <DialogDescription>
              Review the details of the mentorship request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {selectedRequest.mentee?.profileImage ? (
                  <Image 
                    src={selectedRequest.mentee.profileImage} 
                    alt={selectedRequest.mentee.name || 'Mentee'} 
                    width={60} 
                    height={60} 
                    className="rounded-full" 
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                    {selectedRequest.mentee?.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{selectedRequest.mentee?.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedRequest.mentee?.role} • {selectedRequest.mentee?.country}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  {renderRequestStatus(selectedRequest.status)}
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Request Date:</span>
                  <span>{new Date(selectedRequest.createdAt).toLocaleDateString()}</span>
                </div>
                {selectedRequest.message && (
                  <div>
                    <span className="font-medium block mb-1">Message:</span>
                    <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
                      {selectedRequest.message}
                    </p>
                  </div>
                )}
              </div>

              {selectedRequest.status === 'PENDING' && (
                <div className="flex space-x-4 mt-4">
                  <Button 
                    variant="primary" 
                    onClick={() => handleRequestAction(selectedRequest.id, 'ACCEPT')}
                    className="w-full"
                  >
                    <Check className="h-4 w-4 mr-2" /> Accept Request
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleRequestAction(selectedRequest.id, 'REJECT')}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" /> Reject Request
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}