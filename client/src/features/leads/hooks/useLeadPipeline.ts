import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../../../utils/errors";
import * as leadsApi from "../api";
import { EMPTY_LEAD_STATS } from "../constants";
import type { Lead, LeadStats, LeadStatus } from "../types";

export function useLeadPipeline(token: string) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<LeadStats>(EMPTY_LEAD_STATS);
  const [deletingId, setDeletingId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // The pipeline belongs to one session: start clean whenever the token changes.
  const [sessionToken, setSessionToken] = useState(token);
  if (sessionToken !== token) {
    setSessionToken(token);
    setLeads([]);
    setTotal(0);
    setTotalPages(1);
    setPage(1);
    setSearchInput("");
    setSearch("");
    setStatusFilter("");
    setStats(EMPTY_LEAD_STATS);
    setRefreshKey(0);
  }

  const loadLeads = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const result = await leadsApi.fetchLeads(token, {
        page,
        search,
        status: statusFilter,
      });
      setLeads(result.data);
      setTotal(result.pagination.total);
      setTotalPages(Math.max(1, result.pagination.totalPages));
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [token, page, search, statusFilter]);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads, refreshKey]);

  const loadStats = useCallback(async () => {
    if (!token) return;

    try {
      const result = await leadsApi.fetchLeadStats(token);
      setStats(result.data);
    } catch (caught) {
      setError(getErrorMessage(caught));
    }
  }, [token]);

  useEffect(() => {
    void loadStats();
  }, [loadStats, refreshKey]);

  // Re-fetches both the current page and the dashboard totals.
  function refresh() {
    setRefreshKey((current) => current + 1);
  }

  function submitSearch() {
    setPage(1);
    setSearch(searchInput.trim());
  }

  function clearSearch() {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setSearchInput("");
    setStatusFilter("");
    setPage(1);
  }

  function filterByStatus(status: string) {
    setStatusFilter(status);
    setPage(1);
  }

  function toggleStatus(status: LeadStatus) {
    setStatusFilter((current) => (current === status ? "" : status));
    setPage(1);
  }

  function goToPreviousPage() {
    setPage((current) => current - 1);
  }

  function goToNextPage() {
    setPage((current) => current + 1);
  }

  // Resolves to true when the lead was deleted.
  async function removeLead(lead: Lead) {
    setDeletingId(lead._id);
    setError("");
    try {
      await leadsApi.deleteLead(token, lead._id);
      // Step back when the last lead on a page is removed.
      if (leads.length === 1 && page > 1) {
        setPage((current) => current - 1);
      }
      refresh();
      return true;
    } catch (caught) {
      setError(getErrorMessage(caught));
      return false;
    } finally {
      setDeletingId("");
    }
  }

  return {
    leads,
    total,
    totalPages,
    page,
    searchInput,
    search,
    statusFilter,
    hasActiveFilters: Boolean(search || statusFilter),
    loading,
    error,
    stats,
    deletingId,
    setSearchInput,
    reload: loadLeads,
    refresh,
    submitSearch,
    clearSearch,
    clearFilters,
    filterByStatus,
    toggleStatus,
    goToPreviousPage,
    goToNextPage,
    removeLead,
  };
}

export type LeadPipeline = ReturnType<typeof useLeadPipeline>;
