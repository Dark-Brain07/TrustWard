# TrustWard System Architecture & Invariants

## Overview
TrustWard is designed from the ground up as a decentralized governance control plane for smart contract bytecode upgrades. In traditional upgradeable systems (ERC-1967, UUPS, Diamond proxies), upgrade transactions require a single private key or an M-of-N multisig. This presents an enormous centralization vector.

TrustWard replaces this human-key bottleneck with an autonomous, validator-enforced upgrade safety pipeline executed directly on GenLayer.

## Core Architectural Invariants

### Invariant 1: Willing Authority Delegation
Enrolled targets must delegate their system root upgrade permissions exclusively to the TrustWard controller contract address. During enrollment, TrustWard checks that the caller is the target contract itself and verifies that:
$$\text{len}(\text{upgraders}) == 1 \quad \text{and} \quad \text{upgraders}[0] == \text{TrustWard}$$

### Invariant 2: Commit-Pinned Source Immutability
All baseline and candidate source codes must be fetched from commit-pinned GitHub raw URLs containing a 40-character hexadecimal SHA digest:
$$\text{URL} = \text{https://raw.githubusercontent.com/}\langle\text{org}\rangle/\langle\text{repo}\rangle/\langle\text{sha256:40}\rangle/\dots$$
Mutable branch references (`main`, `master`, `dev`, `HEAD`) are strictly prohibited and will revert upon input validation.

### Invariant 3: Structured Boolean Normalization
The Equivalence Principle consensus validator normalizes subjective LLM evaluations into a structured tuple of safety flags:
$$\text{SafetyTuple} = (\text{verdict}, \text{confidence}, \text{storage\_safe}, \text{authority\_intact}, \text{treasury\_safe}, \text{external\_bounded}, \text{charter\_aligned}, \text{zero\_vulns})$$
While the natural language audit rationale is persisted in storage for human review, it is strictly excluded from equivalence comparisons to eliminate spurious consensus splits.

### Invariant 4: On-Chain HTTPS Dispute Snapshots
To prevent dynamic evidence tampering (e.g. an attacker modifying a dispute document after submission), TrustWard fetches the full HTTP body and stores both the raw bytes and the SHA-256 digest in contract storage before transitioning the proposal to `DISPUTED`.

## Cryptoeconomic Game Theory & Incentive Alignment

1. **Proposal Anti-Spam Bond:** Prevents Denial-of-Service (DoS) attacks on the GenLayer validator network by requiring maintainers to lock collateral that is slashed upon malicious proposal detection.
2. **Dispute Stake-to-Challenge:** Enforces economic skin-in-the-game for community challengers, preventing griefing delays on valid upgrades while rewarding whitehat catches with on-chain bug bounty distributions.
