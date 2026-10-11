import { Plus, Users } from "lucide-react";

type LeadsEmptyStateProps = {
  filtered: boolean;
  onClearFilters: () => void;
  onCreateLead: () => void;
};

export function LeadsEmptyState({ filtered, onClearFilters, onCreateLead }: LeadsEmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Users size={24} /></div>
      <strong>{filtered ? "No leads match your filters" : "Your pipeline starts here"}</strong>
      <p>{filtered ? "Try changing your search or clearing the filters." : "Add your first lead to start tracking sales opportunities."}</p>
      {filtered ? <button className="secondary-button" onClick={onClearFilters}>Clear filters</button> : <button className="primary-button" onClick={onCreateLead}><Plus size={16} /> Create your first lead</button>}
    </div>
  );
}
