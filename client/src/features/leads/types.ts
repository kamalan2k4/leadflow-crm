import type { LeadSource, LeadStatus } from "./constants";

export type { LeadSource, LeadStatus };

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

export type LeadStats = {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  proposal: number;
  won: number;
  lost: number;
};

export interface LeadStatsResponse {
  success: boolean;
  data: LeadStats;
}

export type LeadFormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  status: LeadStatus;
  notes: string;
};

export type LeadPayload = {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  notes?: string;
};

export type LeadListParams = {
  page: number;
  search: string;
  status: string;
};
