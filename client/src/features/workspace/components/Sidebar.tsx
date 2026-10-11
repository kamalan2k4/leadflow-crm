import { LayoutDashboard, Users } from "lucide-react";
import { BrandMark } from "../../../components/BrandMark";
import type { AuthUser } from "../../auth/types";
import { LEAD_STATUSES, STATUS_COLORS } from "../../leads/constants";
import type { LeadStatus } from "../../leads/types";
import type { WorkspaceChrome } from "../hooks/useWorkspaceChrome";
import type { NavView } from "../types";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarTip } from "./SidebarTip";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

type SidebarProps = {
  user: AuthUser;
  chrome: WorkspaceChrome;
  totalLeads: number;
  statusFilter: string;
  onNavigate: (view: NavView) => void;
  onChooseStatus: (status: LeadStatus) => void;
  onSignOut: () => void;
};

export function Sidebar({
  user,
  chrome,
  totalLeads,
  statusFilter,
  onNavigate,
  onChooseStatus,
  onSignOut,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <button type="button" className="brand sidebar-brand brand-button" onClick={() => onNavigate("overview")} aria-label="LeadFlow home">
        <BrandMark iconSize={20} />
      </button>
      <WorkspaceSwitcher user={user} chrome={chrome} onGoToOverview={() => onNavigate("overview")} />
      <div className="nav-caption">WORKSPACE</div>
      <nav className="sidebar-nav">
        <button type="button" className={`nav-item ${chrome.activeNav === "overview" ? "active" : ""}`} onClick={() => onNavigate("overview")}><LayoutDashboard size={18} /> Overview</button>
        <button type="button" className={`nav-item ${chrome.activeNav === "leads" ? "active-subtle" : ""}`} onClick={() => onNavigate("leads")}><Users size={18} /> Leads <span className="nav-count">{totalLeads}</span></button>
      </nav>
      <div className="nav-caption pipeline-caption">PIPELINE</div>
      <nav className="sidebar-nav">
        {LEAD_STATUSES.map((status) => (
          <button key={status} className={`nav-item ${statusFilter === status ? "active-subtle" : ""}`} onClick={() => onChooseStatus(status)}>
            <span className={`nav-status-dot ${STATUS_COLORS[status]}`} />
            {status}
          </button>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <SidebarTip onViewQualified={() => onChooseStatus("Qualified")} />
      <SidebarFooter user={user} chrome={chrome} onSignOut={onSignOut} />
    </aside>
  );
}
