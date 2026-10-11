import type { LeadStats } from "./types";

export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
  "Won",
  "Lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_SOURCES = [
  "Website",
  "Referral",
  "LinkedIn",
  "Cold Call",
  "Other",
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];

export const STATUS_COLORS: Record<LeadStatus, string> = {
  New: "blue",
  Contacted: "violet",
  Qualified: "cyan",
  Proposal: "amber",
  Won: "green",
  Lost: "red",
};

export const LEADS_PAGE_SIZE = 10;

export const NOTES_MAX_LENGTH = 2000;

export const EMPTY_LEAD_STATS: LeadStats = {
  total: 0,
  new: 0,
  contacted: 0,
  qualified: 0,
  proposal: 0,
  won: 0,
  lost: 0,
};
