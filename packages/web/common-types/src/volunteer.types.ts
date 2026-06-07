import { IUser } from "./user.types";
import { IProject } from "./project.types";

export type VolunteerStatus = "pending" | "approved" | "rejected" | "active" | "completed" | "withdrawn" | "suspended";
export type DayOfWeek = "saturday" | "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
export type TimeSlot = "morning" | "afternoon" | "evening";

export interface IAvailability {
  days: DayOfWeek[];
  timeSlots: TimeSlot[];
}

export interface IVolunteerRegistration {
  _id: string;
  project: IProject | string;
  volunteer: IUser | string; // Required - must be logged in

  // Volunteer Information
  skills: string[];
  availableHours: number; // Hours per week
  preferredRole?: string;
  experience?: string;
  motivation?: string;
  availability: IAvailability;

  // Status & Review
  status: VolunteerStatus;
  reviewedBy?: IUser | string;
  reviewedAt?: Date;
  reviewNotes?: string;
  rejectionReason?: string;

  // Activity Tracking
  hoursContributed: number;
  tasksCompleted: number;
  lastActivity?: Date;
  contributionScore: number; // For gamification

  // Certificate
  certificateUrl?: string;
  certificateGenerated: boolean;
  certificateGeneratedAt?: Date;

  // Additional
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
  withdrawnAt?: Date;
}

export interface IVolunteerRole {
  title: string;
  description: string;
  requiredSkills: string[];
  estimatedHours: number;
  maxVolunteers: number;
  currentVolunteers: number;
}

export interface IRegisterVolunteerDTO {
  projectId: string;
  skills: string[];
  availableHours: number;
  preferredRole?: string;
  experience?: string;
  motivation?: string;
  availability: IAvailability;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface IUpdateVolunteerDTO {
  status?: VolunteerStatus;
  reviewNotes?: string;
  rejectionReason?: string;
  hoursContributed?: number;
  tasksCompleted?: number;
}
