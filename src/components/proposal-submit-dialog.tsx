"use client";

import React, { useState } from "react";
import { useWallet } from "./wallet-provider";
import { executeTrustWardWrite, waitForTrustWardFinalization } from "@/lib/trustward";
import { FileCode2, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";

export function ProposalSubmitDialog({
  isOpen,
  onClose,
  onSuccess,
  targetIdDefault = "",
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetIdDefault?: string;
}) {
  const { account } = useWallet();
  const [proposalId, setProposalId] = useState("");
  const [targetId, setTargetId] = useState(targetIdDefault || "warded-vault-core");
  const [candidateUrl, setCandidateUrl] = useState("");
  const [proposedRelease, setProposedRelease] = useState("v2");
  const [narrative, setNarrative] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      setError("Please connect your wallet first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      // Calls propose_upgrade with exact 5 arguments: (proposal_id, target_id, candidate_url, proposed_version, changelog)
      const hash = await executeTrustWardWrite(account, "propose_upgrade", [
        proposalId,
        targetId,
        candidateUrl,
        proposedRelease,
        narrative,
      ]);
      setTxHash(hash);
      await waitForTrustWardFinalization(account, hash);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Proposal submission transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

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
          maxWidth: "600px",
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

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <FileCode2 className="w-6 h-6 text-sky-600" />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "800", color: "#090d16" }}>
            Submit Upgrade Proposal
          </h2>
        </div>

        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>
          Submit a commit-pinned bytecode candidate for Sentinel Engine validator consensus audit.
        </p>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: "13px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {txHash && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              color: "#047857",
              fontSize: "13px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Transaction submitted: {txHash.slice(0, 14)}... Auditing via GenLayer validators...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "#475569", fontWeight: "700", marginBottom: "6px" }}>
                PROPOSAL ID
              </label>
              <input
                type="text"
                required
                placeholder="e.g. trustward-v2-upgrade"
                value={proposalId}
                onChange={(e) => setProposalId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  color: "#090d16",
                  fontSize: "13px",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "#475569", fontWeight: "700", marginBottom: "6px" }}>
                TARGET IDENTIFIER
              </label>
              <input
                type="text"
                required
                placeholder="e.g. warded-vault-core"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  color: "#090d16",
                  fontSize: "13px",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "#475569", fontWeight: "700", marginBottom: "6px" }}>
              PROPOSED VERSION STRING
            </label>
            <input
              type="text"
              required
              placeholder="v2"
              value={proposedRelease}
              onChange={(e) => setProposedRelease(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                color: "#090d16",
                fontSize: "13px",
                fontFamily: "var(--font-mono)",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "#475569", fontWeight: "700", marginBottom: "6px" }}>
              CANDIDATE SOURCE GITHUB RAW URL (COMMIT-PINNED)
            </label>
            <input
              type="url"
              required
              placeholder="https://raw.githubusercontent.com/org/repo/<40-char-sha>/contracts/TargetV2.py"
              value={candidateUrl}
              onChange={(e) => setCandidateUrl(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                color: "#090d16",
                fontSize: "13px",
                fontFamily: "var(--font-mono)",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "#475569", fontWeight: "700", marginBottom: "6px" }}>
              UPGRADE CHANGELOG NARRATIVE (MIN 80 CHARS)
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe candidate changes, additions, and why this upgrade preserves the charter (minimum 80 characters)..."
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                color: "#090d16",
                fontSize: "13px",
                resize: "vertical",
                lineHeight: "1.5",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-terminal"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-cta-primary"
              style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Auditing with AI Validators...</span>
                </>
              ) : (
                <span>Submit for Consensus Audit</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
