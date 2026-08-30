"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useWallet } from "./wallet-provider";
import { Shield, FileCode2, LayoutDashboard } from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { account, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const [isLanding, setIsLanding] = useState(false);

  useEffect(() => {
    const checkLanding = () => {
      const isRoot = pathname === "/";
      const isLocked = document.body.classList.contains("landing-locked");
      const isApp = document.body.classList.contains("trustward-app-body");
      setIsLanding(isRoot && (isLocked || !isApp));
    };

    checkLanding();
    const interval = setInterval(checkLanding, 100);
    window.addEventListener("trustward:mode-change", checkLanding);
    return () => {
      clearInterval(interval);
      window.removeEventListener("trustward:mode-change", checkLanding);
    };
  }, [pathname]);

  const handleLaunchClick = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("trustward_launched", "true");
    }
    window.dispatchEvent(new CustomEvent("trustward:launch"));
  };

  const handleBrandClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("trustward_launched");
      if (window.location.search) {
        window.history.replaceState({}, "", "/");
      }
    }
    window.dispatchEvent(new CustomEvent("trustward:go-home"));
  };

  const handleDashboardClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("trustward_launched", "true");
    }
    window.dispatchEvent(new CustomEvent("trustward:launch"));
  };

  return (
    <header className="nav-terminal">
      <Link 
        href="/" 
        onClick={handleBrandClick}
        className="nav-brand" 
        style={{ alignItems: "baseline", gap: "8px" }}
      >
        <span className="brand-text">
          TRUSTWARD
        </span>
        <span style={{ 
          fontSize: "11px", 
          fontFamily: "var(--font-mono)", 
          fontWeight: "700", 
          color: "var(--accent-cyan)", 
          background: "rgba(56, 189, 248, 0.1)",
          border: "1px solid rgba(56, 189, 248, 0.25)",
          padding: "2px 6px",
          borderRadius: "4px",
          letterSpacing: "0.05em",
          lineHeight: "1.2"
        }}>
          v1
        </span>
        <span className="brand-badge" style={{ marginLeft: "4px" }}>STUDIONET</span>
      </Link>

      {/* Professional Segmented Navigation Pill (Hidden on Landing Page Cover) */}
      {!isLanding && (
        <nav className="nav-links">
          <Link
            href="/?view=dashboard"
            onClick={handleDashboardClick}
            className={`nav-link ${pathname === "/" ? "active" : ""}`}
          >
            <LayoutDashboard className="nav-link-icon" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/targets"
            className={`nav-link ${pathname === "/targets" ? "active" : ""}`}
          >
            <Shield className="nav-link-icon" />
            <span>Protected Targets</span>
          </Link>
          <Link
            href="/proposals"
            className={`nav-link ${pathname === "/proposals" ? "active" : ""}`}
          >
            <FileCode2 className="nav-link-icon" />
            <span>Proposals Ledger</span>
          </Link>
        </nav>
      )}

      {/* Right Action Button */}
      <div>
        {isLanding ? (
          <button
            onClick={handleLaunchClick}
            className="btn-cta-primary"
            style={{ padding: "10px 24px", fontSize: "13px" }}
          >
            LAUNCH →
          </button>
        ) : account ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="status-pill approved" style={{ fontFamily: "var(--font-mono)" }}>
              <span className="pulse-dot"></span>
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
            <button
              onClick={disconnectWallet}
              className="btn-terminal"
              style={{ padding: "6px 12px", fontSize: "11px" }}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="btn-cta-primary"
            style={{ padding: "10px 20px", fontSize: "13px" }}
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>
    </header>
  );
}
