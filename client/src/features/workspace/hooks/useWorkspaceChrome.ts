import { useState } from "react";
import type { NavView, UtilityDialogKind } from "../types";

// State for the shell around the dashboard: navigation, menus, and utility dialogs.
export function useWorkspaceChrome() {
  const [activeNav, setActiveNav] = useState<NavView>("overview");
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [sidebarProfileMenuOpen, setSidebarProfileMenuOpen] = useState(false);
  const [topProfileMenuOpen, setTopProfileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [utilityDialog, setUtilityDialog] = useState<UtilityDialogKind | null>(null);

  // The two topbar popovers share a corner, so opening one closes the other.
  function toggleNotifications() {
    setNotificationOpen((open) => !open);
    setTopProfileMenuOpen(false);
  }

  function toggleTopProfileMenu() {
    setTopProfileMenuOpen((open) => !open);
    setNotificationOpen(false);
  }

  function closeAccountMenus() {
    setSidebarProfileMenuOpen(false);
    setTopProfileMenuOpen(false);
    setWorkspaceMenuOpen(false);
  }

  return {
    activeNav,
    workspaceMenuOpen,
    sidebarProfileMenuOpen,
    topProfileMenuOpen,
    notificationOpen,
    utilityDialog,
    setActiveNav,
    toggleWorkspaceMenu: () => setWorkspaceMenuOpen((open) => !open),
    closeWorkspaceMenu: () => setWorkspaceMenuOpen(false),
    toggleSidebarProfileMenu: () => setSidebarProfileMenuOpen((open) => !open),
    closeSidebarProfileMenu: () => setSidebarProfileMenuOpen(false),
    toggleTopProfileMenu,
    closeTopProfileMenu: () => setTopProfileMenuOpen(false),
    toggleNotifications,
    closeNotifications: () => setNotificationOpen(false),
    openUtilityDialog: (kind: UtilityDialogKind) => setUtilityDialog(kind),
    closeUtilityDialog: () => setUtilityDialog(null),
    closeAccountMenus,
  };
}

export type WorkspaceChrome = ReturnType<typeof useWorkspaceChrome>;
