"use client";

import React, { useEffect, useState } from "react";
import { Activity, Wifi } from "lucide-react";

export function NetworkStatusBadge() {
  const [latency, setLatency] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkRpc = async () => {
      const start = Date.now();
      try {
        const res = await fetch("https://studio.genlayer.com/api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", method: "gen_chainId", credentials: null, params: [], id: 1 }),
        });
        if (res.ok) {
          setLatency(Date.now() - start);
          setIsOnline(true);
        }
      } catch {
        setIsOnline(false);
      }
    };
    checkRpc();
    const interval = setInterval(checkRpc, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "4px 10px", borderRadius: "999px", background: "rgba(14, 18, 29, 0.8)", border: "1px solid var(--void-05)", fontSize: "11px", fontFamily: "var(--font-mono)" }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isOnline ? "var(--draco-emerald)" : "var(--draco-crimson)" }}></span>
      <span style={{ color: "var(--ink-secondary)" }}>StudioNet:</span>
      <span style={{ color: "#ffffff", fontWeight: "600" }}>{latency ? `${latency}ms` : "Connected"}</span>
    </div>
  );
}
