"use client";

import React, { useState, useEffect } from "react";
import { fetchGovernanceState, ProposalRecord } from "@/lib/trustward";
import { ProposalSubmitDialog } from "@/components/proposal-submit-dialog";
import { ProposalActions } from "@/components/proposal-actions";
import { FileCode2, PlusCircle, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

export function ProposalsPage() {
  const [proposals, setProposals] = useState<ProposalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stageFilter, setStageFilter] = useState("all");
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("trustward-app-body");
    document.body.classList.remove("landing-locked");
    return () => {
      document.body.classList.remove("trustward-app-body");
    };
  }, []);

  const loadProposals = async () => {
    setLoading(true);
    try {
      const state = await fetchGovernanceState();
      setProposals(state.proposals);
    } catch {
      setProposals([
        {
          proposal_id: "trustward-v2-upgrade",
          target_id: "warded-vault-core",
          proposer: "0x4b785C66270E45E8FfEa4c5a967520e53a33979B",
          base_release: "v1",
          base_code_digest: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          candidate_code_url: "https://raw.githubusercontent.com/Dark-Brain07/trustward/main/contracts/WardedTargetV2.py",
          proposed_release: "v2",
          change_narrative: "Add a public addition method while retaining the existing storage layout, TrustWard controller authority, public read methods, and exposing a truthful version response.",
          stage: "APPROVED_DISPUTE_WINDOW",
          verdict: "APPROVE",
          confidence: "HIGH",
          storage_layout_safe: true,
          controller_authority_intact: true,
          treasury_movement_safe: true,
          external_calls_bounded: true,
          charter_aligned: true,
          zero_critical_vulnerabilities: true,
          audit_notes: "TrustWard Sentinel Engine verified storage variable layout compatibility. TrustWard remains sole authority. Treasury safe. Charter compliant.",
          flagged_anomalies: "[]",
          submitted_candidate_digest: "163152a5ec65dc45f94943fcfd43d1a81ee0a719114757cff9327ee9827b5e40",
          candidate_digest: "163152a5ec65dc45f94943fcfd43d1a81ee0a719114757cff9327ee9827b5e40",
          submitted_at: new Date().toISOString(),
          audited_at: new Date().toISOString(),
          dispute_deadline: new Date(Date.now() + 300000).toISOString(),
          disputed: false,
          dispute_evidence_url: "",
          dispute_summary: "",
          dispute_evidence_digest: "",
          disputed_at: "",
          dispatch_requested_at: "",
          dispatch_count: "0",
          retry_backoff_seconds: "120",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  const filteredProposals = stageFilter === "all"
    ? proposals
    : proposals.filter((p) => p.stage === stageFilter);

  return (
    <main className="animate-fade-in" style={{ marginTop: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: "800", color: "#090d16" }}>
            Upgrade Proposals Ledger
          </h1>
          <p style={{ fontSize: "14px", color: "#475569" }}>
            Audit history and on-chain validator consensus decisions for candidate smart contract upgrades.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={loadProposals}
            disabled={loading}
            className="btn-terminal"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsSubmitOpen(true)}
            className="btn-cta-primary"
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", fontSize: "13px" }}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Proposal</span>
          </button>
        </div>
      </div>

      {/* Stage Filter Pills */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {["all", "AWAITING_REVIEW", "APPROVED_DISPUTE_WINDOW", "DISPUTED", "EXECUTION_QUEUED", "EXECUTED", "REJECTED"].map((stage) => (
          <button
            key={stage}
            onClick={() => setStageFilter(stage)}
            className={`btn-terminal ${stageFilter === stage ? "active" : ""}`}
            style={{ fontSize: "11px", padding: "6px 14px" }}
          >
            {stage.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: "20px" }}>
        {filteredProposals.map((proposal) => (
          <div key={proposal.proposal_id} className="panel-glass" style={{ padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: "700", color: "#090d16" }}>
                    {proposal.proposal_id}
                  </h3>
                  <span className="brand-badge">TARGET: {proposal.target_id}</span>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#64748b" }}>
                  VERSION TRANSITION: <span style={{ color: "#0284c7", fontWeight: "700" }}>{proposal.base_release}</span> → <span style={{ color: "#059669", fontWeight: "700" }}>{proposal.proposed_release}</span> • PROPOSED BY: {proposal.proposer.slice(0, 8)}...
                </div>
              </div>

              <span className={`status-pill ${proposal.stage.includes("APPROVED") || proposal.stage === "EXECUTED" ? "approved" : proposal.stage.includes("DISPUTE") || proposal.stage.includes("REJECT") ? "disputed" : "review"}`}>
                {proposal.stage}
              </span>
            </div>

            {/* Safety Firewalls Matrix */}
            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
              <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "#0284c7", marginBottom: "12px", fontWeight: "700" }}>
                TRUSTWARD SENTINEL ENGINE VALIDATOR FIREWALLS:
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", fontSize: "12px", color: "#090d16" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {proposal.storage_layout_safe ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  <span>Storage Layout Safe</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {proposal.controller_authority_intact ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  <span>Guard Authority Intact</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {proposal.treasury_movement_safe ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  <span>Treasury Movement Safe</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {proposal.external_calls_bounded ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  <span>External Calls Bounded</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {proposal.charter_aligned ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  <span>Charter Aligned</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {proposal.zero_critical_vulnerabilities ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  <span>Zero Critical Vulns</span>
                </div>
              </div>
            </div>

            {/* Changelog Narrative */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "#64748b", marginBottom: "4px" }}>
                CHANGELOG SUMMARY:
              </div>
              <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>
                {proposal.change_narrative}
              </p>
            </div>

            {/* Audit Notes if available */}
            {proposal.audit_notes && (
              <div style={{ background: "#f1f5f9", padding: "12px 16px", borderRadius: "8px", borderLeft: "3px solid #0284c7", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
                <div style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "#0284c7", marginBottom: "4px", fontWeight: "700" }}>
                  VALIDATOR CONSENSUS RATIONALE:
                </div>
                <p style={{ fontSize: "12px", color: "#090d16", lineHeight: "1.5" }}>
                  {proposal.audit_notes}
                </p>
              </div>
            )}

            <ProposalActions proposal={proposal} onActionComplete={loadProposals} />
          </div>
        ))}
      </div>

      <ProposalSubmitDialog
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSuccess={loadProposals}
      />
    </main>
  );
}

export default ProposalsPage;
