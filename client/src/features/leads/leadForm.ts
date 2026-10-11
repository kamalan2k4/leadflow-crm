import type { Lead, LeadFormValues, LeadPayload } from "./types";

export const EMPTY_LEAD_FORM: LeadFormValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "Website",
  status: "New",
  notes: "",
};

export function toLeadFormValues(lead: Lead): LeadFormValues {
  return {
    name: lead.name,
    email: lead.email ?? "",
    phone: lead.phone ?? "",
    company: lead.company ?? "",
    source: lead.source,
    status: lead.status,
    notes: lead.notes ?? "",
  };
}

// Blank optional fields are omitted so the API never stores empty strings.
export function toLeadPayload(form: LeadFormValues): LeadPayload {
  return {
    name: form.name.trim(),
    ...(form.email.trim() ? { email: form.email.trim() } : {}),
    ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
    ...(form.company.trim() ? { company: form.company.trim() } : {}),
    source: form.source,
    status: form.status,
    ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
  };
}
