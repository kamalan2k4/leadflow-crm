import mongoose from "mongoose";
import { AppError } from "../errors";
import { LeadModel } from "../models/lead.model";
import { escapeRegex } from "../utils/regex";
import type {
  CreateLeadInput,
  ListLeadsQuery,
  UpdateLeadInput,
} from "../validators/lead.validator";

const SEARCHABLE_FIELDS = ["name", "email", "company", "phone"] as const;

function leadNotFound(): AppError {
  return new AppError(404, "Lead not found");
}

function buildListFilter(
  ownerId: string,
  { q, status }: Pick<ListLeadsQuery, "q" | "status">,
): Record<string, unknown> {
  const filter: Record<string, unknown> = { owner: ownerId };

  if (status) {
    filter.status = status;
  }

  if (q) {
    const searchRegex = new RegExp(escapeRegex(q), "i");

    filter.$or = SEARCHABLE_FIELDS.map((field) => ({ [field]: searchRegex }));
  }

  return filter;
}

export async function listLeads(ownerId: string, query: ListLeadsQuery) {
  const { page, limit } = query;
  const filter = buildListFilter(ownerId, query);

  const [leads, total] = await Promise.all([
    LeadModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    LeadModel.countDocuments(filter),
  ]);

  return {
    leads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function createLead(ownerId: string, input: CreateLeadInput) {
  return LeadModel.create({
    ...input,
    owner: ownerId,
  });
}

// Pipeline totals across all leads owned by the given user.
export async function getLeadStats(ownerId: string) {
  const counts = await LeadModel.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(ownerId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const byStatus: Record<string, number> = {};

  for (const item of counts) {
    byStatus[item._id] = item.count;
  }

  const total = Object.values(byStatus).reduce(
    (sum, count) => sum + count,
    0,
  );

  return {
    total,
    new: byStatus.New ?? 0,
    contacted: byStatus.Contacted ?? 0,
    qualified: byStatus.Qualified ?? 0,
    proposal: byStatus.Proposal ?? 0,
    won: byStatus.Won ?? 0,
    lost: byStatus.Lost ?? 0,
  };
}

export async function getLead(ownerId: string, leadId: string) {
  const lead = await LeadModel.findOne({
    _id: leadId,
    owner: ownerId,
  });

  if (!lead) {
    throw leadNotFound();
  }

  return lead;
}

export async function updateLead(
  ownerId: string,
  leadId: string,
  input: UpdateLeadInput,
) {
  const lead = await LeadModel.findOneAndUpdate(
    { _id: leadId, owner: ownerId },
    { $set: input },
    { new: true, runValidators: true },
  );

  if (!lead) {
    throw leadNotFound();
  }

  return lead;
}

export async function deleteLead(ownerId: string, leadId: string) {
  const lead = await LeadModel.findOneAndDelete({
    _id: leadId,
    owner: ownerId,
  });

  if (!lead) {
    throw leadNotFound();
  }
}
