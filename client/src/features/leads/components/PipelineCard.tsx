import type { Ref } from "react";
import { Filter } from "lucide-react";
import type { LeadPipeline } from "../hooks/useLeadPipeline";
import type { Lead } from "../types";
import { LeadsTable } from "./LeadsTable";
import { PipelineFooter } from "./PipelineFooter";
import { PipelineToolbar } from "./PipelineToolbar";

type PipelineCardProps = {
  ref?: Ref<HTMLElement>;
  pipeline: LeadPipeline;
  onStatusChange: (status: string) => void;
  onCreateLead: () => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
};

export function PipelineCard({
  ref,
  pipeline,
  onStatusChange,
  onCreateLead,
  onEditLead,
  onDeleteLead,
}: PipelineCardProps) {
  return (
    <section className="pipeline-card" ref={ref}>
      <div className="section-heading">
        <div><h2>Lead pipeline</h2><p>Manage and track your sales opportunities.</p></div>
        <button className="secondary-button" onClick={pipeline.clearFilters}><Filter size={15} /> Clear filters</button>
      </div>
      <PipelineToolbar
        searchInput={pipeline.searchInput}
        statusFilter={pipeline.statusFilter}
        total={pipeline.total}
        onSearchInputChange={pipeline.setSearchInput}
        onSearchSubmit={pipeline.submitSearch}
        onSearchClear={pipeline.clearSearch}
        onStatusChange={onStatusChange}
      />
      {pipeline.error && <div className="inline-error page-error">{pipeline.error}<button onClick={() => void pipeline.reload()}>Retry</button></div>}
      <LeadsTable
        leads={pipeline.leads}
        loading={pipeline.loading}
        filtered={pipeline.hasActiveFilters}
        deletingId={pipeline.deletingId}
        onEdit={onEditLead}
        onDelete={onDeleteLead}
        onClearFilters={pipeline.clearFilters}
        onCreateLead={onCreateLead}
      />
      <PipelineFooter
        page={pipeline.page}
        totalPages={pipeline.totalPages}
        total={pipeline.total}
        loading={pipeline.loading}
        onPrevious={pipeline.goToPreviousPage}
        onNext={pipeline.goToNextPage}
      />
    </section>
  );
}
