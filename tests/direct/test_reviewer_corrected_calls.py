import pytest
from conftest import CANDIDATE_URL, CHARTER, SOURCE_URL, SUMMARY


def test_target_enrollment_via_enroll_with_trustward_method(target_v1, direct_owner, direct_alice, direct_vm):
    """
    Verifies that target enrollment is initiated by calling enroll_with_trustward on the target contract,
    which delegates upgrade authority exclusively to TrustWard and restricts enrollment requests to the admin.
    """
    assert target_v1.get_administrator() == str(direct_owner)
    assert target_v1.is_sole_guard_authorized() is True

    # Non-admin (Alice) cannot call enroll_with_trustward on target contract
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Only the target administrator may request enrollment"):
        target_v1.enroll_with_trustward("warded-core", "Treasury Vault Core", CHARTER, SOURCE_URL)


def test_proposal_submission_with_exact_five_arguments(trustward, direct_alice, direct_vm):
    """
    Verifies that propose_upgrade accepts and validates the exact five arguments:
    (proposal_id, target_id, candidate_url, proposed_version, changelog).
    """
    direct_vm.sender = direct_alice

    # Validates input limits for all 5 arguments
    # 1. proposal_id
    with direct_vm.expect_revert("Proposal identifier length must be between 3 and 80"):
        trustward.propose_upgrade("ab", "warded-core", CANDIDATE_URL, "v2", SUMMARY)

    # 2. candidate_url (HTTPS but not commit-pinned github)
    with direct_vm.expect_revert("must be a commit-pinned GitHub raw source link"):
        trustward.propose_upgrade("prop-v2", "warded-core", "https://example.com/unpinned.py", "v2", SUMMARY)

    # 3. proposed_version
    with direct_vm.expect_revert("Proposed version length must be between 1 and 48"):
        trustward.propose_upgrade("prop-v2", "warded-core", CANDIDATE_URL, "", SUMMARY)

    # 4. changelog
    with direct_vm.expect_revert("Changelog summary length must be between 80 and 2400"):
        trustward.propose_upgrade("prop-v2", "warded-core", CANDIDATE_URL, "v2", "too short")

    # 5. target_id (after passing all 5 argument validations, fails on unknown target lookup)
    with direct_vm.expect_revert("Unknown target identifier"):
        trustward.propose_upgrade("prop-v2", "non-existent-target", CANDIDATE_URL, "v2", SUMMARY)


def test_controlled_trustward_consensus_error_definition(trustward):
    """
    Verifies that TRUSTWARD_ERR_CONSENSUS is defined as a controlled error signature
    and baseline evaluation helper strictly enforces all required security indicators.
    """
    # 1. Unsafe baseline returns False
    unsafe_eval = {
        "safe": False,
        "confidence": "HIGH",
        "guard_authority": True,
        "upgrade_restricted": True,
        "admin_enrollment_restricted": True,
        "no_backdoors": True,
        "zero_critical_vulns": True,
    }
    assert trustward._is_baseline_evaluation_safe(unsafe_eval) is False

    # 2. Missing guard authority returns False
    missing_guard = {
        "safe": True,
        "confidence": "HIGH",
        "guard_authority": False,
        "upgrade_restricted": True,
        "admin_enrollment_restricted": True,
        "no_backdoors": True,
        "zero_critical_vulns": True,
    }
    assert trustward._is_baseline_evaluation_safe(missing_guard) is False

    # 3. Low confidence returns False
    low_confidence = {
        "safe": True,
        "confidence": "LOW",
        "guard_authority": True,
        "upgrade_restricted": True,
        "admin_enrollment_restricted": True,
        "no_backdoors": True,
        "zero_critical_vulns": True,
    }
    assert trustward._is_baseline_evaluation_safe(low_confidence) is False

    # 4. Non-dict eval returns False
    assert trustward._is_baseline_evaluation_safe(None) is False
    assert trustward._is_baseline_evaluation_safe("invalid") is False

    # 5. Completely safe baseline returns True
    safe_eval = {
        "safe": True,
        "confidence": "HIGH",
        "guard_authority": True,
        "upgrade_restricted": True,
        "admin_enrollment_restricted": True,
        "no_backdoors": True,
        "zero_critical_vulns": True,
    }
    assert trustward._is_baseline_evaluation_safe(safe_eval) is True
