"use client";

import React, { useState } from "react";
import { useWallet } from "./wallet-provider";
import { executeTrustWardWrite, waitForTrustWardFinalization, ProposalRecord } from "@/lib/trustward";
import { Shield, AlertCircle, CheckCircle2, Loader2, RefreshCw, Flame, ExternalLink } from "lucide-react";

export function ProposalActions({
  proposal,
  onActionComplete,
}: {
  proposal: ProposalRecord;
  onActionComplete: () => void;
}) {
  const { account } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showDisputeInput, setShowDisputeInput] = useState(false);
  const [disputeUrl, setDisputeUrl] = useState("");
  const [disputeRationale, setDisputeRationale] = useState("");
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleAudit = async () => {
    if (!account) {
      setError("Please connect your wallet first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    setActiveAction("audit");

    try {
      const hash = await executeTrustWardWrite(account, "audit_proposal", [proposal.proposal_id]);
      setSuccessMsg(`Audit requested! Tx: ${hash.slice(0, 14)}... Waiting for multi-validator equivalence consensus...`);
      await waitForTrustWardFinalization(account, hash);
      setSuccessMsg("Consensus audit complete and recorded on-chain!");
      onActionComplete();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Audit consensus transaction failed");
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const handleFileDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      setError("Please connect your wallet first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    setActiveAction("dispute");

    try {
      const hash = await executeTrustWardWrite(account, "file_dispute", [
        proposal.proposal_id,
        disputeUrl,
        disputeRationale,
      ]);
      setSuccessMsg(`Dispute registered! Snapshotting evidence on-chain: ${hash.slice(0, 14)}...`);
      await waitForTrustWardFinalization(account, hash);
      setSuccessMsg("Dispute evidence snapshot finalized. Proposal locked for re-audit.");
      setShowDisputeInput(false);
      onActionComplete();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Dispute submission failed");
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const handleDispatch = async () => {
    if (!account) {
      setError("Please connect your wallet first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    setActiveAction("dispatch");

    try {
      const hash = await executeTrustWardWrite(account, "dispatch_upgrade", [proposal.proposal_id]);
      setSuccessMsg(`Upgrade dispatched! Emitting bytecode slot mutation to target contract: ${hash.slice(0, 14)}...`);
      await waitForTrustWardFinalization(account, hash);
      setSuccessMsg("Cross-contract upgrade dispatched! Proposal moved to execution queue.");
      onActionComplete();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Dispatch execution failed");
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const handleFinalize = async () => {
    if (!account) {
      setError("Please connect your wallet first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    setActiveAction("finalize");

    try {
      const hash = await executeTrustWardWrite(account, "verify_and_finalize", [proposal.proposal_id]);
      setSuccessMsg(`Verifying target installation: ${hash.slice(0, 14)}...`);
      await waitForTrustWardFinalization(account, hash);
      setSuccessMsg("Upgrade confirmed and marked as EXECUTED!");
      onActionComplete();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Finalization transaction failed");
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const handleAuditDispute = async () => {
    if (!account) {
      setError("Please connect your wallet first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    setActiveAction("audit_dispute");

    try {
      const hash = await executeTrustWardWrite(account, "audit_dispute", [proposal.proposal_id]);
      setSuccessMsg(`Dispute audit requested! Tx: ${hash.slice(0, 14)}... Waiting for consensus...`);
      await waitForTrustWardFinalization(account, hash);
      setSuccessMsg("Dispute consensus audit complete and recorded on-chain!");
      onActionComplete();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Dispute audit transaction failed");
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  return (
    <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
      {error && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            fontSize: "12px",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#047857",
            fontSize: "12px",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {proposal.stage === "AWAITING_REVIEW" && (
        <button
          onClick={handleAudit}
          disabled={isLoading}
          className="btn-cta-primary"
          style={{ width: "100%", padding: "10px 16px", fontSize: "13px" }}
        >
          {isLoading && activeAction === "audit" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Running Sentinel Engine Consensus Audit...</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4" />
              <span>Trigger Multi-Validator AI Audit Consensus</span>
            </>
          )}
        </button>
      )}

      {proposal.stage === "APPROVED_DISPUTE_WINDOW" && (
        <div style={{ display: "grid", gap: "10px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleDispatch}
              disabled={isLoading}
              className="btn-cta-primary"
              style={{ flex: 2, padding: "10px 16px", fontSize: "13px" }}
            >
              {isLoading && activeAction === "dispatch" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching Cross-Contract Call...</span>
                </>
              ) : (
                <span>Dispatch Bytecode Slot Mutation →</span>
              )}
            </button>
          </div>

          {!showDisputeInput ? (
            <button
              onClick={() => setShowDisputeInput(true)}
              className="btn-terminal"
              style={{ width: "100%", fontSize: "11px", padding: "6px" }}
            >
              <span>File Dispute / Challenge Evidence</span>
            </button>
          ) : (
            <form onSubmit={handleFileDispute} style={{ display: "grid", gap: "8px", marginTop: "8px" }}>
              <input
                type="url"
                required
                placeholder="HTTPS Dispute Evidence URL"
                value={disputeUrl}
                onChange={(e) => setDisputeUrl(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  color: "#090d16",
                  fontSize: "12px",
                  fontFamily: "var(--font-mono)",
                }}
              />
              <textarea
                required
                rows={2}
                placeholder="Summary of detected security anomaly..."
                value={disputeRationale}
                onChange={(e) => setDisputeRationale(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  color: "#090d16",
                  fontSize: "12px",
                }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowDisputeInput(false)}
                  className="btn-terminal"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-terminal active"
                  style={{ flex: 1 }}
                >
                  Submit Dispute
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {proposal.stage === "EXECUTION_QUEUED" && (
        <button
          onClick={handleFinalize}
          disabled={isLoading}
          className="btn-cta-primary"
          style={{ width: "100%", padding: "10px 16px", fontSize: "13px" }}
        >
          {isLoading && activeAction === "finalize" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Active Target Release...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Finalize Upgrade Execution</span>
            </>
          )}
        </button>
      )}

      {proposal.stage === "DISPUTED" && (
        <button
          onClick={handleAuditDispute}
          disabled={isLoading}
          className="btn-cta-primary"
          style={{ width: "100%", padding: "10px 16px", fontSize: "13px" }}
        >
          {isLoading && activeAction === "audit_dispute" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Running Dispute Consensus Audit...</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4" />
              <span>Trigger Dispute Consensus Audit</span>
            </>
          )}
        </button>
      )}

      {proposal.stage === "EXECUTED" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#059669", fontSize: "13px", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>UPGRADE FINALIZED & EXECUTED ON TARGET</span>
        </div>
      )}
    </div>
  );
}
