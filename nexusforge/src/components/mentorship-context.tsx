'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { 
  MentorshipRequest, 
  Mentorship, 
  MentorAvailability, 
  MentorshipPreferences 
} from '@/types/mentorship';

interface MentorshipContextType {
  // State
  activeMentorships: Mentorship[];
  sentRequests: MentorshipRequest[];
  receivedRequests: MentorshipRequest[];
  preferences: MentorshipPreferences | null;
  availability: MentorAvailability;
  isLoading: boolean;
  error: string | null;
  
  // Functionality
  sendMentorshipRequest: (mentorId: string, message: string) => Promise<boolean>;
  updateMentorshipRequest: (requestId: string, status: string, message?: string) => Promise<boolean>;
  updatePreferences: (newPreferences: MentorshipPreferences, newAvailability: MentorAvailability) => Promise<boolean>;
  scheduleSession: (mentorshipId: string, date: Date) => Promise<boolean>;
  refreshMentorshipData: () => Promise<void>;
}

const MentorshipContext = createContext<MentorshipContextType | undefined>(undefined);

export const MentorshipProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [activeMentorships, setActiveMentorships] = useState<Mentorship[]>([]);
  const [sentRequests, setSentRequests] = useState<MentorshipRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<MentorshipRequest[]>([]);
  const [preferences, setPreferences] = useState<MentorshipPreferences | null>(null);
  const [availability, setAvailability] = useState<MentorAvailability>('UNAVAILABLE');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      refreshMentorshipData();
    }
  }, [session]);

  const refreshMentorshipData = async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch user profile to get availability and preferences
      const userResponse = await fetch(`/api/users/${session.user.id}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setAvailability(userData.mentorshipAvailable || 'UNAVAILABLE');
        
        if (userData.mentorshipPreferences) {
          try {
            const parsedPreferences = typeof userData.mentorshipPreferences === 'string'
              ? JSON.parse(userData.mentorshipPreferences)
              : userData.mentorshipPreferences;
            
            setPreferences(parsedPreferences);
          } catch (err) {
            console.error('Failed to parse mentorship preferences:', err);
            setPreferences(null);
          }
        }
      }

      // Determine role for API calls
      const userRole = (session.user as User).role;
      const isMentor = userRole === 'PROFESSIONAL' || userRole === 'VETERAN';
      const isMentee = userRole === 'STUDENT';
      
      // Fetch active mentorships
      if (isMentor || isMentee) {
        const mentorshipsResponse = await fetch(
          `/api/mentorship?userId=${session.user.id}&role=${isMentor ? 'mentor' : 'mentee'}&status=ACTIVE`
        );
        
        if (mentorshipsResponse.ok) {
          const mentorshipsData = await mentorshipsResponse.json();
          setActiveMentorships(mentorshipsData);
        }
      }
      
      // Fetch sent requests (only for mentees/students)
      if (isMentee) {
        const sentRequestsResponse = await fetch(
          `/api/mentorship/requests?userId=${session.user.id}&role=mentee`
        );
        
        if (sentRequestsResponse.ok) {
          const sentRequestsData = await sentRequestsResponse.json();
          setSentRequests(sentRequestsData);
        }
      }
      
      // Fetch received requests (only for mentors)
      if (isMentor) {
        const receivedRequestsResponse = await fetch(
          `/api/mentorship/requests?userId=${session.user.id}&role=mentor`
        );
        
        if (receivedRequestsResponse.ok) {
          const receivedRequestsData = await receivedRequestsResponse.json();
          setReceivedRequests(receivedRequestsData);
        }
      }
    } catch (err) {
      setError('Failed to load mentorship data. Please try again later.');
      console.error('Error fetching mentorship data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMentorshipRequest = async (mentorId: string, message: string): Promise<boolean> => {
    if (!session?.user?.id) {
      setError('You must be logged in to send mentorship requests.');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/mentorship/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId,
          menteeId: session.user.id,
          message,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send mentorship request');
      }
      
      // Add the new request to the sent requests list
      const newRequest = await response.json();
      setSentRequests((prev) => [...prev, newRequest]);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send mentorship request');
      console.error('Error sending mentorship request:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMentorshipRequest = async (
    requestId: string,
    status: string,
    message?: string
  ): Promise<boolean> => {
    if (!session?.user?.id) {
      setError('You must be logged in to update mentorship requests.');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/mentorship/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          responseMessage: message,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update mentorship request');
      }
      
      // Update local state based on request type
      const updatedRequest = await response.json();
      const userRole = (session.user as User).role;
      
      if (userRole === 'STUDENT') {
        // Update sent requests for students
        setSentRequests((prev) =>
          prev.map((req) => (req.id === requestId ? updatedRequest : req))
        );
      } else {
        // Update received requests for mentors
        setReceivedRequests((prev) =>
          prev.map((req) => (req.id === requestId ? updatedRequest : req))
        );
        
        // If request was accepted, refresh mentorships
        if (status === 'ACCEPTED') {
          await refreshMentorshipData();
        }
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update mentorship request');
      console.error('Error updating mentorship request:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (
    newPreferences: MentorshipPreferences,
    newAvailability: MentorAvailability
  ): Promise<boolean> => {
    if (!session?.user?.id) {
      setError('You must be logged in to update mentorship preferences.');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${session.user.id}/mentorship-preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: newPreferences,
          availability: newAvailability,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update mentorship preferences');
      }
      
      // Update local state
      setPreferences(newPreferences);
      setAvailability(newAvailability);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update mentorship preferences');
      console.error('Error updating mentorship preferences:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleSession = async (mentorshipId: string, date: Date): Promise<boolean> => {
    if (!session?.user?.id) {
      setError('You must be logged in to schedule mentorship sessions.');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/mentorship/${mentorshipId}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nextSession: date.toISOString(),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to schedule mentorship session');
      }
      
      // Update the mentorship in local state
      const updatedMentorship = await response.json();
      setActiveMentorships((prev) =>
        prev.map((m) => (m.id === mentorshipId ? updatedMentorship : m))
      );
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule mentorship session');
      console.error('Error scheduling mentorship session:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    // State
    activeMentorships,
    sentRequests,
    receivedRequests,
    preferences,
    availability,
    isLoading,
    error,
    
    // Functionality
    sendMentorshipRequest,
    updateMentorshipRequest,
    updatePreferences,
    scheduleSession,
    refreshMentorshipData,
  };

  return <MentorshipContext.Provider value={value}>{children}</MentorshipContext.Provider>;
};

export const useMentorship = () => {
  const context = useContext(MentorshipContext);
  if (context === undefined) {
    throw new Error('useMentorship must be used within a MentorshipProvider');
  }
  return context;
};