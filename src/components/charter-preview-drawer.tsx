"use client";

import React from "react";
import { Scroll, X, ShieldCheck } from "lucide-react";

export function CharterPreviewDrawer({
  isOpen,
  targetName,
  charter,
  onClose,
}: {
  isOpen: boolean;
  targetName: string;
  charter: string;
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
          maxWidth: "560px",
          padding: "32px",
          borderRadius: "20px",
          border: "1px solid rgba(245, 158, 11, 0.3)",
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
          <Scroll className="w-6 h-6" style={{ color: "var(--draco-gold)" }} />
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: "700" }}>
            Governing Charter Policy
          </h3>
        </div>

        <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--ink-tertiary)", marginBottom: "16px" }}>
          TARGET: {targetName}
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "12px",
            background: "rgba(0, 0, 0, 0.4)",
            border: "1px solid var(--void-05)",
            fontSize: "13px",
            lineHeight: "1.6",
            color: "var(--ink-primary)",
            marginBottom: "24px",
          }}
        >
          {charter}
        </div>

        <button onClick={onClose} className="btn-terminal active" style={{ width: "100%" }}>
          Close Charter Preview
        </button>
      </div>
    </div>
  );
}
