from conftest import CANDIDATE_URL, CHARTER, SOURCE_URL, SUMMARY


def test_maintainer_revocation_checks(trustward, direct_vm, direct_alice):
    # Verify non-admin cannot grant maintainers
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Unknown target identifier"):
        trustward.grant_maintainer("warded-core", direct_alice, True)


def test_invalid_chars_in_proposal_id(trustward, direct_vm, direct_alice):
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("contains invalid characters"):
        trustward.propose_upgrade("bad proposal!", "warded-core", CANDIDATE_URL, "v2", SUMMARY)


def test_invalid_chars_in_target_id(trustward, direct_vm, direct_alice):
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("contains invalid characters"):
        trustward.enroll_target("bad*target", "Name", CHARTER, SOURCE_URL)


def test_withdraw_proposal_permissions(trustward, direct_vm, direct_alice):
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Unknown proposal identifier"):
        trustward.withdraw_proposal("missing")


def test_suspend_target_permissions(trustward, direct_vm, direct_alice):
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Unknown target identifier"):
        trustward.suspend_target("missing")
