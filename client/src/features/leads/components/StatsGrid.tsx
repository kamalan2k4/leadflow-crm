import { Activity, ArrowUpRight, Check, Target, Users } from "lucide-react";
import type { LeadStats } from "../types";

type StatsGridProps = {
  stats: LeadStats;
};

export function StatsGrid({ stats }: StatsGridProps) {
  const cards = [
    {
      label: "Total leads",
      value: stats.total,
      icon: Users,
      tone: "indigo",
      detail: "Across your pipeline",
    },
    {
      label: "Qualified",
      value: stats.qualified,
      icon: Target,
      tone: "cyan",
      detail: "Qualified opportunities",
    },
    {
      label: "Proposals",
      value: stats.proposal,
      icon: Activity,
      tone: "orange",
      detail: "In proposal stage",
    },
    {
      label: "Won deals",
      value: stats.won,
      icon: Check,
      tone: "green",
      detail: "Successfully converted",
    },
  ];

  return (
    <section className="stats-grid">
      {cards.map(({ label, value, icon: Icon, tone, detail }) => (
        <article className="stat-card" key={label}>
          <div className="stat-top"><span>{label}</span><span className={`stat-icon ${tone}`}><Icon size={18} /></span></div>
          <div className="stat-value-row"><strong>{value}</strong><span className="stat-trend"><ArrowUpRight size={14} /></span></div>
          <div className="stat-detail">{detail}</div>
        </article>
      ))}
    </section>
  );
}
