import { LogOut } from "lucide-react";
import type { AuthUser } from "../../auth/types";

type AccountPopoverProps = {
  user: AuthUser;
  className: string;
  role?: "menu";
  onOpenSettings: () => void;
  onSignOut: () => void;
};

export function AccountPopover({
  user,
  className,
  role,
  onOpenSettings,
  onSignOut,
}: AccountPopoverProps) {
  return (
    <div className={`lf-popover ${className}`} role={role}>
      <strong>{user.name}</strong>
      <span className="popover-muted">{user.email}</span>
      <button type="button" onClick={onOpenSettings}>Account settings</button>
      <button type="button" className="popover-danger" onClick={onSignOut}><LogOut size={14} /> Sign out</button>
    </div>
  );
}
