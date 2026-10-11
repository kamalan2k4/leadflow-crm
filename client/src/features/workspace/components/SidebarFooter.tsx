import { CircleHelp, LogOut, Settings } from "lucide-react";
import { initials } from "../../../utils/format";
import type { AuthUser } from "../../auth/types";
import type { WorkspaceChrome } from "../hooks/useWorkspaceChrome";
import { AccountPopover } from "./AccountPopover";

type SidebarFooterProps = {
  user: AuthUser;
  chrome: WorkspaceChrome;
  onSignOut: () => void;
};

export function SidebarFooter({ user, chrome, onSignOut }: SidebarFooterProps) {
  return (
    <div className="sidebar-bottom">
      <button type="button" className="nav-item" onClick={() => chrome.openUtilityDialog("settings")}><Settings size={18} /> Settings</button>
      <button type="button" className="nav-item" onClick={() => chrome.openUtilityDialog("help")}><CircleHelp size={18} /> Help & support</button>
      <div className="profile-row">
        <div className="lf-menu-wrap sidebar-profile-wrap">
          <button type="button" className="profile-avatar avatar-button" aria-label="Open account menu" aria-expanded={chrome.sidebarProfileMenuOpen} onClick={chrome.toggleSidebarProfileMenu}>{initials(user.name)}</button>
          {chrome.sidebarProfileMenuOpen && (
            <AccountPopover
              user={user}
              className="profile-popover sidebar-profile-popover"
              role="menu"
              onOpenSettings={() => { chrome.openUtilityDialog("settings"); chrome.closeSidebarProfileMenu(); }}
              onSignOut={onSignOut}
            />
          )}
        </div>
        <div className="profile-info"><strong>{user.name}</strong><span>{user.email}</span></div>
        <button className="icon-button logout-button" title="Sign out" aria-label="Sign out" onClick={onSignOut}><LogOut size={17} /></button>
      </div>
    </div>
  );
}
