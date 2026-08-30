import hashlib
import json
import time
from pathlib import Path

from gltest import get_contract_factory
from gltest.assertions import tx_execution_succeeded
from gltest.types import TransactionStatus
from gltest.utils import extract_contract_address

CONTRACTS_DIR = Path(__file__).parents[2] / "contracts"
COMMIT_HASH = "a" * 40
V1_SOURCE_URL = f"https://raw.githubusercontent.com/Dark-Brain07/trustward/{COMMIT_HASH}/contracts/WardedTargetV1.py"
V2_SOURCE_URL = f"https://raw.githubusercontent.com/Dark-Brain07/trustward/{COMMIT_HASH}/contracts/WardedTargetV2.py"
CHARTER_TEXT = (
    "Only approve upgrades that preserve the declared storage layout, keep TrustWard as the sole upgrade "
    "authority, retain public reads, avoid value movement, and expose the stated version truthfully."
)
UPGRADE_SUMMARY = (
    "Add a public addition method while retaining the existing storage layout, TrustWard controller authority, "
    "public read methods, and exposing a truthful version response."
)


def _tx_hash(receipt):
    return str(receipt.get("hash") or receipt.get("transaction_hash") or receipt.get("tx_hash") or receipt.get("tx_id") or "UNKNOWN")


def _log_receipt(label, receipt):
    print(f"TRUSTWARD_EVIDENCE {label}={_tx_hash(receipt)}")
    print(
        "TRUSTWARD_RECEIPT "
        + json.dumps(
            {
                "label": label,
                "result_name": receipt.get("result_name"),
                "execution_result": receipt.get("execution_result"),
                "triggered_transactions": receipt.get("triggered_transactions", []),
            },
            default=str,
            sort_keys=True,
        )
    )


def _deploy_contract(factory, args):
    receipt = factory.deploy_contract_tx(
        args=args,
        wait_transaction_status=TransactionStatus.FINALIZED,
        wait_interval=5000,
        wait_retries=180,
    )
    assert tx_execution_succeeded(receipt), receipt
    return factory.build_contract(contract_address=extract_contract_address(receipt)), receipt


