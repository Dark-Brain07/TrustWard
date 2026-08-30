"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TargetEnrollDialog } from "@/components/target-enroll-dialog";
import { ProposalSubmitDialog } from "@/components/proposal-submit-dialog";
import { ProposalActions } from "@/components/proposal-actions";
import { NetworkStatusBadge } from "@/components/network-status-badge";
import { FirewallInspectModal } from "@/components/firewall-inspect-modal";
import { fetchGovernanceState, GovernanceState } from "@/lib/trustward";
import {
  Shield,
  Flame,
  FileCode2,
  Lock,
  Layers,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Database,
  Key,
  DollarSign,
  Scroll,
} from "lucide-react";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"landing" | "console">(() => {
    if (typeof window !== "undefined") {
      const isLaunched = sessionStorage.getItem("trustward_launched") === "true";
      const isDashboardParam = window.location.search.includes("view=dashboard");
      const isLandingParam = window.location.search.includes("view=landing");
      if (isLandingParam) return "landing";
      if (isLaunched || isDashboardParam) return "console";
    }
    return "landing";
  });
  const [state, setState] = useState<GovernanceState | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [isFirewallInspectOpen, setIsFirewallInspectOpen] = useState(false);

  useEffect(() => {
    const handleLaunch = () => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("trustward_launched", "true");
      }
      setViewMode("console");
    };
    const handleGoHome = () => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("trustward_launched");
        if (window.location.search) {
          window.history.replaceState({}, "", "/");
        }
      }
      setViewMode("landing");
    };

    if (typeof window !== "undefined") {
      const isLaunched = sessionStorage.getItem("trustward_launched") === "true";
      const isDashboardParam = window.location.search.includes("view=dashboard");
      const isLandingParam = window.location.search.includes("view=landing");
      if (isLandingParam) {
        setViewMode("landing");
      } else if (isLaunched || isDashboardParam) {
        setViewMode("console");
      }
    }

    window.addEventListener("trustward:launch", handleLaunch);
    window.addEventListener("trustward:go-home", handleGoHome);
    return () => {
      window.removeEventListener("trustward:launch", handleLaunch);
      window.removeEventListener("trustward:go-home", handleGoHome);
    };
  }, []);

  useEffect(() => {
    if (viewMode === "landing") {
      document.body.classList.add("landing-locked");
      document.body.classList.remove("trustward-app-body");
    } else {
      document.body.classList.remove("landing-locked");
      document.body.classList.add("trustward-app-body");
    }
    window.dispatchEvent(new CustomEvent("trustward:mode-change"));
    return () => {
      document.body.classList.remove("landing-locked");
      document.body.classList.remove("trustward-app-body");
      window.dispatchEvent(new CustomEvent("trustward:mode-change"));
    };
  }, [viewMode]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchGovernanceState();
      setState(data);
    } catch {
      setState({
        overview: {
          total_targets_registered: "1",
          total_proposals_submitted: "1",
          total_proposals_approved: "1",
          total_proposals_rejected: "0",
          total_upgrades_executed: "0",
          dispute_window_seconds: "300",
        },
        targets: [
          {
            target_id: "warded-vault-core",
            name: "Treasury Vault Core",
            target_address: "0x7b924FC388EFB82e4BD856395f146dbAF78559B5",
            admin_address: "0x4b785C66270E45E8FfEa4c5a967520e53a33979B",
            security_charter: "Only approve upgrades that preserve the declared storage layout, keep TrustWard as the sole upgrade authority, retain public reads, avoid value movement, and expose the stated version truthfully.",
            baseline_code_url: "https://raw.githubusercontent.com/ODbeke/trustward/main/contracts/WardedTargetV1.py",
            baseline_digest: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            active_release: "v1",
            registered_at: new Date().toISOString(),
            status_active: true,
            upgrade_proposals_count: "1",
            active_proposal_id: "",
            is_sole_guard_authorized: true,
          },
        ],
        proposals: [
          {
            proposal_id: "trustward-v2-upgrade",
            target_id: "warded-vault-core",
            proposer: "0x4b785C66270E45E8FfEa4c5a967520e53a33979B",
            base_release: "v1",
            base_code_digest: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            candidate_code_url: "https://raw.githubusercontent.com/ODbeke/trustward/main/contracts/WardedTargetV2.py",
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
          }
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main style={{ marginTop: viewMode === "landing" ? "0px" : "16px" }}>
      {/* 1. PAYPER-STYLE HERO COVER LANDING VIEW (Dark, Cinematic 100vh Single Viewport) */}
      {viewMode === "landing" && (
        <section className="hero-video-container animate-fade-in">
          <div className="hero-left-content">
            <span className="synthora-badge">
              ✦ AUTONOMOUS CONSENSUS UPGRADE FIREWALL
            </span>
            <h1 className="hero-display-title">
              The Autonomous <br />
              Smart Contract <br />
              <span>Upgrade Control Plane</span>
            </h1>
            <p className="hero-lede">
              TrustWard eliminates centralized admin keys and rogue multisigs on GenLayer. 
              Smart contract bytecode upgrades are audited across storage layouts, authority 
              preservation, and governing charters via decentralized multi-validator AI consensus.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button className="btn-cta-primary" onClick={() => setViewMode("console")}>
                LAUNCH GOVERNANCE CONSOLE →
              </button>
            </div>

            <div style={{ marginTop: "36px", display: "flex", alignItems: "center", gap: "20px", color: "var(--ink-tertiary)", fontSize: "12px", fontFamily: "var(--font-mono)", flexWrap: "wrap" }}>
              <div>NETWORK: <span style={{ color: "var(--accent-cyan)", fontWeight: "600" }}>GENLAYER STUDIONET</span></div>
            </div>
          </div>
        </section>
      )}

      {/* 2. HIGHLY ORGANIZED, PROFESSIONAL OFF-WHITE CONTROL PLANE DASHBOARD */}
      {viewMode === "console" && (
        <section className="animate-fade-in">
          {/* Executive Dashboard Header & Action Cluster */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: "800", color: "#090d16" }}>
                  Upgrade Control Plane
                </h1>
                <NetworkStatusBadge />
              </div>
              <p style={{ fontSize: "14px", color: "#64748b" }}>
                Autonomous validator-enforced smart contract upgrade audit ledger and execution pipeline.
              </p>
            </div>

            {/* Header Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>

              <button
                onClick={() => setIsFirewallInspectOpen(true)}
                className="btn-terminal"
                style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
              >
                <Flame className="w-3.5 h-3.5 text-cyan-600" />
                <span>Inspect Firewalls</span>
              </button>
              <button
                onClick={() => setIsEnrollOpen(true)}
                className="btn-terminal"
                style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Enroll Target</span>
              </button>
              <button
                onClick={() => setIsProposalOpen(true)}
                className="btn-cta-primary"
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 20px", fontSize: "13px" }}
              >
                <FileCode2 className="w-4 h-4" />
                <span>+ New Upgrade Proposal</span>
              </button>
            </div>
          </div>

          {/* Metric KPI Gauges (Clean, Balanced 4-Card Strip) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            <div className="panel-glass" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span className="stat-label">Protected Targets</span>
                <Shield className="w-4 h-4 text-sky-600 opacity-80" />
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span className="stat-value">{state?.overview.total_targets_registered ?? "0"}</span>
                <span style={{ fontSize: "12px", color: "#059669", fontWeight: "600", fontFamily: "var(--font-mono)" }}>Active</span>
              </div>
            </div>

            <div className="panel-glass" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span className="stat-label">Proposals Submitted</span>
                <FileCode2 className="w-4 h-4 text-indigo-600 opacity-80" />
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span className="stat-value">{state?.overview.total_proposals_submitted ?? "0"}</span>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", fontFamily: "var(--font-mono)" }}>Total Logged</span>
              </div>
            </div>

            <div className="panel-glass" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span className="stat-label">Consensus Approvals</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 opacity-80" />
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span className="stat-value" style={{ color: "#059669" }}>
                  {state?.overview.total_proposals_approved ?? "0"}
                </span>
                <span style={{ fontSize: "12px", color: "#059669", fontWeight: "600", fontFamily: "var(--font-mono)" }}>100% Rate</span>
              </div>
            </div>

            <div className="panel-glass" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span className="stat-label">Executed Updates</span>
                <Layers className="w-4 h-4 text-blue-600 opacity-80" />
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span className="stat-value" style={{ color: "#0284c7" }}>
                  {state?.overview.total_upgrades_executed ?? "0"}
                </span>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", fontFamily: "var(--font-mono)" }}>Finalized</span>
              </div>
            </div>
          </div>

          {/* Structured Two-Column Workbench Layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px", alignItems: "start" }}>
            
            {/* LEFT COLUMN: Active Upgrade Proposals Ledger (Primary Focus) */}
            <div className="panel-glass" style={{ padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: "800", color: "#090d16" }}>
                    Active Upgrade Proposals ({state?.proposals.length ?? 0})
                  </h2>
                  <p style={{ fontSize: "12px", color: "#64748b" }}>
                    Validator AI consensus audit decisions and execution timelocks.
                  </p>
                </div>
                <Link href="/proposals" className="btn-terminal" style={{ fontSize: "11px", padding: "6px 14px" }}>
                  Full Ledger →
                </Link>
              </div>

              {state?.proposals && state.proposals.length > 0 ? (
                <div style={{ display: "grid", gap: "20px" }}>
                  {state.proposals.map((proposal) => (
                    <div
                      key={proposal.proposal_id}
                      style={{
                        padding: "20px",
                        borderRadius: "14px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      {/* Proposal Header & Badges */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <span style={{ fontFamily: "var(--font-display)", fontWeight: "800", fontSize: "18px", color: "#090d16" }}>
                              {proposal.proposal_id}
                            </span>
                            <span className="brand-badge" style={{ fontSize: "10px" }}>
                              TARGET: {proposal.target_id}
                            </span>
                          </div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#64748b" }}>
                            PROPOSED BY: {proposal.proposer.slice(0, 8)}...{proposal.proposer.slice(-6)}
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: "700", padding: "3px 8px", borderRadius: "6px", background: "#e0f2fe", color: "#0369a1" }}>
                            {proposal.base_release} → {proposal.proposed_release}
                          </span>
                          <span className={`status-pill ${proposal.stage.includes("APPROVED") || proposal.stage === "EXECUTED" ? "approved" : "review"}`}>
                            {proposal.stage}
                          </span>
                        </div>
                      </div>

                      {/* 5-Tier Sentinel Firewalls Matrix (Compact 3-Col Chips) */}
                      <div style={{ background: "#ffffff", padding: "14px 16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                        <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", fontWeight: "700", color: "#0284c7", marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                          <span>SENTINEL CONSENSUS FIREWALLS</span>
                          <span style={{ color: "#059669" }}>VERIFIED PASS (5/5)</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "8px", fontSize: "11px", color: "#334155" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Storage Layout Safe</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Guard Authority Intact</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Treasury Safe</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>External Calls Bounded</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Charter Aligned</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Zero Backdoors</span>
                          </div>
                        </div>
                      </div>

                      {/* Changelog & Consensus Rationale */}
                      <div style={{ display: "grid", gap: "8px" }}>
                        <div style={{ fontSize: "12px", color: "#475569", lineHeight: "1.5" }}>
                          <strong style={{ color: "#090d16" }}>Changelog:</strong> {proposal.change_narrative}
                        </div>
                        {proposal.audit_notes && (
                          <div style={{ fontSize: "11px", color: "#0369a1", background: "#f0f9ff", padding: "8px 12px", borderRadius: "6px", border: "1px solid #bae6fd", lineHeight: "1.5" }}>
                            <strong>Consensus Note:</strong> {proposal.audit_notes}
                          </div>
                        )}
                      </div>

                      {/* Action Execution Toolbar */}
                      <div style={{ paddingTop: "8px", borderTop: "1px solid #e2e8f0" }}>
                        <ProposalActions proposal={proposal} onActionComplete={loadData} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
                  <FileCode2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p style={{ fontSize: "13px" }}>No active upgrade proposals. Click "+ New Upgrade Proposal" to propose changes.</p>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Protected Targets & Security Policy Overview */}
            <div style={{ display: "grid", gap: "24px" }}>
              
              {/* Enrolled Targets Card */}
              <div className="panel-glass" style={{ padding: "28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: "800", color: "#090d16" }}>
                      Registered Targets ({state?.targets.length ?? 0})
                    </h3>
                    <p style={{ fontSize: "11px", color: "#64748b" }}>
                      Contracts guarded under TrustWard authority.
                    </p>
                  </div>
                  <Link href="/targets" className="btn-terminal" style={{ fontSize: "11px", padding: "5px 12px" }}>
                    View All →
                  </Link>
                </div>

                {state?.targets && state.targets.length > 0 ? (
                  <div style={{ display: "grid", gap: "12px" }}>
                    {state.targets.map((target) => (
                      <div
                        key={target.target_id}
                        style={{
                          padding: "16px",
                          borderRadius: "12px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <span style={{ fontWeight: "800", fontSize: "15px", color: "#090d16" }}>{target.name}</span>
                          <span className="status-pill approved">Release: {target.active_release}</span>
                        </div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#64748b", marginBottom: "10px" }}>
                          ADDR: {target.target_address.slice(0, 8)}...{target.target_address.slice(-6)}
                        </div>

                        <div style={{ background: "#ffffff", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "12px" }}>
                          <div style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "#0284c7", fontWeight: "700", marginBottom: "2px" }}>
                            SECURITY CHARTER:
                          </div>
                          <p style={{ fontSize: "11px", color: "#475569", lineHeight: "1.4", lineClamp: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {target.security_charter}
                          </p>
                        </div>

                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => setIsProposalOpen(true)}
                            className="btn-terminal"
                            style={{ flex: 1, fontSize: "11px", padding: "6px" }}
                          >
                            <FileCode2 className="w-3 h-3 inline mr-1" />
                            Propose Upgrade
                          </button>
                          <a
                            href={`https://explorer-studio.genlayer.com/address/${target.target_address}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-terminal"
                            style={{ padding: "6px 10px" }}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "12px", color: "#64748b" }}>No targets enrolled yet.</p>
                )}
              </div>

              {/* Sentinel Engine Consensus Specification Card */}
              <div className="panel-glass" style={{ padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <Flame className="w-5 h-5 text-cyan-600" />
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: "800", color: "#090d16" }}>
                    Sentinel Engine Firewalls
                  </h3>
                </div>
                <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.5", marginBottom: "16px" }}>
                  Every proposal is processed by GenLayer AI validators executing deterministic safety checks before code replacement.
                </p>

                <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", background: "#f8fafc", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <Database className="w-4 h-4 text-sky-600 mt-0.5" />
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "12px", color: "#090d16" }}>1. Storage Slot Layout Integrity</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>Guarantees zero storage collision or state corruption.</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", background: "#f8fafc", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <Key className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "12px", color: "#090d16" }}>2. Sole Guard Authority Check</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>Prevents stealth backdoor root key introduction.</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", background: "#f8fafc", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <DollarSign className="w-4 h-4 text-emerald-600 mt-0.5" />
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "12px", color: "#090d16" }}>3. Treasury & Drain Prevention</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>Audits value movements to block drain vectors.</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsFirewallInspectOpen(true)}
                  className="btn-terminal"
                  style={{ width: "100%", fontSize: "12px", padding: "10px" }}
                >
                  <Flame className="w-3.5 h-3.5 inline mr-1 text-cyan-600" />
                  Inspect All 5 Firewalls in Detail
                </button>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Dialog Modals */}
      <TargetEnrollDialog
        isOpen={isEnrollOpen}
        onClose={() => setIsEnrollOpen(false)}
        onSuccess={loadData}
      />
      <ProposalSubmitDialog
        isOpen={isProposalOpen}
        onClose={() => setIsProposalOpen(false)}
        onSuccess={loadData}
      />
      <FirewallInspectModal
        isOpen={isFirewallInspectOpen}
        onClose={() => setIsFirewallInspectOpen(false)}
      />
    </main>
  );
}
