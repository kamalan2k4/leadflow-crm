import { Router } from "express";
import * as leadController from "../controllers/lead.controller";
import { authenticate } from "../middleware/authenticate";

export const leadsRouter = Router();

// Every endpoint in this router requires authentication.
leadsRouter.use(authenticate);

leadsRouter.get("/", leadController.listLeads);
leadsRouter.post("/", leadController.createLead);
// Registered before "/:id" so "stats" is not treated as a lead ID.
leadsRouter.get("/stats", leadController.getLeadStats);
leadsRouter.get("/:id", leadController.getLead);
leadsRouter.patch("/:id", leadController.updateLead);
leadsRouter.delete("/:id", leadController.deleteLead);
