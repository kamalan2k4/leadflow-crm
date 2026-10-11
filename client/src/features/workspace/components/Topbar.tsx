import { Bell, ChevronRight } from "lucide-react";
import { formatToday, initials } from "../../../utils/format";
import type { AuthUser } from "../../auth/types";
import type { WorkspaceChrome } from "../hooks/useWorkspaceChrome";
import { AccountPopover } from "./AccountPopover";

type TopbarProps = {
  user: AuthUser;
  chrome: WorkspaceChrome;
  onSignOut: () => void;
};

export function Topbar({ user, chrome, onSignOut }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="breadcrumbs" aria-label="Breadcrumb"><span>Workspace</span><ChevronRight size={15} /><strong>{chrome.activeNav === "leads" ? "Leads" : "Overview"}</strong></div>
      <div className="topbar-actions">
        <div className="topbar-date">{formatToday()}</div>
        <div className="lf-menu-wrap topbar-menu-wrap">
          <button type="button" className="icon-button notification-button" title="Notifications" aria-label="Notifications" aria-expanded={chrome.notificationOpen} onClick={chrome.toggleNotifications}><Bell size={18} /></button>
          {chrome.notificationOpen && <div className="lf-popover topbar-popover notification-popover"><strong>You’re all caught up</strong><span className="popover-muted">New lead and pipeline notifications will appear here.</span><button type="button" onClick={chrome.closeNotifications}>Dismiss</button></div>}
        </div>
        <div className="lf-menu-wrap topbar-menu-wrap">
          <button type="button" className="topbar-avatar avatar-button" aria-label="Open profile menu" aria-expanded={chrome.topProfileMenuOpen} onClick={chrome.toggleTopProfileMenu}>{initials(user.name)}</button>
          {chrome.topProfileMenuOpen && (
            <AccountPopover
              user={user}
              className="topbar-popover profile-popover"
              onOpenSettings={() => { chrome.openUtilityDialog("settings"); chrome.closeTopProfileMenu(); }}
              onSignOut={onSignOut}
            />
          )}
        </div>
      </div>
    </header>
  );
}
