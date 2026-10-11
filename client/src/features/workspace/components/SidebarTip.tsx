import { ArrowUpRight, Sparkles } from "lucide-react";

type SidebarTipProps = {
  onViewQualified: () => void;
};

export function SidebarTip({ onViewQualified }: SidebarTipProps) {
  return (
    <div className="sidebar-tip">
      <div className="tip-icon"><Sparkles size={17} /></div>
      <strong>Keep momentum</strong>
      <p>Follow up with your qualified leads to keep deals moving forward.</p>
      <button type="button" onClick={onViewQualified}>View qualified leads <ArrowUpRight size={14} /></button>
    </div>
  );
}
