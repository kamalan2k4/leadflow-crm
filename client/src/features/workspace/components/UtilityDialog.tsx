import { Modal } from "../../../components/Modal";
import type { AuthUser } from "../../auth/types";
import type { UtilityDialogKind } from "../types";

type UtilityDialogProps = {
  kind: UtilityDialogKind;
  user: AuthUser;
  onClose: () => void;
};

function SettingsContent({ user }: { user: AuthUser }) {
  return (
    <div className="utility-content">
      <div className="utility-detail"><span>Workspace</span><strong>My workspace</strong></div>
      <div className="utility-detail"><span>Account name</span><strong>{user.name}</strong></div>
      <div className="utility-detail"><span>Email address</span><strong>{user.email}</strong></div>
      <p className="utility-note">Workspace editing and account profile updates are not available yet. Your leads and account remain private to this signed-in user.</p>
    </div>
  );
}

function HelpContent() {
  return (
    <div className="utility-content help-content">
      <div><strong>Find a lead</strong><p>Use the search field to match a name, company, or email address, then press Enter.</p></div>
      <div><strong>Filter the pipeline</strong><p>Choose a status from the sidebar or status selector. Dashboard totals remain global.</p></div>
      <div><strong>Update a lead</strong><p>Use the pencil icon to edit a lead or the trash icon to delete it after confirmation.</p></div>
      <div><strong>Keep your data private</strong><p>Each account only sees leads owned by that account.</p></div>
    </div>
  );
}

export function UtilityDialog({ kind, user, onClose }: UtilityDialogProps) {
  const isSettings = kind === "settings";

  return (
    <Modal
      titleId="utility-modal-title"
      className="utility-modal"
      eyebrow="MY WORKSPACE"
      title={isSettings ? "Workspace settings" : "Help & support"}
      description={isSettings ? "Your personal workspace and account details." : "A quick guide to managing your sales pipeline."}
      onClose={onClose}
    >
      {isSettings ? <SettingsContent user={user} /> : <HelpContent />}
      <div className="modal-actions"><button type="button" className="primary-button" onClick={onClose}>Done</button></div>
    </Modal>
  );
}
