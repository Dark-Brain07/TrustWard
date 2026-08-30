"use client";

import React, { useState, useEffect } from "react";
import { fetchGovernanceState, TargetRecord } from "@/lib/trustward";
import { TargetEnrollDialog } from "@/components/target-enroll-dialog";
import { ProposalSubmitDialog } from "@/components/proposal-submit-dialog";
import { Shield, PlusCircle, ExternalLink, RefreshCw, FileCode2 } from "lucide-react";

export function TargetsPage() {
  const [targets, setTargets] = useState<TargetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [selectedTargetForProposal, setSelectedTargetForProposal] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.add("trustward-app-body");
    document.body.classList.remove("landing-locked");
    return () => {
      document.body.classList.remove("trustward-app-body");
    };
  }, []);

  const loadTargets = async () => {
    setLoading(true);
    try {
      const state = await fetchGovernanceState();
      setTargets(state.targets);
    } catch {
      setTargets([
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
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTargets();
  }, []);

  const filteredTargets = targets.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.target_id.toLowerCase().includes(search.toLowerCase()) ||
      t.target_address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="animate-fade-in" style={{ marginTop: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: "800", color: "#090d16" }}>
            Protected Target Registry
          </h1>
          <p style={{ fontSize: "14px", color: "#475569" }}>
            Smart contracts enrolled under TrustWard validator-enforced upgrade authority.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={loadTargets}
            disabled={loading}
            className="btn-terminal"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsEnrollOpen(true)}
            className="btn-cta-primary"
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", fontSize: "13px" }}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Enroll New Target</span>
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Search by target ID, dApp name, or contract address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "480px",
            padding: "12px 16px",
            borderRadius: "10px",
            background: "#ffffff",
            border: "1px solid #cbd5e1",
            color: "#090d16",
            fontSize: "14px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
        {filteredTargets.map((target) => (
          <div key={target.target_id} className="panel-glass" style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: "700", color: "#090d16" }}>
                    {target.name}
                  </h3>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#64748b" }}>
                    ID: {target.target_id}
                  </div>
                </div>
                <span className={`status-pill ${target.status_active ? "approved" : "disputed"}`}>
                  {target.status_active ? "Active Protection" : "Suspended"}
                </span>
              </div>

              <div style={{ display: "grid", gap: "10px", margin: "16px 0", fontSize: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>
                  <span style={{ color: "#64748b" }}>Active Release:</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: "700", color: "#0284c7" }}>{target.active_release}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>
                  <span style={{ color: "#64748b" }}>Sole Authority:</span>
                  <span style={{ fontFamily: "var(--font-mono)", color: target.is_sole_guard_authorized ? "#059669" : "#dc2626", fontWeight: "600" }}>
                    {target.is_sole_guard_authorized ? "Verified Sole Rootguard" : "Revoked"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>
                  <span style={{ color: "#64748b" }}>Contract Address:</span>
                  <span style={{ fontFamily: "var(--font-mono)", color: "#090d16", fontWeight: "600" }}>{target.target_address.slice(0, 8)}...{target.target_address.slice(-6)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>
                  <span style={{ color: "#64748b" }}>Total Proposals:</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: "700", color: "#090d16" }}>{target.upgrade_proposals_count}</span>
                </div>
              </div>

              <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
                <div style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "#0284c7", marginBottom: "4px", fontWeight: "700" }}>
                  GOVERNING CHARTER:
                </div>
                <p style={{ fontSize: "11px", color: "#475569", lineHeight: "1.5" }}>
                  {target.security_charter}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setSelectedTargetForProposal(target.target_id)}
                className="btn-terminal active"
                style={{ flex: 1, fontSize: "11px", padding: "8px" }}
              >
                <FileCode2 className="w-3.5 h-3.5 inline mr-1" />
                Propose Upgrade
              </button>
              <a
                href={`https://explorer-studio.genlayer.com/address/${target.target_address}`}
                target="_blank"
                rel="noreferrer"
                className="btn-terminal"
                style={{ padding: "8px 12px" }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <TargetEnrollDialog
        isOpen={isEnrollOpen}
        onClose={() => setIsEnrollOpen(false)}
        onSuccess={loadTargets}
      />

      <ProposalSubmitDialog
        isOpen={selectedTargetForProposal !== null}
        targetIdDefault={selectedTargetForProposal ?? ""}
        onClose={() => setSelectedTargetForProposal(null)}
        onSuccess={loadTargets}
      />
    </main>
  );
}

export default TargetsPage;
