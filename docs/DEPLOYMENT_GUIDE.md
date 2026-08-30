# TrustWard StudioNet Deployment & Operation Guide

## 1. Live Deployment Details
- **Contract Address:** [`0x34C1b813b00b15b14436C263004107c6e28740e6`](https://explorer-studio.genlayer.com/address/0x34C1b813b00b15b14436C263004107c6e28740e6)
- **Explorer URL:** [https://explorer-studio.genlayer.com/address/0x34C1b813b00b15b14436C263004107c6e28740e6](https://explorer-studio.genlayer.com/address/0x34C1b813b00b15b14436C263004107c6e28740e6)
- **Configured Dispute Window:** `300` seconds (5 minutes)

## 2. Deploying Target Contracts & Delegating Authority
1. Deploy `contracts/WardedTargetV1.py` passing `0x34C1b813b00b15b14436C263004107c6e28740e6` to the constructor.
2. Call `enroll_with_trustward(target_id, name, charter, source_url)` on the target contract.
3. Verify that the target is registered by calling `fetch_target(target_id)` on TrustWard.

## 3. Running Upgrade Proposals
1. Submit an upgrade proposal via `propose_upgrade(proposal_id, target_id, candidate_url, version, changelog)`.
2. Trigger the AI validator audit with `audit_proposal(proposal_id)`.
3. Wait out the 300s dispute window, then invoke `dispatch_upgrade(proposal_id)`.
4. Confirm target bytecode installation via `verify_and_finalize(proposal_id)`.
