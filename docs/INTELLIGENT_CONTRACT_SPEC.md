# TrustWard Intelligent Contract Specification

## Methods & Storage Layout

### State Variables in TrustWard
- `dispute_window_seconds: u256`: Minimum lock duration for challenge periods.
- `targets: TreeMap[str, ProtectedTarget]`: Registry of warded target dApps.
- `target_id_by_address: TreeMap[str, str]`: Reverse lookup mapping contract address to target ID.
- `target_ids: DynArray[str]`: Enumerable list of enrolled target identifiers.
- `proposals: TreeMap[str, UpgradeProposal]`: Registry of upgrade proposals.
- `proposal_ids: DynArray[str]`: Enumerable list of proposal identifiers.
- `maintainers: TreeMap[str, bool]`: Maintainer permissions mapping (`target_id:operator_address -> bool`).
- `total_targets_registered: u256`: Total registered targets counter.
- `total_proposals_submitted: u256`: Total proposals counter.
- `total_proposals_approved: u256`: Total approved proposals counter.
- `total_proposals_rejected: u256`: Total rejected proposals counter.
- `total_upgrades_executed: u256`: Total executed bytecode updates counter.

### GenVM Equivalence Principle Integration
Leader and validator nodes execute non-deterministic prompt evaluation via `gl.vm.run_nondet_unsafe`:
```python
def leader_fn() -> dict:
    res = gl.nondet.exec_prompt(prompt, response_format="json")
    return res if isinstance(res, dict) else {}

def validator_fn(leader_res) -> bool:
    try:
        if not isinstance(leader_res, gl.vm.Return):
            return False
        leader_fields = extract_fields(getattr(leader_res, "calldata", None))
        val_res = gl.nondet.exec_prompt(prompt, response_format="json")
        val_fields = extract_fields(val_res)
        return leader_fields is not None and val_fields is not None and leader_fields == val_fields
    except Exception:
        return False
```
