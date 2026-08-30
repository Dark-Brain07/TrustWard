from conftest import CHARTER, SOURCE_URL


def test_v1_records_guard_controller(target_v1, direct_bob):
    # Verify the target v1 stores the correct TrustWard controller address
    assert target_v1.get_guard_controller().lower() == "0x" + direct_bob.hex()


def test_v1_assigns_deployer_as_admin(target_v1, direct_owner):
    # Verify target v1 records the deployer account as administrator
    assert target_v1.get_administrator() == str(direct_owner)


def test_v1_exposes_release_version(target_v1):
    # Verify target v1 exposes correct release version
    assert target_v1.get_version() == "v1"


def test_v1_counter_starts_at_zero(target_v1):
    # Verify counter starts at 0
    assert target_v1.get_counter_value() == "0"


def test_v1_increment_operation(target_v1, direct_vm, direct_alice):
    # Verify anyone can increment the target counter
    direct_vm.sender = direct_alice
    target_v1.increment_counter()
    assert target_v1.get_counter_value() == "1"


def test_v1_allows_concurrent_increments(target_v1, direct_vm, direct_alice, direct_charlie):
    # Verify multiple callers can increment the target counter sequentially
    direct_vm.sender = direct_alice
    target_v1.increment_counter()
    direct_vm.sender = direct_charlie
    target_v1.increment_counter()
    assert target_v1.get_counter_value() == "2"


def test_v1_has_sole_guard_authority(target_v1):
    # Verify target v1 declares TrustWard as its sole authority
    assert target_v1.is_sole_guard_authorized() is True


def test_v1_restricts_enrollment_to_owner(target_v1, direct_vm, direct_alice):
    # Verify non-admin account cannot initiate TrustWard enrollment
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Only the target administrator may request enrollment"):
        target_v1.enroll_with_trustward("warded-core", "Warded Target", CHARTER, SOURCE_URL)


def test_v1_restricts_upgrades_to_controller(target_v1, direct_vm, direct_alice):
    # Verify non-controller accounts cannot trigger direct bytecode upgrades
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Only the TrustWard controller can execute upgrades"):
        target_v1.upgrade(b"unauthorized-bytecode")


def test_v2_records_guard_controller(target_v2, direct_bob):
    # Verify upgraded target v2 keeps controller reference
    assert target_v2.get_guard_controller().lower() == "0x" + direct_bob.hex()


def test_v2_assigns_deployer_as_admin(target_v2, direct_owner):
    # Verify upgraded target v2 keeps admin reference
    assert target_v2.get_administrator() == str(direct_owner)


def test_v2_exposes_upgraded_release_version(target_v2):
    # Verify target v2 exposes upgraded release version
    assert target_v2.get_version() == "v2"


def test_v2_starts_with_storage_compatibility(target_v2):
    # Verify upgraded target v2 preserves storage variables
    assert target_v2.get_counter_value() == "0"


def test_v2_addition_operation(target_v2, direct_vm, direct_alice):
    # Verify the new v2 addition function updates counter correctly
    direct_vm.sender = direct_alice
    target_v2.add_value(7)
    assert target_v2.get_counter_value() == "7"


def test_v2_composes_increment_and_add(target_v2, direct_vm, direct_alice):
    # Verify increment and addition compose correctly on target v2
    direct_vm.sender = direct_alice
    target_v2.increment_counter()
    target_v2.add_value(4)
    assert target_v2.get_counter_value() == "5"


def test_v2_has_sole_guard_authority(target_v2):
    # Verify target v2 retains TrustWard as sole authority
    assert target_v2.is_sole_guard_authorized() is True


def test_v2_exposes_draco_v2_tag_confirmation(target_v2):
    # Verify target v2 exposes its release marker confirmation string
    assert target_v2.get_draco_v2_tag() == "TRUSTWARD_V2_CONFIRMED"


def test_v2_restricts_enrollment_to_owner(target_v2, direct_vm, direct_alice):
    # Verify non-admin account cannot initiate TrustWard enrollment on v2
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Only the target administrator may request enrollment"):
        target_v2.enroll_with_trustward("warded-core", "Warded Target", CHARTER, SOURCE_URL)


def test_v2_restricts_upgrades_to_controller(target_v2, direct_vm, direct_alice):
    # Verify non-controller accounts cannot upgrade target v2
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Only the TrustWard controller can execute upgrades"):
        target_v2.upgrade(b"unauthorized-bytecode")
