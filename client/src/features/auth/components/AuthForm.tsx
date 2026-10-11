import { ArrowUpRight, Command } from "lucide-react";
import type { AuthFormState } from "../hooks/useAuthForm";

type AuthFormProps = {
  form: AuthFormState;
};

export function AuthForm({ form }: AuthFormProps) {
  const isLogin = form.mode === "login";

  return (
    <form className="auth-card" onSubmit={form.submit}>
      <div className="auth-heading">
        <div className="auth-icon"><Command size={22} /></div>
        <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
        <p>{isLogin ? "Enter your details to access your sales workspace." : "Set up your account and start managing your pipeline."}</p>
      </div>
      {form.error && <div className="inline-error">{form.error}</div>}
      {!isLogin && (
        <label className="field-label">
          Full name
          <input value={form.name} onChange={(e) => form.setName(e.target.value)} required minLength={2} maxLength={80} placeholder="Your name" autoComplete="name" />
        </label>
      )}
      <label className="field-label">
        Email address
        <input type="email" value={form.email} onChange={(e) => form.setEmail(e.target.value)} required maxLength={254} placeholder="you@company.com" autoComplete="email" />
      </label>
      <label className="field-label">
        Password
        <input type="password" value={form.password} onChange={(e) => form.setPassword(e.target.value)} required minLength={isLogin ? 1 : 8} autoComplete={isLogin ? "current-password" : "new-password"} placeholder={isLogin ? "Enter your password" : "At least 8 characters"} />
        {!isLogin && <small>Use at least 8 characters.</small>}
      </label>
      <button className="primary-button auth-submit" disabled={form.busy}>
        {form.busy ? "Please wait…" : isLogin ? "Sign in to workspace" : "Create account"}
        {!form.busy && <ArrowUpRight size={17} />}
      </button>
      <div className="auth-switch">
        {isLogin ? "New to LeadFlow?" : "Already have an account?"}
        <button type="button" onClick={form.toggleMode}>
          {isLogin ? "Create account" : "Sign in"}
        </button>
      </div>
    </form>
  );
}
