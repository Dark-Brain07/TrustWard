# TrustWard Threat Model & Attack Surface Analysis

## Threat Vectors & Mitigations

### 1. Compromised Maintainer Key
- **Threat:** An attacker steals the private key of a target maintainer and attempts to submit a malicious candidate containing a backdoor drain.
- **Mitigation:** The proposal cannot be executed immediately. It is subjected to the 5-tier TrustWard Sentinel Engine validator audit. The AI consensus detects the unauthorized drain, authority hijacking, or charter violation, returning a `REJECT` or `ABSTAIN` verdict. Furthermore, the mandatory dispute window allows whitehat observers to flag anomalies.

### 2. Collusive or Biased LLM Output
- **Threat:** A single validator model hallucinates or is prompted adversarially via prompt injection in code comments.
- **Mitigation:** The prompt explicitly treats all fetched source code as untrusted `EVIDENCE`. Moreover, GenLayer's Optimistic Democracy requires agreement across multiple independent validator nodes executing different LLM backends under the Equivalence Principle.

### 3. State Slot Collision / Storage Corruption
- **Threat:** A candidate upgrade alters the declaration order of storage variables, corrupting existing balances or owner mappings.
- **Mitigation:** The first firewall specifically verifies storage layout compatibility against the immutable baseline. Reordered or deleted storage fields trigger deterministic rejection.

### 4. Malicious GitHub URL Modification
- **Threat:** Maintainers point to a branch URL and alter the code post-submission.
- **Mitigation:** Commit-pinned 40-character hexadecimal SHAs are strictly required. TrustWard preflights and re-verifies the SHA-256 digest at proposal submission, consensus audit, and execution dispatch.
