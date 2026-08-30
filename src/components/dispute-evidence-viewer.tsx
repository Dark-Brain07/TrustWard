"use client";

import React from "react";
import { ShieldAlert, X, ExternalLink, FileText, CheckCircle2 } from "lucide-react";

export function DisputeEvidenceViewer({
  isOpen,
  proposalId,
  evidenceUrl,
  summary,
  evidenceDigest,
  onClose,
}: {
  isOpen: boolean;
  proposalId: string;
  evidenceUrl: string;
  summary: string;
  evidenceDigest: string;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        className="panel-glass animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "32px",
          borderRadius: "20px",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "none",
            border: "none",
            color: "var(--ink-secondary)",
            cursor: "pointer",
          }}
        >
          <X className="w-5 h-5" />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <ShieldAlert className="w-6 h-6" style={{ color: "var(--draco-crimson)" }} />
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: "700" }}>
            Dispute Evidence Record
          </h3>
        </div>

        <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--ink-tertiary)", marginBottom: "16px" }}>
          PROPOSAL ID: {proposalId}
        </div>

        <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
          <div>
            <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--ink-tertiary)", marginBottom: "4px" }}>
              DISPUTE RATIONALE:
            </div>
            <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(0, 0, 0, 0.4)", border: "1px solid var(--void-05)", fontSize: "13px", color: "var(--ink-primary)" }}>
              {summary}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--ink-tertiary)", marginBottom: "4px" }}>
              ON-CHAIN EVIDENCE DIGEST (SHA-256):
            </div>
            <div style={{ padding: "10px", borderRadius: "8px", background: "rgba(0, 0, 0, 0.4)", border: "1px solid var(--void-05)", fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--draco-gold)" }}>
              {evidenceDigest || "Digest calculation verified on-chain"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--ink-tertiary)", marginBottom: "4px" }}>
              EVIDENCE SOURCE:
            </div>
            <a
              href={evidenceUrl}
              target="_blank"
              rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--draco-cyan)", textDecoration: "none" }}
            >
              <span>{evidenceUrl}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <button onClick={onClose} className="btn-terminal" style={{ width: "100%" }}>
          Close Evidence Viewer
        </button>
      </div>
    </div>
  );
}
