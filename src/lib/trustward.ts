"use client";

import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";
import type { CalldataEncodable, TransactionHash } from "genlayer-js/types";

export const TRUSTWARD_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TRUSTWARD_CONTRACT as `0x${string}` | undefined;
const rpcEndpoint = process.env.NEXT_PUBLIC_GENLAYER_ENDPOINT ?? "https://studio.genlayer.com/api";
const explorerBase = "https://explorer-studio.genlayer.com";

export type SystemOverview = {
  total_targets_registered: string;
  total_proposals_submitted: string;
  total_proposals_approved: string;
  total_proposals_rejected: string;
  total_upgrades_executed: string;
  dispute_window_seconds: string;
};

export type TargetRecord = {
  target_id: string;
  name: string;
  target_address: string;
  admin_address: string;
  security_charter: string;
  baseline_code_url: string;
  baseline_digest: string;
  active_release: string;
  registered_at: string;
  status_active: boolean;
  upgrade_proposals_count: string;
  active_proposal_id: string;
  is_sole_guard_authorized: boolean;
};

export type ProposalRecord = {
  proposal_id: string;
  target_id: string;
  proposer: string;
  base_release: string;
  base_code_digest: string;
  candidate_code_url: string;
  proposed_release: string;
  change_narrative: string;
  stage: string;
  verdict: string;
  confidence: string;
  storage_layout_safe: boolean;
  controller_authority_intact: boolean;
  treasury_movement_safe: boolean;
  external_calls_bounded: boolean;
  charter_aligned: boolean;
  zero_critical_vulnerabilities: boolean;
  audit_notes: string;
  flagged_anomalies: string;
  submitted_candidate_digest: string;
  candidate_digest: string;
  submitted_at: string;
  audited_at: string;
  dispute_deadline: string;
  disputed: boolean;
  dispute_evidence_url: string;
  dispute_summary: string;
  dispute_evidence_digest: string;
  disputed_at: string;
  dispatch_requested_at: string;
  dispatch_count: string;
  retry_backoff_seconds: string;
};

export type GovernanceState = {
  overview: SystemOverview;
  targets: TargetRecord[];
  proposals: ProposalRecord[];
};

export const getTxExplorerUrl = (txHash: string) => `${explorerBase}/tx/${txHash}`;
export const getAddressExplorerUrl = (address: string) => `${explorerBase}/address/${address}`;

function getTrustWardClient(accountAddress?: `0x${string}`) {
  return createClient({
    chain: studionet,
    endpoint: rpcEndpoint,
    account: accountAddress,
    provider: typeof window === "undefined" ? undefined : window.ethereum,
  });
}

function resolveConfiguredController(): `0x${string}` {
  if (!TRUSTWARD_CONTRACT_ADDRESS || /^0x0{40}$/i.test(TRUSTWARD_CONTRACT_ADDRESS)) {
    throw new Error("TrustWard contract address is not configured. Deploy the contract and set NEXT_PUBLIC_TRUSTWARD_CONTRACT in .env.");
  }
  return TRUSTWARD_CONTRACT_ADDRESS;
}

export async function readGuardState<T>(functionName: string, args: CalldataEncodable[] = []): Promise<T> {
  try {
    const client = getTrustWardClient();
    const address = resolveConfiguredController();
    return (await client.readContract({ address, functionName, args })) as T;
  } catch (error) {
    throw new Error(`State read failed on TrustWard: ${error instanceof Error ? error.message : "RPC transport error"}`);
  }
}

export async function fetchGovernanceState(): Promise<GovernanceState> {
  const [overview, targets, proposals] = await Promise.all([
    readGuardState<SystemOverview>("fetch_overview"),
    readGuardState<TargetRecord[]>("list_all_targets", [0n, 50n]),
    readGuardState<ProposalRecord[]>("list_target_proposals", ["", 0n, 50n]),
  ]);
  return { overview, targets, proposals };
}

export async function executeContractWrite(
  accountAddress: `0x${string}`,
  contractAddress: `0x${string}`,
  functionName: string,
  args: CalldataEncodable[]
): Promise<TransactionHash> {
  const client = getTrustWardClient(accountAddress);
  await client.connect("studionet");
  return (await client.writeContract({
    address: contractAddress,
    functionName,
    args,
    value: 0n,
    consensusMaxRotations: 3,
  })) as TransactionHash;
}

export async function executeTrustWardWrite(
  accountAddress: `0x${string}`,
  functionName: string,
  args: CalldataEncodable[]
): Promise<TransactionHash> {
  return executeContractWrite(accountAddress, resolveConfiguredController(), functionName, args);
}

export async function waitForTrustWardFinalization(accountAddress: `0x${string}`, hash: TransactionHash) {
  const client = getTrustWardClient(accountAddress);
  await client.connect("studionet");
  await client.waitForTransactionReceipt({
    hash,
    status: TransactionStatus.FINALIZED,
    interval: 5000,
    retries: 180,
  });
  const tx = await client.getTransaction({ hash });
  const result = tx?.consensus_data?.leader_receipt?.[0]?.execution_result;
  if (result && result !== "SUCCESS") {
    throw new Error(`Transaction reverted with status: ${result}`);
  }
  return {
    transaction: tx,
    triggeredTxns: (tx as unknown as { triggered_transactions?: string[] } | undefined)?.triggered_transactions ?? [],
  };
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}
