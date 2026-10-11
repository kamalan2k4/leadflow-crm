import { Command } from "lucide-react";

export function AppLoading() {
  return (
    <div className="app-loading">
      <div className="loading-mark"><Command size={25} /></div>
      <span>Preparing your workspace…</span>
    </div>
  );
}
