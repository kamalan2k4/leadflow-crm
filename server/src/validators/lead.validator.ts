import mongoose from "mongoose";
import { z } from "zod";
import { LEAD_SOURCES, LEAD_STATUSES } from "../constants/lead";
import { AppError } from "../errors";

const leadFields = {
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254).optional(),
  phone: z.string().trim().max(30).optional(),
  company: z.string().trim().max(120).optional(),
  source: z.enum(LEAD_SOURCES).default("Other"),
  status: z.enum(LEAD_STATUSES).default("New"),
  notes: z.string().trim().max(2000).optional(),
};

export const createLeadSchema = z.object(leadFields);

export const updateLeadSchema = z
  .object({
    name: leadFields.name.optional(),
    email: leadFields.email,
    phone: leadFields.phone,
    company: leadFields.company,
    source: z.enum(LEAD_SOURCES).optional(),
    status: z.enum(LEAD_STATUSES).optional(),
    notes: leadFields.notes,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export const listLeadsQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateLeadInput = z.output<typeof createLeadSchema>;
export type UpdateLeadInput = z.output<typeof updateLeadSchema>;
export type ListLeadsQuery = z.output<typeof listLeadsQuerySchema>;

export function assertValidLeadId(id: string): void {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(400, "Invalid lead ID");
  }
}
