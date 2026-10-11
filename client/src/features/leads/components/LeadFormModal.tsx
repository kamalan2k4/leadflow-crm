import { ArrowUpRight } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { LEAD_SOURCES, LEAD_STATUSES, NOTES_MAX_LENGTH } from "../constants";
import type { LeadEditor } from "../hooks/useLeadEditor";
import type { LeadSource, LeadStatus } from "../types";

type LeadFormModalProps = {
  editor: LeadEditor;
};

export function LeadFormModal({ editor }: LeadFormModalProps) {
  const { form, updateField } = editor;
  const isEditing = Boolean(editor.editingLead);

  return (
    <Modal
      titleId="lead-modal-title"
      eyebrow="LEAD MANAGEMENT"
      title={isEditing ? "Edit lead" : "Add a new lead"}
      description={isEditing ? "Update the details of this opportunity." : "Add a prospect to your sales pipeline."}
      onClose={editor.close}
    >
      {editor.error && <div className="inline-error">{editor.error}</div>}
      <form onSubmit={editor.submit}>
        <div className="form-grid">
          <label className="field-label span-two">Full name <span className="required">*</span>
            <input autoFocus required minLength={2} maxLength={100} value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g. Priya Sharma" />
          </label>
          <label className="field-label">Email address
            <input type="email" maxLength={254} value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="priya@company.com" />
          </label>
          <label className="field-label">Phone number
            <input maxLength={30} value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+91 98765 43210" />
          </label>
          <label className="field-label span-two">Company
            <input maxLength={120} value={form.company} onChange={(e) => updateField("company", e.target.value)} placeholder="Company or organization" />
          </label>
          <label className="field-label">Lead source
            <select value={form.source} onChange={(e) => updateField("source", e.target.value as LeadSource)}>
              {LEAD_SOURCES.map((source) => <option key={source}>{source}</option>)}
            </select>
          </label>
          <label className="field-label">Pipeline status
            <select value={form.status} onChange={(e) => updateField("status", e.target.value as LeadStatus)}>
              {LEAD_STATUSES.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className="field-label span-two">Notes
            <textarea rows={3} maxLength={NOTES_MAX_LENGTH} value={form.notes} onChange={(e) => updateField("notes", e.target.value)} placeholder="Add context, next steps, or follow-up notes…" />
            <small>{form.notes.length}/{NOTES_MAX_LENGTH} characters</small>
          </label>
        </div>
        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={editor.close}>Cancel</button>
          <button type="submit" className="primary-button" disabled={editor.saving}>{editor.saving ? "Saving…" : <>{isEditing ? "Save changes" : "Create lead"} <ArrowUpRight size={16} /></>}</button>
        </div>
      </form>
    </Modal>
  );
}