def test_trustward_complete_finalized_upgrade_lifecycle_on_studionet():
    guard_factory = get_contract_factory(contract_file_path=CONTRACTS_DIR / "TrustWard.py")
    v1_factory = get_contract_factory(contract_file_path=CONTRACTS_DIR / "WardedTargetV1.py")
    v2_factory = get_contract_factory(contract_file_path=CONTRACTS_DIR / "WardedTargetV2.py")

    # 1. Deploy TrustWard controller with 300 second dispute window
    trustward, controller_deploy = _deploy_contract(guard_factory, [300])
    _log_receipt("CONTROLLER_DEPLOY", controller_deploy)

    # 2. Deploy target WardedTargetV1 pointing to TrustWard
    target_v1, target_deploy = _deploy_contract(v1_factory, [trustward.address])
    _log_receipt("TARGET_DEPLOY", target_deploy)

    print(f"TRUSTWARD_EVIDENCE CONTROLLER_ADDRESS={trustward.address}")
    print(f"TRUSTWARD_EVIDENCE TARGET_ADDRESS={target_v1.address}")

    # 3. Check v1 initial functions
    increment_tx = target_v1.increment_counter(args=[]).transact(
        wait_transaction_status=TransactionStatus.FINALIZED, wait_interval=5000, wait_retries=180
    )
    assert tx_execution_succeeded(increment_tx), increment_tx
    _log_receipt("V1_INCREMENT", increment_tx)
    assert target_v1.get_counter_value(args=[]).call() == "1"
    assert target_v1.get_version(args=[]).call() == "v1"
    assert target_v1.is_sole_guard_authorized(args=[]).call() is True

    # 4. Enroll target with TrustWard upgrade controller
    enroll_tx = target_v1.enroll_with_trustward(args=["warded-core", "Draco Warded Core", CHARTER_TEXT, V1_SOURCE_URL]).transact(
        wait_transaction_status=TransactionStatus.FINALIZED,
        wait_triggered_transactions=True,
        wait_triggered_transactions_status=TransactionStatus.FINALIZED,
        wait_interval=5000,
        wait_retries=180,
    )
    assert tx_execution_succeeded(enroll_tx), enroll_tx
    assert enroll_tx.get("triggered_transactions"), enroll_tx
    _log_receipt("ENROLLMENT_PARENT", enroll_tx)

    # 5. Verify registered target state in TrustWard
    target = trustward.fetch_target(args=["warded-core"]).call()
    assert target["target_address"].lower() == target_v1.address.lower()
    assert target["active_release"] == "v1"
    assert target["baseline_code_url"] == V1_SOURCE_URL
    assert target["baseline_digest"] == hashlib.sha256((CONTRACTS_DIR / "WardedTargetV1.py").read_bytes()).hexdigest()
    assert target["is_sole_guard_authorized"] is True

    # 6. Submit proposal for v2 upgrade
    proposal_tx = trustward.propose_upgrade(args=["draco-v2", "warded-core", V2_SOURCE_URL, "v2", UPGRADE_SUMMARY]).transact(
        wait_transaction_status=TransactionStatus.FINALIZED, wait_interval=5000, wait_retries=180
    )
    assert tx_execution_succeeded(proposal_tx), proposal_tx
    _log_receipt("PROPOSAL_SUBMISSION", proposal_tx)

    # 7. Audit proposal under multi-validator consensus
    audit_tx = trustward.audit_proposal(args=["draco-v2"]).transact(
        wait_transaction_status=TransactionStatus.FINALIZED, wait_interval=5000, wait_retries=240
    )
    assert tx_execution_succeeded(audit_tx), audit_tx
    _log_receipt("CONSENSUS_AUDIT", audit_tx)

    reviewed = trustward.fetch_proposal(args=["draco-v2"]).call()
    assert reviewed["stage"] == "APPROVED_DISPUTE_WINDOW", reviewed
    assert reviewed["storage_layout_safe"] is True
    assert reviewed["controller_authority_intact"] is True
    assert reviewed["treasury_movement_safe"] is True
    assert reviewed["external_calls_bounded"] is True
    assert reviewed["charter_aligned"] is True
    assert reviewed["zero_critical_vulnerabilities"] is True

    # 8. Wait out the 300 second dispute window
    while True:
        now = int(time.time())
        deadline = int(__import__("datetime").datetime.fromisoformat(reviewed["dispute_deadline"].replace("Z", "+00:00")).timestamp())
        if now >= deadline + 2:
            break
        time.sleep(min(15, deadline + 2 - now))

    # 9. Dispatch bytecode upgrade to target
    dispatch_tx = trustward.dispatch_upgrade(args=["draco-v2"]).transact(
        wait_transaction_status=TransactionStatus.FINALIZED,
        wait_triggered_transactions=True,
        wait_triggered_transactions_status=TransactionStatus.FINALIZED,
        wait_interval=5000,
        wait_retries=240,
    )
    assert tx_execution_succeeded(dispatch_tx), dispatch_tx
    _log_receipt("DISPATCH_EXECUTION", dispatch_tx)

    # 10. Instantiate V2 target and test new arithmetic addition
    target_v2 = v2_factory.build_contract(contract_address=target_v1.address)
    assert target_v2.get_counter_value(args=[]).call() == "1"
    assert target_v2.get_version(args=[]).call() == "v2"
    assert target_v2.get_draco_v2_tag(args=[]).call() == "TRUSTWARD_V2_CONFIRMED"

    add_tx = target_v2.add_value(args=[9]).transact(
        wait_transaction_status=TransactionStatus.FINALIZED, wait_interval=5000, wait_retries=180
    )
    assert tx_execution_succeeded(add_tx), add_tx
    _log_receipt("V2_ADDITION", add_tx)
    assert target_v2.get_counter_value(args=[]).call() == "10"

    # 11. Finalize on TrustWard controller
    confirm_tx = trustward.verify_and_finalize(args=["draco-v2"]).transact(
        wait_transaction_status=TransactionStatus.FINALIZED, wait_interval=5000, wait_retries=180
    )
    assert tx_execution_succeeded(confirm_tx), confirm_tx
    _log_receipt("FINALIZATION", confirm_tx)

    final_proposal = trustward.fetch_proposal(args=["draco-v2"]).call()
    final_target = trustward.fetch_target(args=["warded-core"]).call()
    assert final_proposal["stage"] == "EXECUTED"
    assert final_target["active_release"] == "v2"
    assert trustward.fetch_overview(args=[]).call()["total_upgrades_executed"] == "1"
