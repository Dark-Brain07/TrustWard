"use client";

import React from "react";
import { Flame, X, Database, Key, DollarSign, Layers, Scroll } from "lucide-react";

export function FirewallInspectModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "680px",
          padding: "32px",
          borderRadius: "20px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.18)",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
          color: "#090d16",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "#f1f5f9",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#64748b",
            cursor: "pointer",
          }}
        >
          <X className="w-4 h-4" />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <Flame className="w-6 h-6 text-cyan-600" />
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "800", color: "#090d16" }}>
            The 5-Tier TrustWard Sentinel Firewalls
          </h3>
        </div>
        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>
          Every proposed upgrade must pass multi-validator equivalence consensus across 5 strict deterministic safety audits before deployment.
        </p>

        <div style={{ display: "grid", gap: "12px", margin: "16px 0 24px" }}>
          <div style={{ padding: "16px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "#0284c7", marginBottom: "4px", fontSize: "14px" }}>
              <Database className="w-4 h-4 text-sky-600" />
              <span>1. State Storage Slot Layout Integrity</span>
            </div>
            <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6" }}>
              Extracts declared class-level dataclass variables and state slots. Verifies that candidate release does not prepend, delete, or swap variable ordering, eliminating storage collision attacks.
            </p>
          </div>

          <div style={{ padding: "16px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "#d97706", marginBottom: "4px", fontSize: "14px" }}>
              <Key className="w-4 h-4 text-amber-600" />
              <span>2. Sole Guard Upgrade Authority Check</span>
            </div>
            <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6" }}>
              Inspects root upgrader permissions and constructor logic to ensure TrustWard remains the sole upgrade authority and no owner backdoors or bypasses are introduced.
            </p>
          </div>

          <div style={{ padding: "16px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "#059669", marginBottom: "4px", fontSize: "14px" }}>
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>3. Treasury & Drain Movement Protection</span>
            </div>
            <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6" }}>
              Scans for arbitrary token/ether transfers, uncontrolled emit_transfer calls, or emergency withdrawal functions that could allow attackers to drain protocol funds.
            </p>
          </div>

          <div style={{ padding: "16px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "#7c3aed", marginBottom: "4px", fontSize: "14px" }}>
              <Layers className="w-4 h-4 text-purple-600" />
              <span>4. Bounded External Call Invocations</span>
            </div>
            <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6" }}>
              Ensures that all external cross-contract invocations are strictly bounded to known addresses and safe interfaces, preventing reentrancy and arbitrary delegatecalls.
            </p>
          </div>

          <div style={{ padding: "16px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "#e11d48", marginBottom: "4px", fontSize: "14px" }}>
              <Scroll className="w-4 h-4 text-rose-600" />
              <span>5. Governing Charter Semantic Compliance</span>
            </div>
            <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6" }}>
              Natural language semantic audit under AI consensus verifying that proposed feature modifications strictly align with the immutable governing charter submitted at target enrollment.
            </p>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="btn-terminal" 
          style={{ width: "100%", background: "#090d16", color: "#ffffff", padding: "12px", fontSize: "13px", fontWeight: "700" }}
        >
          Dismiss Inspection
        </button>
      </div>
    </div>
  );
}
