import React from "react";
import { ExternalLink } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="app-footer-auto" style={{ marginTop: "80px", paddingTop: "40px", borderTop: "1px solid var(--void-05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: "800", fontSize: "16px", color: "#ffffff" }}>
          TRUSTWARD
        </span>
        <span style={{ 
          fontSize: "10px", 
          fontFamily: "var(--font-mono)", 
          fontWeight: "700", 
          color: "var(--accent-cyan)", 
          background: "rgba(56, 189, 248, 0.1)",
          border: "1px solid rgba(56, 189, 248, 0.25)",
          padding: "1px 5px",
          borderRadius: "4px"
        }}>
          v1
        </span>
        <span style={{ fontSize: "12px", color: "var(--ink-tertiary)", marginLeft: "4px" }}>
          • Consensus Upgrade Governance Control Plane
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--ink-secondary)" }}>
        <a
          href="https://docs.genlayer.com"
          target="_blank"
          rel="noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--ink-secondary)", textDecoration: "none" }}
        >
          <span>GenLayer Docs</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        <a
          href="https://studio.genlayer.com"
          target="_blank"
          rel="noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--ink-secondary)", textDecoration: "none" }}
        >
          <span>StudioNet</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        <a
          href="https://github.com/Dark-Brain07/trustward"
          target="_blank"
          rel="noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--accent-cyan)", textDecoration: "none" }}
        >
          <span>GitHub</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </footer>
  );
}
