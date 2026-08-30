"use client";

import React, { useState } from "react";
import { useWallet } from "./wallet-provider";
import { executeContractWrite, waitForTrustWardFinalization } from "@/lib/trustward";
import { Shield, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";

export function TargetEnrollDialog({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { account } = useWallet();
  const [targetAddress, setTargetAddress] = useState("");
  const [targetId, setTargetId] = useState("");
  const [name, setName] = useState("");
  const [charter, setCharter] = useState(
    "Only approve upgrades that preserve the declared storage layout, keep TrustWard as the sole upgrade authority, retain public reads, avoid value movement, and expose the stated version truthfully."
  );
  const [sourceUrl, setSourceUrl] = useState("");
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
    if (!targetAddress || !targetAddress.startsWith("0x")) {
      setError("Please provide a valid target contract address (0x...)");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      // Calls enroll_with_trustward on the target contract
      const hash = await executeContractWrite(
        account,
        targetAddress as `0x${string}`,
        "enroll_with_trustward",
        [targetId, name, charter, sourceUrl]
      );
      setTxHash(hash);
      await waitForTrustWardFinalization(account, hash);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Target enrollment transaction failed");
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
          maxWidth: "620px",
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
          <Shield className="w-6 h-6 text-sky-600" />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: "800", color: "#090d16" }}>
            Enroll Target dApp
          </h2>
        </div>

        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>
          Enrolls your smart contract by invoking <code style={{ fontFamily: "var(--font-mono)", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>enroll_with_trustward</code> directly on the target contract address.
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
            <span>Transaction submitted: {txHash.slice(0, 14)}... Waiting for consensus...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "#475569", fontWeight: "700", marginBottom: "6px" }}>
              TARGET CONTRACT ADDRESS (0x...)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 0x72BD7D...182eCd"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "#475569", fontWeight: "700", marginBottom: "6px" }}>
                TARGET IDENTIFIER (SLUG)
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

            <div>
              <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "#475569", fontWeight: "700", marginBottom: "6px" }}>
                TARGET NAME
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Treasury Vault Core"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  color: "#090d16",
                  fontSize: "13px",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontFamily: "var(--font-mono)", color: "#475569", fontWeight: "700", marginBottom: "6px" }}>
              COMMIT-PINNED GITHUB SOURCE URL
            </label>
            <input
              type="url"
              required
              placeholder="https://raw.githubusercontent.com/org/repo/<40-char-sha>/contracts/Target.py"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
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
              IMMUTABLE GOVERNING CHARTER
            </label>
            <textarea
              required
              rows={3}
              value={charter}
              onChange={(e) => setCharter(e.target.value)}
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
                  <span>Enrolling via Target Contract...</span>
                </>
              ) : (
                <span>Submit Target Enrollment</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
