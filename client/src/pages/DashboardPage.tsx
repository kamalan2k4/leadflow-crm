import { useRef, useState } from "react";
import type { AuthUser } from "../features/auth/types";
import { LeadFormModal } from "../features/leads/components/LeadFormModal";
import { PipelineCard } from "../features/leads/components/PipelineCard";
import { StatsGrid } from "../features/leads/components/StatsGrid";
import { useLeadEditor } from "../features/leads/hooks/useLeadEditor";
import type { LeadSaveKind } from "../features/leads/hooks/useLeadEditor";
import type { LeadPipeline } from "../features/leads/hooks/useLeadPipeline";
import type { Lead, LeadStatus } from "../features/leads/types";
import { NoticeBanner } from "../features/workspace/components/NoticeBanner";
import { PageFooter } from "../features/workspace/components/PageFooter";
import { Sidebar } from "../features/workspace/components/Sidebar";
import { Topbar } from "../features/workspace/components/Topbar";
import { UtilityDialog } from "../features/workspace/components/UtilityDialog";
import { WelcomeHeader } from "../features/workspace/components/WelcomeHeader";
import type { WorkspaceChrome } from "../features/workspace/hooks/useWorkspaceChrome";
import type { NavView } from "../features/workspace/types";

type DashboardPageProps = {
  user: AuthUser;
  token: string;
  pipeline: LeadPipeline;
  chrome: WorkspaceChrome;
  onSignOut: () => void;
};

export function DashboardPage({
  user,
  token,
  pipeline,
  chrome,
  onSignOut,
}: DashboardPageProps) {
  const [notice, setNotice] = useState("");
  const pipelineRef = useRef<HTMLElement | null>(null);
  const pageContentRef = useRef<HTMLDivElement | null>(null);

  function handleLeadSaved(kind: LeadSaveKind) {
    if (kind === "created") {
      setNotice("Lead created successfully.");
      // Show the new lead at the top of an unfiltered first page.
      pipeline.clearFilters();
    } else {
      setNotice("Lead updated successfully.");
    }
    pipeline.refresh();
  }

  const editor = useLeadEditor({ token, onSaved: handleLeadSaved });

  async function handleDelete(lead: Lead) {
    const confirmed = window.confirm(
      `Delete ${lead.name}? This action cannot be undone.`,
    );
    if (!confirmed) return;
    if (await pipeline.removeLead(lead)) {
      setNotice("Lead deleted successfully.");
    }
  }

  function scrollToPipeline() {
    // Deferred so the scroll runs after React has applied the state updates.
    window.setTimeout(() => pipelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  function navigateTo(view: NavView) {
    chrome.setActiveNav(view);
    chrome.closeWorkspaceMenu();
    if (view === "overview") {
      pipeline.clearFilters();
      pageContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      scrollToPipeline();
    }
  }

  function chooseStatus(status: LeadStatus) {
    pipeline.toggleStatus(status);
    chrome.setActiveNav("leads");
    scrollToPipeline();
  }

  function selectStatus(status: string) {
    pipeline.filterByStatus(status);
    chrome.setActiveNav("leads");
  }

  return (
    <div className="workspace">
      <Sidebar
        user={user}
        chrome={chrome}
        totalLeads={pipeline.stats.total}
        statusFilter={pipeline.statusFilter}
        onNavigate={navigateTo}
        onChooseStatus={chooseStatus}
        onSignOut={onSignOut}
      />
      <main className="main-panel">
        <Topbar user={user} chrome={chrome} onSignOut={onSignOut} />
        <div className="page-content" ref={pageContentRef}>
          <WelcomeHeader userName={user.name} onAddLead={editor.openCreate} />
          {notice && <NoticeBanner message={notice} onDismiss={() => setNotice("")} />}
          <StatsGrid stats={pipeline.stats} />
          <PipelineCard
            ref={pipelineRef}
            pipeline={pipeline}
            onStatusChange={selectStatus}
            onCreateLead={editor.openCreate}
            onEditLead={editor.openEdit}
            onDeleteLead={(lead) => void handleDelete(lead)}
          />
          <PageFooter />
        </div>
      </main>
      {editor.open && <LeadFormModal editor={editor} />}
      {chrome.utilityDialog && (
        <UtilityDialog kind={chrome.utilityDialog} user={user} onClose={chrome.closeUtilityDialog} />
      )}
    </div>
  );
}
