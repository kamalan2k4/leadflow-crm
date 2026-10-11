import { useState } from "react";
import type { FormEvent } from "react";
import { getErrorMessage } from "../../../utils/errors";
import * as leadsApi from "../api";
import { EMPTY_LEAD_FORM, toLeadFormValues, toLeadPayload } from "../leadForm";
import type { Lead, LeadFormValues } from "../types";

export type LeadSaveKind = "created" | "updated";

type UseLeadEditorOptions = {
  token: string;
  onSaved: (kind: LeadSaveKind) => void;
};

export function useLeadEditor({ token, onSaved }: UseLeadEditorOptions) {
  const [open, setOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [form, setForm] = useState<LeadFormValues>(EMPTY_LEAD_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditingLead(null);
    setForm(EMPTY_LEAD_FORM);
    setError("");
    setOpen(true);
  }

  function openEdit(lead: Lead) {
    setEditingLead(lead);
    setForm(toLeadFormValues(lead));
    setError("");
    setOpen(true);
  }

  function close() {
    setOpen(false);
  }

  function updateField<Field extends keyof LeadFormValues>(
    field: Field,
    value: LeadFormValues[Field],
  ) {
    setForm({ ...form, [field]: value });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = toLeadPayload(form);
    try {
      if (editingLead) {
        await leadsApi.updateLead(token, editingLead._id, payload);
      } else {
        await leadsApi.createLead(token, payload);
      }
      setOpen(false);
      onSaved(editingLead ? "updated" : "created");
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setSaving(false);
    }
  }

  return {
    open,
    editingLead,
    form,
    error,
    saving,
    openCreate,
    openEdit,
    close,
    updateField,
    submit,
  };
}

export type LeadEditor = ReturnType<typeof useLeadEditor>;
