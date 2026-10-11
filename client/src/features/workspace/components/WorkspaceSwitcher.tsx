import { MoreHorizontal } from "lucide-react";
import type { AuthUser } from "../../auth/types";
import type { WorkspaceChrome } from "../hooks/useWorkspaceChrome";

type WorkspaceSwitcherProps = {
  user: AuthUser;
  chrome: WorkspaceChrome;
  onGoToOverview: () => void;
};

export function WorkspaceSwitcher({ user, chrome, onGoToOverview }: WorkspaceSwitcherProps) {
  return (
    <div className="lf-menu-wrap workspace-menu-wrap">
      <button
        type="button"
        className="workspace-switcher"
        aria-expanded={chrome.workspaceMenuOpen}
        onClick={chrome.toggleWorkspaceMenu}
      >
        <div className="workspace-avatar">LF</div>
        <div className="workspace-name"><strong>My workspace</strong><span>Personal CRM</span></div>
        <MoreHorizontal size={18} />
      </button>
      {chrome.workspaceMenuOpen && (
        <div className="lf-popover workspace-popover" role="menu">
          <span className="popover-eyebrow">CURRENT WORKSPACE</span>
          <strong>My workspace</strong>
          <span className="popover-muted">Personal CRM · {user.email}</span>
          <button type="button" onClick={onGoToOverview}>Go to overview</button>
          <button type="button" onClick={() => { chrome.openUtilityDialog("settings"); chrome.closeWorkspaceMenu(); }}>Workspace settings</button>
        </div>
      )}
    </div>
  );
}
