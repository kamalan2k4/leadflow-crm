import { ShieldCheck } from "lucide-react";
import type { AuthFormState } from "../hooks/useAuthForm";
import { AuthForm } from "./AuthForm";
import { AuthStory } from "./AuthStory";

type AuthPageProps = {
  form: AuthFormState;
};

export function AuthPage({ form }: AuthPageProps) {
  return (
    <main className="auth-page">
      <AuthStory />
      <section className="auth-panel">
        <div className="auth-panel-top">
          <span>WELCOME TO LEADFLOW</span>
          <span className="secure-label"><ShieldCheck size={14} /> Secure workspace</span>
        </div>
        <AuthForm form={form} />
        <div className="auth-panel-footer"><ShieldCheck size={14} /> Your workspace is protected by secure authentication.</div>
      </section>
    </main>
  );
}
