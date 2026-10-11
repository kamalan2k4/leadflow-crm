import type { RequestHandler } from "express";
import * as leadService from "../services/lead.service";
import { getUserId } from "../utils/request";
import { parseOrThrow } from "../utils/validation";
import {
  assertValidLeadId,
  createLeadSchema,
  listLeadsQuerySchema,
  updateLeadSchema,
} from "../validators/lead.validator";

type LeadIdParams = { id: string };

// GET /api/leads?q=acme&status=Qualified&page=1&limit=10
export const listLeads: RequestHandler = async (req, res) => {
  const userId = getUserId(req);
  const query = parseOrThrow(
    listLeadsQuerySchema,
    req.query,
    "Invalid query parameters",
  );

  const { leads, pagination } = await leadService.listLeads(userId, query);

  res.status(200).json({
    success: true,
    data: leads,
    pagination,
  });
};

// POST /api/leads
export const createLead: RequestHandler = async (req, res) => {
  const input = parseOrThrow(createLeadSchema, req.body);
  const lead = await leadService.createLead(getUserId(req), input);

  res.status(201).json({
    success: true,
    message: "Lead created successfully",
    data: lead,
  });
};

// GET /api/leads/stats
export const getLeadStats: RequestHandler = async (req, res) => {
  const stats = await leadService.getLeadStats(getUserId(req));

  res.status(200).json({
    success: true,
    data: stats,
  });
};

// GET /api/leads/:id
export const getLead: RequestHandler<LeadIdParams> = async (req, res) => {
  const userId = getUserId(req);
  const leadId = req.params.id;
  assertValidLeadId(leadId);

  const lead = await leadService.getLead(userId, leadId);

  res.status(200).json({ success: true, data: lead });
};

// PATCH /api/leads/:id
export const updateLead: RequestHandler<LeadIdParams> = async (req, res) => {
  const userId = getUserId(req);
  const leadId = req.params.id;
  assertValidLeadId(leadId);

  const input = parseOrThrow(updateLeadSchema, req.body);
  const lead = await leadService.updateLead(userId, leadId, input);

  res.status(200).json({
    success: true,
    message: "Lead updated successfully",
    data: lead,
  });
};

// DELETE /api/leads/:id
export const deleteLead: RequestHandler<LeadIdParams> = async (req, res) => {
  const userId = getUserId(req);
  const leadId = req.params.id;
  assertValidLeadId(leadId);

  await leadService.deleteLead(userId, leadId);

  res.status(200).json({
    success: true,
    message: "Lead deleted successfully",
  });
};
