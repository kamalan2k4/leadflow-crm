import { Router } from "express";
import mongoose from "mongoose";
import { z } from "zod";

import { LeadModel, LEAD_STATUSES } from "../models/Lead";
import { authenticate } from "../middleware/authenticate";
import { AppError } from "../middleware/errorHandler";

export const leadsRouter = Router();

// Every endpoint in this router requires authentication.
leadsRouter.use(authenticate);

const leadFields = {
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254).optional(),
  phone: z.string().trim().max(30).optional(),
  company: z.string().trim().max(120).optional(),
  source: z
    .enum(["Website", "Referral", "LinkedIn", "Cold Call", "Other"])
    .default("Other"),
  status: z.enum(LEAD_STATUSES).default("New"),
  notes: z.string().trim().max(2000).optional(),
};

const createLeadSchema = z.object(leadFields);

const updateLeadSchema = z
  .object({
    name: leadFields.name.optional(),
    email: leadFields.email,
    phone: leadFields.phone,
    company: leadFields.company,
    source: z
      .enum(["Website", "Referral", "LinkedIn", "Cold Call", "Other"])
      .optional(),
    status: z.enum(LEAD_STATUSES).optional(),
    notes: leadFields.notes,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

const listQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

function getUserId(req: import("express").Request): string {
  if (!req.user?.id) {
    throw new AppError(401, "Authentication required");
  }

  return req.user.id;
}

function validateLeadId(id: string): void {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(400, "Invalid lead ID");
  }
}

// GET /api/leads?q=acme&status=Qualified&page=1&limit=10
leadsRouter.get("/", async (req, res) => {
  const userId = getUserId(req);
  const parsed = listQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  const { q, status, page, limit } = parsed.data;
  const filter: Record<string, unknown> = { owner: userId };

  if (status) {
    filter.status = status;
  }

  if (q) {
    const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(escapedQuery, "i");

    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { company: searchRegex },
      { phone: searchRegex },
    ];
  }

  const [leads, total] = await Promise.all([
    LeadModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    LeadModel.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: leads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// POST /api/leads
leadsRouter.post("/", async (req, res) => {
  const parsed = createLeadSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  const lead = await LeadModel.create({
    ...parsed.data,
    owner: getUserId(req),
  });

  res.status(201).json({
    success: true,
    message: "Lead created successfully",
    data: lead,
  });
});

// GET /api/leads/stats
// Returns pipeline totals across all leads owned by the authenticated user.
leadsRouter.get("/stats", async (req, res) => {
  const userId = getUserId(req);

  const counts = await LeadModel.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
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

  res.status(200).json({
    success: true,
    data: {
      total,
      new: byStatus.New ?? 0,
      contacted: byStatus.Contacted ?? 0,
      qualified: byStatus.Qualified ?? 0,
      proposal: byStatus.Proposal ?? 0,
      won: byStatus.Won ?? 0,
      lost: byStatus.Lost ?? 0,
    },
  });
});

// GET /api/leads/:id
leadsRouter.get("/:id", async (req, res) => {
  const userId = getUserId(req);
  const leadId = req.params.id;
  validateLeadId(leadId);

  const lead = await LeadModel.findOne({
    _id: leadId,
    owner: userId,
  });

  if (!lead) {
    throw new AppError(404, "Lead not found");
  }

  res.status(200).json({ success: true, data: lead });
});

// PATCH /api/leads/:id
leadsRouter.patch("/:id", async (req, res) => {
  const userId = getUserId(req);
  const leadId = req.params.id;
  validateLeadId(leadId);

  const parsed = updateLeadSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  const lead = await LeadModel.findOneAndUpdate(
    { _id: leadId, owner: userId },
    { $set: parsed.data },
    { new: true, runValidators: true },
  );

  if (!lead) {
    throw new AppError(404, "Lead not found");
  }

  res.status(200).json({
    success: true,
    message: "Lead updated successfully",
    data: lead,
  });
});

// DELETE /api/leads/:id
leadsRouter.delete("/:id", async (req, res) => {
  const userId = getUserId(req);
  const leadId = req.params.id;
  validateLeadId(leadId);

  const lead = await LeadModel.findOneAndDelete({
    _id: leadId,
    owner: userId,
  });

  if (!lead) {
    throw new AppError(404, "Lead not found");
  }

  res.status(200).json({
    success: true,
    message: "Lead deleted successfully",
  });
});