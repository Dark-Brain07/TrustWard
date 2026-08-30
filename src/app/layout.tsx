import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/components/wallet-provider";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";

export const metadata: Metadata = {
  title: "TrustWard — Consensus Smart Contract Upgrade Governance",
  description: "Autonomous, validator-enforced smart contract upgrade control plane on GenLayer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          {/* Full-Bleed 100vw Edge-to-Edge Background */}
          <div className="global-bg-image landing-view">
            <img src="/usdc_activation_gate.jpg" alt="TrustWard Cyber Gate Background" />
            <div className="global-bg-overlay"></div>
          </div>

          <div className="app-shell">
            <AppHeader />
            {children}
            <AppFooter />
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
