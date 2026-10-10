export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
  "Won",
  "Lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type LeadSource =
  | "Website"
  | "Referral"
  | "LinkedIn"
  | "Cold Call"
  | "Other";

export interface Lead {
  _id: string;
  owner: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadListResponse {
  success: boolean;
  data: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LeadResponse {
  success: boolean;
  message?: string;
  data: Lead;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user: AuthUser;
}