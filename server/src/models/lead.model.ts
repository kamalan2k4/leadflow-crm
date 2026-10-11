import { Schema, model, Types } from "mongoose";
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  type LeadStatus,
} from "../constants/lead";

export interface Lead {
  owner: Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: string;
  status: LeadStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<Lead>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },
    company: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    source: {
      type: String,
      enum: LEAD_SOURCES,
      default: "Other",
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: "New",
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: true },
);

leadSchema.index({ owner: 1, createdAt: -1 });
leadSchema.index({ owner: 1, status: 1, createdAt: -1 });

export const LeadModel = model<Lead>("Lead", leadSchema);