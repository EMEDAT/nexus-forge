// src/components/roles/veteran/MentorshipRequestManager.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Check, 
  X, 
  Clock, 
  UserPlus, 
  MessageSquare, 
  Filter,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Star,
  Users
} from 'lucide-react';

import { User } from '@/types';
import { 
  MentorshipRequest,
} from '@/types/mentorship';

import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';

interface MentorshipRequestManagerProps {
  userId: string;
}

type RequestType = 'ALL' | 'STUDENT' | 'PROFESSIONAL';

type MentorshipRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'DELEGATED';

interface EnhancedMentorshipRequest extends MentorshipRequest {
  mentorshipPlan?: {
    focusAreas: string[];
    expectedDuration: string;
    milestones: string[];
  };
  delegatedTo?: User;
}

export default function MentorshipRequestManager({ 
  userId 
}: MentorshipRequestManagerProps) {
  const [requests, setRequests] = useState<EnhancedMentorshipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<MentorshipRequestStatus | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<RequestType>('ALL');
  const [selectedRequest, setSelectedRequest] = useState<EnhancedMentorshipRequest | null>(null);
  const [showMentorshipPlan, setShowMentorshipPlan] = useState(false);
  const [potentialMentors, setPotentialMentors] = useState<User[]>([]);

  useEffect(() => {
    const fetchMentorshipRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/mentorship/requests/veteran?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch mentorship requests');
        }

        const data = await response.json();
        setRequests(data);

        // Also fetch potential mentors for delegation
        const mentorsResponse = await fetch('/api/mentors/available');
        if (mentorsResponse.ok) {
          const mentorsData = await mentorsResponse.json();
          setPotentialMentors(mentorsData);
        }
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
    action: 'ACCEPT' | 'REJECT' | 'DELEGATE',
    mentorshipPlan?: any,
    delegatedToId?: string
  ) => {
    try {
      const response = await fetch(`/api/mentorship/requests/veteran/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: action === 'ACCEPT' ? 'ACCEPTED' : 
                  action === 'REJECT' ? 'REJECTED' : 
                  'DELEGATED',
          mentorshipPlan,
          delegatedToId
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
                status: action === 'ACCEPT' ? 'ACCEPTED' : 
                        action === 'REJECT' ? 'REJECTED' : 
                        'DELEGATED',
                mentorshipPlan,
                delegatedTo: delegatedToId 
                  ? potentialMentors.find(m => m.id === delegatedToId) 
                  : undefined
              } 
            : request
        ) as EnhancedMentorshipRequest[]
      );
  
      setShowMentorshipPlan(false);
      setSelectedRequest(null);
    } catch (err) {
      console.error(`Error ${action.toLowerCase()}ing request:`, err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = selectedFilter === 'ALL' || request.status === selectedFilter;
    const matchesType = selectedType === 'ALL' || 
      (selectedType === 'STUDENT' && request.mentee?.role === 'STUDENT') ||
      (selectedType === 'PROFESSIONAL' && request.mentee?.role === 'PROFESSIONAL');
    return matchesStatus && matchesType;
  });

  const renderRequestIcon = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return <GraduationCap className="h-4 w-4 text-blue-500" />;
      case 'PROFESSIONAL':
        return <Briefcase className="h-4 w-4 text-purple-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

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
      default:
        return null;
    }
  };

  const renderExperienceLevel = (experience: number) => {
    if (experience < 5) return '< 5 years';
    if (experience < 10) return '5-10 years';
    if (experience < 15) return '10-15 years';
    return '15+ years';
  };

  const renderMentorshipPlanForm = () => (
    <div className="space-y-4 mt-4">
      <div>
        <h4 className="font-medium mb-2">Focus Areas</h4>
        <Select onValueChange={(value) => console.log(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select focus areas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technical">Technical Skills</SelectItem>
            <SelectItem value="leadership">Leadership</SelectItem>
            <SelectItem value="business">Business Development</SelectItem>
            <SelectItem value="innovation">Innovation & Research</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h4 className="font-medium mb-2">Expected Duration</h4>
        <Select onValueChange={(value) => console.log(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 months</SelectItem>
            <SelectItem value="6">6 months</SelectItem>
            <SelectItem value="12">1 year</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h4 className="font-medium mb-2">Program Goals</h4>
        <Textarea 
          placeholder="Enter the key goals and milestones..."
          rows={4}
        />
      </div>
    </div>
  );

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
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Veteran Mentorship Requests
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-300">
              {requests.length} total requests
            </span>
            <Star className="h-4 w-4 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-gray-100 dark:bg-gray-800">
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'].map(status => (
              <button
                key={status}
                onClick={() => setSelectedFilter(status as MentorshipRequestStatus | 'ALL')}
                className={`px-3 py-1 rounded-full text-xs transition-colors duration-200 ${
                  selectedFilter === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {status === 'ALL' ? 'All Requests' : status}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 ml-0 md:ml-6">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Type:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'STUDENT', 'PROFESSIONAL'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type as RequestType)}
                className={`px-3 py-1 rounded-full text-xs transition-colors duration-200 ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {type === 'ALL' ? 'All Types' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Request List */}
      {filteredRequests.length === 0 ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p>No mentorship requests {selectedFilter !== 'ALL' && `with status ${selectedFilter}`}</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {/* Request List Items */}
          {filteredRequests.map(request => (
            <div 
              key={request.id} 
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
              onClick={() => setSelectedRequest(request)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {/* Mentee Image/Avatar */}
                  <div className="relative">
                    {request.mentee?.profileImage ? (
                      <Image 
                        src={request.mentee.profileImage} 
                        alt={request.mentee.name || 'Mentee'} 
                        width={48} 
                        height={48} 
                        className="rounded-full" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium">
                        {request.mentee?.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1">
                      {renderRequestIcon(request.mentee?.role || '')}
                    </div>
                  </div>

                  {/* Mentee Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {request.mentee?.name}
                      </h4>
                      <span className="text-xs text-gray-500">
                        • {renderExperienceLevel(request.mentee?.experience || 0)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-1">
                      {request.mentee?.role} • {request.mentee?.country}
                    </p>
                    
                    {/* Expertise Tags */}
                    {request.mentee?.expertise && request.mentee.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {request.mentee.expertise.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {request.mentee.expertise.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                            +{request.mentee.expertise.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center space-x-3">
                  {renderRequestStatus(request.status)}
                  
                  {request.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(request);
                          setShowMentorshipPlan(true);
                        }}
                        className="bg-purple-100 text-purple-600 p-2 rounded-full hover:bg-purple-200 transition-colors"
                        title="Create Mentorship Plan"
                      >
                        <Award className="h-4 w-4" />
                      </button>
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

              {/* If request is delegated, show delegate info */}
              {request.delegatedTo && (
                <div className="mt-4 flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Users className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    Delegated to {request.delegatedTo.name}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Mentorship Plan Dialog */}
      <Dialog 
        open={showMentorshipPlan} 
        onOpenChange={() => setShowMentorshipPlan(false)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Mentorship Plan</DialogTitle>
            <DialogDescription>
              Design a customized mentorship program for {selectedRequest?.mentee?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium mb-2">Mentee Profile</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Experience:</span> {renderExperienceLevel(selectedRequest?.mentee?.experience || 0)}</p>
                <p><span className="font-medium">Current Role:</span> {selectedRequest?.mentee?.role}</p>
                <p><span className="font-medium">Focus Areas:</span> {selectedRequest?.mentee?.expertise?.join(', ')}</p>
              </div>
            </div>

            {/* Mentorship Plan Form */}
            {renderMentorshipPlanForm()}

            {/* Delegation Option */}
            <div className="mt-6">
              <h4 className="font-medium mb-2">Program Lead</h4>
              <Select onValueChange={(value) => console.log(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select program lead" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Lead personally</SelectItem>
                  {potentialMentors.map(mentor => (
                    <SelectItem key={mentor.id} value={mentor.id}>
                      Delegate to {mentor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowMentorshipPlan(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle mentorship plan creation and acceptance
                  handleRequestAction(
                    selectedRequest?.id || '',
                    'ACCEPT',
                    {
                      // Add mentorship plan details here
                    }
                  );
                }}
              >
                Create Plan & Accept
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Details Dialog */}
      <Dialog 
        open={!!selectedRequest && !showMentorshipPlan} 
        onOpenChange={() => setSelectedRequest(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Mentorship Request Details</DialogTitle>
            <DialogDescription>
              Review detailed information about this mentorship request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Mentee Profile */}
              <div className="flex items-center space-x-4">
                {selectedRequest.mentee?.profileImage ? (
                  <Image 
                    src={selectedRequest.mentee.profileImage} 
                    alt={selectedRequest.mentee.name || 'Mentee'} 
                    width={64} 
                    height={64} 
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
                  <p className="text-sm text-gray-500">
                    {renderExperienceLevel(selectedRequest.mentee?.experience || 0)} experience
                  </p>
                </div>
              </div>

              {/* Request Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Request Status</span>
                  {renderRequestStatus(selectedRequest.status)}
                </div>
                
                <div>
                  <span className="font-medium block mb-1">Request Message</span>
                  <p className="text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    {selectedRequest.message || 'No message provided'}
                  </p>
                </div>

                {selectedRequest.mentorshipPlan && (
                  <div>
                    <span className="font-medium block mb-1">Mentorship Plan</span>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                      <p className="text-sm"><span className="font-medium">Focus Areas:</span> {selectedRequest.mentorshipPlan.focusAreas.join(', ')}</p>
                      <p className="text-sm"><span className="font-medium">Duration:</span> {selectedRequest.mentorshipPlan.expectedDuration}</p>
                      <div className="text-sm">
                        <span className="font-medium">Milestones:</span>
                        <ul className="list-disc list-inside mt-1">
                          {selectedRequest.mentorshipPlan.milestones.map((milestone, index) => (
                            <li key={index}>{milestone}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {selectedRequest.status === 'PENDING' && (
                <div className="flex space-x-4 mt-6">
                  <Button 
                    className="flex-1"
                    onClick={() => setShowMentorshipPlan(true)}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Create Plan
                  </Button>
                  <Button 
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleRequestAction(selectedRequest.id, 'REJECT')}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Decline Request
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