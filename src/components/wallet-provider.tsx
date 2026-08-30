"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface WalletContextType {
  account: `0x${string}` | null;
  chainId: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  error: string | null;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  chainId: null,
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  error: null,
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<`0x${string}` | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError("No Web3 wallet provider detected. Please install MetaMask or another EVM wallet.");
      return;
    }
    setIsConnecting(true);
    setError(null);
    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts.length > 0) {
        setAccount(accounts[0] as `0x${string}`);
      }

      const chain = (await window.ethereum.request({
        method: "eth_chainId",
      })) as string;
      setChainId(chain);

      // Attempt to auto-switch to StudioNet (0xF22F)
      if (chain !== "0xf22f" && chain !== "0xF22F") {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xF22F" }],
          });
          setChainId("0xF22F");
        } catch (switchError: unknown) {
          // If chain not added, add StudioNet
          if ((switchError as { code?: number })?.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xF22F",
                  chainName: "GenLayer StudioNet",
                  nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
                  rpcUrls: ["https://studio.genlayer.com/api"],
                  blockExplorerUrls: ["https://explorer-studio.genlayer.com"],
                },
              ],
            });
            setChainId("0xF22F");
          }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        const accs = accounts as string[];
        if (accs && accs.length > 0) {
          setAccount(accs[0] as `0x${string}`);
        }
      }).catch(() => {});
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        isConnecting,
        connectWallet,
        disconnectWallet,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
