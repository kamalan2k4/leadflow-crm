import { Building2, Pencil, Trash2 } from "lucide-react";
import { formatDate, initials } from "../../../utils/format";
import { STATUS_COLORS } from "../constants";
import type { Lead } from "../types";

type LeadRowProps = {
  lead: Lead;
  deleting: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
};

export function LeadRow({ lead, deleting, onEdit, onDelete }: LeadRowProps) {
  const color = STATUS_COLORS[lead.status];

  return (
    <tr>
      <td>
        <div className="lead-person">
          <div className={`lead-avatar avatar-${color}`}>{initials(lead.name)}</div>
          <div className="lead-person-info"><strong>{lead.name}</strong><span>{lead.email || lead.phone || "No contact details"}</span></div>
        </div>
      </td>
      <td><div className="company-cell">{lead.company ? <><span className="company-icon"><Building2 size={15} /></span>{lead.company}</> : <span className="muted-cell">—</span>}</div></td>
      <td><span className="source-label">{lead.source}</span></td>
      <td><span className={`status-pill ${color}`}><span />{lead.status}</span></td>
      <td><span className="date-cell">{formatDate(lead.createdAt)}</span></td>
      <td>
        <div className="row-actions">
          <button className="icon-button" title="Edit lead" onClick={() => onEdit(lead)}><Pencil size={15} /></button>
          <button className="icon-button delete-action" title="Delete lead" disabled={deleting} onClick={() => onDelete(lead)}><Trash2 size={15} /></button>
        </div>
      </td>
    </tr>
  );
}
