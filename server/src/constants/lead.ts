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
