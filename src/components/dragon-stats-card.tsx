import React from "react";
import { Shield, Flame, Lock, Layers } from "lucide-react";

export function DragonStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = "amber",
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent?: "amber" | "emerald" | "crimson" | "cyan";
}) {
  const colorMap = {
    amber: "var(--draco-amber)",
    emerald: "var(--draco-emerald)",
    crimson: "var(--draco-crimson)",
    cyan: "var(--draco-cyan)",
  };

  return (
    <div className="panel-glass" style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <span className="stat-label">{title}</span>
        <Icon className="w-4 h-4" style={{ color: colorMap[accent] }} />
      </div>
      <div className="stat-value" style={{ color: colorMap[accent], marginBottom: "4px" }}>
        {value}
      </div>
      <div style={{ fontSize: "11px", color: "var(--ink-tertiary)" }}>
        {subtitle}
      </div>
    </div>
  );
}
