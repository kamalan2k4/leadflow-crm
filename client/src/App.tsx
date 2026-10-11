import { AppLoading } from "./components/AppLoading";
import { AuthPage } from "./features/auth/components/AuthPage";
import { useAuthForm } from "./features/auth/hooks/useAuthForm";
import { useAuthSession } from "./features/auth/hooks/useAuthSession";
import { useLeadPipeline } from "./features/leads/hooks/useLeadPipeline";
import { useWorkspaceChrome } from "./features/workspace/hooks/useWorkspaceChrome";
import { DashboardPage } from "./pages/DashboardPage";

export default function App() {
  const session = useAuthSession();
  const authForm = useAuthForm(session.startSession);
  // Loaded here rather than in the dashboard so leads are fetched while a stored token is still being verified.
  const pipeline = useLeadPipeline(session.token);
  const chrome = useWorkspaceChrome();

  function signOut() {
    chrome.closeAccountMenus();
    session.clearSession();
    authForm.clearError();
  }

  if (!session.authReady) {
    return <AppLoading />;
  }

  if (!session.token || !session.user) {
    return <AuthPage form={authForm} />;
  }

  return (
    <DashboardPage
      user={session.user}
      token={session.token}
      pipeline={pipeline}
      chrome={chrome}
      onSignOut={signOut}
    />
  );
}
