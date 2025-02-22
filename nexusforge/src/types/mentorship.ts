// src/types/mentorship.ts
import { User } from '@/types';

export type MentorAvailability = 'AVAILABLE' | 'UNAVAILABLE' | 'LIMITED';
export type Country = 'NIGERIA' | 'UNITED_STATES' | 'OTHER';
export type MentorshipRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
export type MentorshipStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface MentorshipRequest {
  id: string;
  menteeId: string;
  mentorId: string;
  status: MentorshipRequestStatus;
  message?: string | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  mentee?: User;
  mentor?: User;
}

export interface MentorPreview {
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

export interface Mentorship {
  id: string;
  status: MentorshipStatus;
  startDate?: Date | null;
  nextSession?: Date | null;
  sessionNotes?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  mentorId: string;
  menteeId: string;
  
  // Relations
  mentor?: User;
  mentee?: User;
}

export interface MentorshipPreferences {
  availableHours?: {
    monday?: string[];
    tuesday?: string[];
    wednesday?: string[];
    thursday?: string[];
    friday?: string[];
    saturday?: string[];
    sunday?: string[];
  };
  preferredTopics?: string[];
  experienceLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  maxMentees?: number;
  sessionDuration?: number; // in minutes
  communicationPreference?: 'VIDEO' | 'CHAT' | 'IN_PERSON' | 'MIXED';
  country?: Country;
  languages?: string[];
  notes?: string;
}

export interface MentorSearchFilters {
  country?: Country;
  expertise?: string[];
  experienceYears?: number;
  availability?: MentorAvailability;
  preferredTopics?: string[];
  communicationPreference?: string;
}

export interface MentorshipSession {
  id: string;
  mentorshipId: string;
  scheduledFor: Date;
  duration: number; // in minutes
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'MISSED';
  notes?: string;
  topics?: string[];
  resources?: string[];
  feedback?: {
    mentorRating?: number;
    menteeRating?: number;
    mentorFeedback?: string;
    menteeFeedback?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}