import type { FormEvent } from "react";
import { Filter, Search, X } from "lucide-react";
import { LEAD_STATUSES } from "../constants";

type PipelineToolbarProps = {
  searchInput: string;
  statusFilter: string;
  total: number;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSearchClear: () => void;
  onStatusChange: (status: string) => void;
};

export function PipelineToolbar({
  searchInput,
  statusFilter,
  total,
  onSearchInputChange,
  onSearchSubmit,
  onSearchClear,
  onStatusChange,
}: PipelineToolbarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearchSubmit();
  }

  return (
    <div className="table-toolbar">
      <form className="search-box" onSubmit={handleSubmit}>
        <Search size={17} />
        <input value={searchInput} onChange={(e) => onSearchInputChange(e.target.value)} placeholder="Search name, company, email…" aria-label="Search leads" />
        {searchInput && <button type="button" onClick={onSearchClear} aria-label="Clear search"><X size={15} /></button>}
      </form>
      <div className="toolbar-right">
        <label className="filter-select">
          <Filter size={15} />
          <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)} aria-label="Filter by status">
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
        <span className="results-count">{total} {total === 1 ? "lead" : "leads"}</span>
      </div>
    </div>
  );
}
