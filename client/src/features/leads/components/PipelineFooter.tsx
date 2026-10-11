import { ChevronLeft, ChevronRight } from "lucide-react";
import { LEADS_PAGE_SIZE } from "../constants";

type PipelineFooterProps = {
  page: number;
  totalPages: number;
  total: number;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function PipelineFooter({
  page,
  totalPages,
  total,
  loading,
  onPrevious,
  onNext,
}: PipelineFooterProps) {
  const firstShown = total === 0 ? 0 : (page - 1) * LEADS_PAGE_SIZE + 1;
  const lastShown = Math.min(page * LEADS_PAGE_SIZE, total);

  return (
    <div className="table-footer">
      <span>Showing {firstShown}–{lastShown} of {total} leads</span>
      <div className="pagination">
        <button className="icon-button" disabled={page <= 1 || loading} onClick={onPrevious} aria-label="Previous page"><ChevronLeft size={17} /></button>
        <span>Page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
        <button className="icon-button" disabled={page >= totalPages || loading} onClick={onNext} aria-label="Next page"><ChevronRight size={17} /></button>
      </div>
    </div>
  );
}
