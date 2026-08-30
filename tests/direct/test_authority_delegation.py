from conftest import CHARTER, SOURCE_URL


def test_v1_constructor_stores_admin(target_v1, direct_owner):
    assert target_v1.get_administrator() == str(direct_owner)


def test_v1_sole_authority_invariant(target_v1):
    assert target_v1.is_sole_guard_authorized() is True


def test_v2_constructor_stores_admin(target_v2, direct_owner):
    assert target_v2.get_administrator() == str(direct_owner)


def test_v2_sole_authority_invariant(target_v2):
    assert target_v2.is_sole_guard_authorized() is True
