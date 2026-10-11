import { apiRequest } from "../../lib/api";
import { LEADS_PAGE_SIZE } from "./constants";
import type {
  LeadListParams,
  LeadListResponse,
  LeadPayload,
  LeadResponse,
  LeadStatsResponse,
} from "./types";

export function fetchLeads(
  token: string,
  { page, search, status }: LeadListParams,
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(LEADS_PAGE_SIZE),
  });
  if (search) params.set("q", search);
  if (status) params.set("status", status);

  return apiRequest<LeadListResponse>(`/leads?${params.toString()}`, { token });
}

export function fetchLeadStats(token: string) {
  return apiRequest<LeadStatsResponse>("/leads/stats", { token });
}

export function createLead(token: string, body: LeadPayload) {
  return apiRequest<LeadResponse>("/leads", {
    method: "POST",
    token,
    body,
  });
}

export function updateLead(token: string, leadId: string, body: LeadPayload) {
  return apiRequest<LeadResponse>(`/leads/${leadId}`, {
    method: "PATCH",
    token,
    body,
  });
}

export function deleteLead(token: string, leadId: string) {
  return apiRequest<{ success: boolean }>(`/leads/${leadId}`, {
    method: "DELETE",
    token,
  });
}
