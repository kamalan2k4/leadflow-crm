
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Command,
  Filter,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Users,
  X,
  Pencil,
} from "lucide-react";
import { apiRequest } from "./lib/api";
import type {
  AuthResponse,
  AuthUser,
  Lead,
  LeadListResponse,
  LeadResponse,
  LeadSource,
  LeadStatus,
} from "./types/lead";
import { LEAD_STATUSES } from "./types/lead";
import "./App.css";
import "./LeadFlowFixes.css";
type AuthMode = "login" | "register";
type LeadStats = {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  proposal: number;
  won: number;
  lost: number;
};
const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "Website" as LeadSource,
  status: "New" as LeadStatus,
  notes: "",
};
const STATUS_COLORS: Record<LeadStatus, string> = {
  New: "blue",
  Contacted: "violet",
  Qualified: "cyan",
  Proposal: "amber",
  Won: "green",
  Lost: "red",
};
function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}
function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}
export default function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem("leadflow_token") ?? "",
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");
  const [leadStats, setLeadStats] = useState<LeadStats>({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal: 0,
    won: 0,
    lost: 0,
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeNav, setActiveNav] = useState<"overview" | "leads">("overview");
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [sidebarProfileMenuOpen, setSidebarProfileMenuOpen] = useState(false);
  const [topProfileMenuOpen, setTopProfileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [utilityDialog, setUtilityDialog] = useState<"settings" | "help" | null>(null);
  const pipelineRef = useRef<HTMLElement | null>(null);
  const pageContentRef = useRef<HTMLDivElement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const clearSession = useCallback(() => {
    localStorage.removeItem("leadflow_token");
    setToken("");
    setUser(null);
    setLeads([]);
    setTotal(0);
    setPage(1);
    setSearch("");
    setSearchInput("");
    setStatusFilter("");
    setTotalPages(1);
    setLeadStats({ total: 0, new: 0, contacted: 0, qualified: 0, proposal: 0, won: 0, lost: 0 });
    setRefreshKey(0);
    setAuthReady(true);
  }, []);
  useEffect(() => {
    if (!token) {
      setAuthReady(true);
      return;
    }
    let cancelled = false;
    apiRequest<{ success: boolean; user: AuthUser }>("/auth/me", { token })
      .then((result) => {
        if (!cancelled) setUser(result.user);
      })
      .catch(() => {
        if (!cancelled) clearSession();
      })
      .finally(() => {
        if (!cancelled) setAuthReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [token, clearSession]);
  const loadLeads = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setPageError("");
    const params = new URLSearchParams({
      page: String(page),
      limit: "10",
    });
    if (search) params.set("q", search);
    if (statusFilter) params.set("status", statusFilter);
    try {
      const result = await apiRequest<LeadListResponse>(
        `/leads?${params.toString()}`,
        { token },
      );
      setLeads(result.data);
      setTotal(result.pagination.total);
      setTotalPages(Math.max(1, result.pagination.totalPages));
    } catch (error) {
      setPageError(getErrorMessage(error));
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
      const result = await apiRequest<{ success: boolean; data: LeadStats }>(
        "/leads/stats",
        { token },
      );
      setLeadStats(result.data);
    } catch (error) {
      setPageError(getErrorMessage(error));
    }
  }, [token]);

  useEffect(() => {
    void loadStats();
  }, [loadStats, refreshKey]);

  const stats = [
    {
      label: "Total leads",
      value: leadStats.total,
      icon: Users,
      tone: "indigo",
      detail: "Across your pipeline",
    },
    {
      label: "Qualified",
      value: leadStats.qualified,
      icon: Target,
      tone: "cyan",
      detail: "Qualified opportunities",
    },
    {
      label: "Proposals",
      value: leadStats.proposal,
      icon: Activity,
      tone: "orange",
      detail: "In proposal stage",
    },
    {
      label: "Won deals",
      value: leadStats.won,
      icon: Check,
      tone: "green",
      detail: "Successfully converted",
    },
  ];

  async function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError("");
    try {
      if (authMode === "register") {
        await apiRequest<{ success: boolean; message: string }>(
          "/auth/register",
          {
            method: "POST",
            body: {
              name: authName,
              email: authEmail,
              password: authPassword,
            },
          },
        );
      }
      const result = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: {
          email: authEmail,
          password: authPassword,
        },
      });
      if (!result.token) {
        throw new Error("The server did not return an authentication token.");
      }
      localStorage.setItem("leadflow_token", result.token);
      setUser(result.user);
      setToken(result.token);
      setPage(1);
      setSearch("");
      setSearchInput("");
      setStatusFilter("");
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setAuthBusy(false);
    }
  }
  function openCreateModal() {
    setEditingLead(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  }
  function openEditModal(lead: Lead) {
    setEditingLead(lead);
    setForm({
      name: lead.name,
      email: lead.email ?? "",
      phone: lead.phone ?? "",
      company: lead.company ?? "",
      source: lead.source,
      status: lead.status,
      notes: lead.notes ?? "",
    });
    setFormError("");
    setModalOpen(true);
  }
  async function handleLeadSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    const body = {
      name: form.name.trim(),
      ...(form.email.trim() ? { email: form.email.trim() } : {}),
      ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
      ...(form.company.trim() ? { company: form.company.trim() } : {}),
      source: form.source,
      status: form.status,
      ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
    };
    try {
      if (editingLead) {
        await apiRequest<LeadResponse>(`/leads/${editingLead._id}`, {
          method: "PATCH",
          token,
          body,
        });
        setNotice("Lead updated successfully.");
      } else {
        await apiRequest<LeadResponse>("/leads", {
          method: "POST",
          token,
          body,
        });
        setNotice("Lead created successfully.");
        setPage(1);
      }
      setModalOpen(false);
      if (!editingLead) {
        setPage(1);
        setSearch("");
        setSearchInput("");
        setStatusFilter("");
      }
      setRefreshKey((current) => current + 1);
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete(lead: Lead) {
    const confirmed = window.confirm(
      `Delete ${lead.name}? This action cannot be undone.`,
    );
    if (!confirmed) return;
    setDeletingId(lead._id);
    setPageError("");
    try {
      await apiRequest<{ success: boolean }>(`/leads/${lead._id}`, {
        method: "DELETE",
        token,
      });
      setNotice("Lead deleted successfully.");
      if (leads.length === 1 && page > 1) {
        setPage((current) => current - 1);
      }
      setRefreshKey((current) => current + 1);
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setDeletingId("");
    }
  }
  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }
  function logout() {
    setSidebarProfileMenuOpen(false);
    setTopProfileMenuOpen(false);
    setWorkspaceMenuOpen(false);
    clearSession();
    setAuthError("");
    setNotice("");
  }

  function navigateTo(view: "overview" | "leads") {
    setActiveNav(view);
    setWorkspaceMenuOpen(false);
    if (view === "overview") {
      setSearch("");
      setSearchInput("");
      setStatusFilter("");
      setPage(1);
      pageContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.setTimeout(() => pipelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    }
  }

  function chooseStatus(status: LeadStatus) {
    setStatusFilter((current) => (current === status ? "" : status));
    setPage(1);
    setActiveNav("leads");
    window.setTimeout(() => pipelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  function clearFilters() {
    setSearch("");
    setSearchInput("");
    setStatusFilter("");
    setPage(1);
  }
  if (!authReady) {
    return (
      <div className="app-loading">
        <div className="loading-mark"><Command size={25} /></div>
        <span>Preparing your workspace…</span>
      </div>
    );
  }
  if (!token || !user) {
    return (
      <main className="auth-page">
        <section className="auth-story">
          <div className="brand brand-light">
            <div className="brand-symbol"><Command size={21} /></div>
            <span>leadflow<span className="brand-dot">.</span></span>
          </div>
          <div className="auth-story-copy">
            <span className="eyebrow"><Sparkles size={14} /> YOUR SALES WORKSPACE</span>
            <h1>Every relationship starts with a <span>lead.</span></h1>
            <p>Bring your pipeline into focus. Organize prospects, build momentum, and turn opportunities into lasting customer relationships.</p>
            <div className="story-metrics">
              <div><strong>01</strong><span>Capture</span></div>
              <div className="metric-divider" />
              <div><strong>02</strong><span>Qualify</span></div>
              <div className="metric-divider" />
              <div><strong>03</strong><span>Convert</span></div>
            </div>
          </div>
          <div className="auth-story-footer">A clearer view of every opportunity.</div>
        </section>
        <section className="auth-panel">
          <div className="auth-panel-top">
            <span>WELCOME TO LEADFLOW</span>
            <span className="secure-label"><ShieldCheck size={14} /> Secure workspace</span>
          </div>
          <form className="auth-card" onSubmit={handleAuthSubmit}>
            <div className="auth-heading">
              <div className="auth-icon"><Command size={22} /></div>
              <h2>{authMode === "login" ? "Welcome back" : "Create your account"}</h2>
              <p>{authMode === "login" ? "Enter your details to access your sales workspace." : "Set up your account and start managing your pipeline."}</p>
            </div>
            {authError && <div className="inline-error">{authError}</div>}
            {authMode === "register" && (
              <label className="field-label">
                Full name
                <input value={authName} onChange={(e) => setAuthName(e.target.value)} required minLength={2} maxLength={80} placeholder="Your name" autoComplete="name" />
              </label>
            )}
            <label className="field-label">
              Email address
              <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required maxLength={254} placeholder="you@company.com" autoComplete="email" />
            </label>
            <label className="field-label">
              Password
              <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required minLength={authMode === "register" ? 8 : 1} autoComplete={authMode === "login" ? "current-password" : "new-password"} placeholder={authMode === "login" ? "Enter your password" : "At least 8 characters"} />
              {authMode === "register" && <small>Use at least 8 characters.</small>}
            </label>
            <button className="primary-button auth-submit" disabled={authBusy}>
              {authBusy ? "Please wait…" : authMode === "login" ? "Sign in to workspace" : "Create account"}
              {!authBusy && <ArrowUpRight size={17} />}
            </button>
            <div className="auth-switch">
              {authMode === "login" ? "New to LeadFlow?" : "Already have an account?"}
              <button type="button" onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setAuthError(""); }}>
                {authMode === "login" ? "Create account" : "Sign in"}
              </button>
            </div>
          </form>
          <div className="auth-panel-footer"><ShieldCheck size={14} /> Your workspace is protected by secure authentication.</div>
        </section>
      </main>
    );
  }
  return (
    <div className="workspace">
      <aside className="sidebar">
        <button type="button" className="brand sidebar-brand brand-button" onClick={() => navigateTo("overview")} aria-label="LeadFlow home">
          <div className="brand-symbol"><Command size={20} /></div>
          <span>leadflow<span className="brand-dot">.</span></span>
        </button>
        <div className="lf-menu-wrap workspace-menu-wrap">
          <button
            type="button"
            className="workspace-switcher"
            aria-expanded={workspaceMenuOpen}
            onClick={() => setWorkspaceMenuOpen((open) => !open)}
          >
            <div className="workspace-avatar">LF</div>
            <div className="workspace-name"><strong>My workspace</strong><span>Personal CRM</span></div>
            <MoreHorizontal size={18} />
          </button>
          {workspaceMenuOpen && (
            <div className="lf-popover workspace-popover" role="menu">
              <span className="popover-eyebrow">CURRENT WORKSPACE</span>
              <strong>My workspace</strong>
              <span className="popover-muted">Personal CRM · {user.email}</span>
              <button type="button" onClick={() => navigateTo("overview")}>Go to overview</button>
              <button type="button" onClick={() => { setUtilityDialog("settings"); setWorkspaceMenuOpen(false); }}>Workspace settings</button>
            </div>
          )}
        </div>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="sidebar-nav">
          <button type="button" className={`nav-item ${activeNav === "overview" ? "active" : ""}`} onClick={() => navigateTo("overview")}><LayoutDashboard size={18} /> Overview</button>
          <button type="button" className={`nav-item ${activeNav === "leads" ? "active-subtle" : ""}`} onClick={() => navigateTo("leads")}><Users size={18} /> Leads <span className="nav-count">{leadStats.total}</span></button>
        </nav>
        <div className="nav-caption pipeline-caption">PIPELINE</div>
        <nav className="sidebar-nav">
          {LEAD_STATUSES.map((status) => (
            <button key={status} className={`nav-item ${statusFilter === status ? "active-subtle" : ""}`} onClick={() => chooseStatus(status)}>
              <span className={`nav-status-dot ${STATUS_COLORS[status]}`} />
              {status}
            </button>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-tip">
          <div className="tip-icon"><Sparkles size={17} /></div>
          <strong>Keep momentum</strong>
          <p>Follow up with your qualified leads to keep deals moving forward.</p>
          <button type="button" onClick={() => chooseStatus("Qualified")}>View qualified leads <ArrowUpRight size={14} /></button>
        </div>
        <div className="sidebar-bottom">
          <button type="button" className="nav-item" onClick={() => setUtilityDialog("settings")}><Settings size={18} /> Settings</button>
          <button type="button" className="nav-item" onClick={() => setUtilityDialog("help")}><CircleHelp size={18} /> Help & support</button>
          <div className="profile-row">
            <div className="lf-menu-wrap sidebar-profile-wrap">
              <button type="button" className="profile-avatar avatar-button" aria-label="Open account menu" aria-expanded={sidebarProfileMenuOpen} onClick={() => setSidebarProfileMenuOpen((open) => !open)}>{initials(user.name)}</button>
              {sidebarProfileMenuOpen && (
                <div className="lf-popover profile-popover sidebar-profile-popover" role="menu">
                  <strong>{user.name}</strong>
                  <span className="popover-muted">{user.email}</span>
                  <button type="button" onClick={() => { setUtilityDialog("settings"); setSidebarProfileMenuOpen(false); }}>Account settings</button>
                  <button type="button" className="popover-danger" onClick={logout}><LogOut size={14} /> Sign out</button>
                </div>
              )}
            </div>
            <div className="profile-info"><strong>{user.name}</strong><span>{user.email}</span></div>
            <button className="icon-button logout-button" title="Sign out" aria-label="Sign out" onClick={logout}><LogOut size={17} /></button>
          </div>
        </div>
      </aside>
      <main className="main-panel">
        <header className="topbar">
          <div className="breadcrumbs" aria-label="Breadcrumb"><span>Workspace</span><ChevronRight size={15} /><strong>{activeNav === "leads" ? "Leads" : "Overview"}</strong></div>
          <div className="topbar-actions">
            <div className="topbar-date">{new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(new Date())}</div>
            <div className="lf-menu-wrap topbar-menu-wrap">
              <button type="button" className="icon-button notification-button" title="Notifications" aria-label="Notifications" aria-expanded={notificationOpen} onClick={() => { setNotificationOpen((open) => !open); setTopProfileMenuOpen(false); }}><Bell size={18} /></button>
              {notificationOpen && <div className="lf-popover topbar-popover notification-popover"><strong>You’re all caught up</strong><span className="popover-muted">New lead and pipeline notifications will appear here.</span><button type="button" onClick={() => setNotificationOpen(false)}>Dismiss</button></div>}
            </div>
            <div className="lf-menu-wrap topbar-menu-wrap">
              <button type="button" className="topbar-avatar avatar-button" aria-label="Open profile menu" aria-expanded={topProfileMenuOpen} onClick={() => { setTopProfileMenuOpen((open) => !open); setNotificationOpen(false); }}>{initials(user.name)}</button>
              {topProfileMenuOpen && <div className="lf-popover topbar-popover profile-popover"><strong>{user.name}</strong><span className="popover-muted">{user.email}</span><button type="button" onClick={() => { setUtilityDialog("settings"); setTopProfileMenuOpen(false); }}>Account settings</button><button type="button" className="popover-danger" onClick={logout}><LogOut size={14} /> Sign out</button></div>}
            </div>
          </div>
        </header>
        <div className="page-content" ref={pageContentRef}>
          <section className="welcome-row">
            <div>
              <div className="eyebrow page-eyebrow"><span className="live-dot" /> YOUR SALES OVERVIEW</div>
              <h1>Good to see you, {user.name.split(" ")[0]} <span className="wave">✳</span></h1>
              <p>Here’s what’s happening with your pipeline today.</p>
            </div>
            <button className="primary-button" onClick={openCreateModal}><Plus size={18} /> Add new lead</button>
          </section>
          {notice && (
            <div className="success-banner"><Check size={16} /> {notice}<button onClick={() => setNotice("")} aria-label="Dismiss"><X size={15} /></button></div>
          )}
          <section className="stats-grid">
            {stats.map(({ label, value, icon: Icon, tone, detail }) => (
              <article className="stat-card" key={label}>
                <div className="stat-top"><span>{label}</span><span className={`stat-icon ${tone}`}><Icon size={18} /></span></div>
                <div className="stat-value-row"><strong>{value}</strong><span className="stat-trend"><ArrowUpRight size={14} /></span></div>
                <div className="stat-detail">{detail}</div>
              </article>
            ))}
          </section>
          <section className="pipeline-card" ref={pipelineRef}>
            <div className="section-heading">
              <div><h2>Lead pipeline</h2><p>Manage and track your sales opportunities.</p></div>
              <button className="secondary-button" onClick={clearFilters}><Filter size={15} /> Clear filters</button>
            </div>
            <div className="table-toolbar">
              <form className="search-box" onSubmit={handleSearch}>
                <Search size={17} />
                <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search name, company, email…" aria-label="Search leads" />
                {searchInput && <button type="button" onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }} aria-label="Clear search"><X size={15} /></button>}
              </form>
              <div className="toolbar-right">
                <label className="filter-select">
                  <Filter size={15} />
                  <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); setActiveNav("leads"); }} aria-label="Filter by status">
                    <option value="">All statuses</option>
                    {LEAD_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
                <span className="results-count">{total} {total === 1 ? "lead" : "leads"}</span>
              </div>
            </div>
            {pageError && <div className="inline-error page-error">{pageError}<button onClick={() => void loadLeads()}>Retry</button></div>}
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
                    <tr><td colSpan={6}><div className="table-state"><span className="spinner" /> Loading leads…</div></td></tr>
                  ) : leads.length === 0 ? (
                    <tr><td colSpan={6}><div className="empty-state">
                      <div className="empty-icon"><Users size={24} /></div>
                      <strong>{search || statusFilter ? "No leads match your filters" : "Your pipeline starts here"}</strong>
                      <p>{search || statusFilter ? "Try changing your search or clearing the filters." : "Add your first lead to start tracking sales opportunities."}</p>
                      {search || statusFilter ? <button className="secondary-button" onClick={clearFilters}>Clear filters</button> : <button className="primary-button" onClick={openCreateModal}><Plus size={16} /> Create your first lead</button>}
                    </div></td></tr>
                  ) : leads.map((lead) => (
                    <tr key={lead._id}>
                      <td>
                        <div className="lead-person">
                          <div className={`lead-avatar avatar-${STATUS_COLORS[lead.status]}`}>{initials(lead.name)}</div>
                          <div className="lead-person-info"><strong>{lead.name}</strong><span>{lead.email || lead.phone || "No contact details"}</span></div>
                        </div>
                      </td>
                      <td><div className="company-cell">{lead.company ? <><span className="company-icon"><Building2 size={15} /></span>{lead.company}</> : <span className="muted-cell">—</span>}</div></td>
                      <td><span className="source-label">{lead.source}</span></td>
                      <td><span className={`status-pill ${STATUS_COLORS[lead.status]}`}><span />{lead.status}</span></td>
                      <td><span className="date-cell">{formatDate(lead.createdAt)}</span></td>
                      <td>
                        <div className="row-actions">
                          <button className="icon-button" title="Edit lead" onClick={() => openEditModal(lead)}><Pencil size={15} /></button>
                          <button className="icon-button delete-action" title="Delete lead" disabled={deletingId === lead._id} onClick={() => void handleDelete(lead)}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <span>Showing {total === 0 ? 0 : (page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total} leads</span>
              <div className="pagination">
                <button className="icon-button" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)} aria-label="Previous page"><ChevronLeft size={17} /></button>
                <span>Page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
                <button className="icon-button" disabled={page >= totalPages || loading} onClick={() => setPage((current) => current + 1)} aria-label="Next page"><ChevronRight size={17} /></button>
              </div>
            </div>
          </section>
          <footer className="page-footer"><span>© {new Date().getFullYear()} LeadFlow CRM</span><span><span className="footer-dot" /> All changes sync with your workspace</span></footer>
        </div>
      </main>
      {modalOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
          <section className="lead-modal" role="dialog" aria-modal="true" aria-labelledby="lead-modal-title">
            <div className="modal-heading">
              <div><span className="eyebrow">LEAD MANAGEMENT</span><h2 id="lead-modal-title">{editingLead ? "Edit lead" : "Add a new lead"}</h2><p>{editingLead ? "Update the details of this opportunity." : "Add a prospect to your sales pipeline."}</p></div>
              <button className="icon-button" onClick={() => setModalOpen(false)} aria-label="Close dialog"><X size={19} /></button>
            </div>
            {formError && <div className="inline-error">{formError}</div>}
            <form onSubmit={handleLeadSubmit}>
              <div className="form-grid">
                <label className="field-label span-two">Full name <span className="required">*</span>
                  <input autoFocus required minLength={2} maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Priya Sharma" />
                </label>
                <label className="field-label">Email address
                  <input type="email" maxLength={254} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="priya@company.com" />
                </label>
                <label className="field-label">Phone number
                  <input maxLength={30} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
                </label>
                <label className="field-label span-two">Company
                  <input maxLength={120} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company or organization" />
                </label>
                <label className="field-label">Lead source
                  <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })}>
                    {(["Website", "Referral", "LinkedIn", "Cold Call", "Other"] as LeadSource[]).map((source) => <option key={source}>{source}</option>)}
                  </select>
                </label>
                <label className="field-label">Pipeline status
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}>
                    {LEAD_STATUSES.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
                <label className="field-label span-two">Notes
                  <textarea rows={3} maxLength={2000} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Add context, next steps, or follow-up notes…" />
                  <small>{form.notes.length}/2000 characters</small>
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving…" : <>{editingLead ? "Save changes" : "Create lead"} <ArrowUpRight size={16} /></>}</button>
              </div>
            </form>
          </section>
        </div>
      )}
      {utilityDialog && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setUtilityDialog(null); }}>
          <section className="lead-modal utility-modal" role="dialog" aria-modal="true" aria-labelledby="utility-modal-title">
            <div className="modal-heading">
              <div>
                <span className="eyebrow">MY WORKSPACE</span>
                <h2 id="utility-modal-title">{utilityDialog === "settings" ? "Workspace settings" : "Help & support"}</h2>
                <p>{utilityDialog === "settings" ? "Your personal workspace and account details." : "A quick guide to managing your sales pipeline."}</p>
              </div>
              <button type="button" className="icon-button" onClick={() => setUtilityDialog(null)} aria-label="Close dialog"><X size={19} /></button>
            </div>
            {utilityDialog === "settings" ? (
              <div className="utility-content">
                <div className="utility-detail"><span>Workspace</span><strong>My workspace</strong></div>
                <div className="utility-detail"><span>Account name</span><strong>{user.name}</strong></div>
                <div className="utility-detail"><span>Email address</span><strong>{user.email}</strong></div>
                <p className="utility-note">Workspace editing and account profile updates are not available yet. Your leads and account remain private to this signed-in user.</p>
              </div>
            ) : (
              <div className="utility-content help-content">
                <div><strong>Find a lead</strong><p>Use the search field to match a name, company, or email address, then press Enter.</p></div>
                <div><strong>Filter the pipeline</strong><p>Choose a status from the sidebar or status selector. Dashboard totals remain global.</p></div>
                <div><strong>Update a lead</strong><p>Use the pencil icon to edit a lead or the trash icon to delete it after confirmation.</p></div>
                <div><strong>Keep your data private</strong><p>Each account only sees leads owned by that account.</p></div>
              </div>
            )}
            <div className="modal-actions"><button type="button" className="primary-button" onClick={() => setUtilityDialog(null)}>Done</button></div>
          </section>
        </div>
      )}
    </div>

  );
}
