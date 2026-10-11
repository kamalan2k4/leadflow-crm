import type { Lead } from "../types";
import { LeadRow } from "./LeadRow";
import { LeadsEmptyState } from "./LeadsEmptyState";

const COLUMN_COUNT = 6;

type LeadsTableProps = {
  leads: Lead[];
  loading: boolean;
  filtered: boolean;
  deletingId: string;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onClearFilters: () => void;
  onCreateLead: () => void;
};

export function LeadsTable({
  leads,
  loading,
  filtered,
  deletingId,
  onEdit,
  onDelete,
  onClearFilters,
  onCreateLead,
}: LeadsTableProps) {
  return (
    <div className="table-wrap">
      <table className="leads-table">
        <thead>
          <tr>
            <th>LEAD / CONTACT</th>
            <th>COMPANY</th>
            <th>SOURCE</th>
            <th>STATUS</th>
            <th>CREATED</th>
            <th><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={COLUMN_COUNT}><div className="table-state"><span className="spinner" /> Loading leads…</div></td></tr>
          ) : leads.length === 0 ? (
            <tr><td colSpan={COLUMN_COUNT}><LeadsEmptyState filtered={filtered} onClearFilters={onClearFilters} onCreateLead={onCreateLead} /></td></tr>
          ) : leads.map((lead) => (
            <LeadRow key={lead._id} lead={lead} deleting={deletingId === lead._id} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
