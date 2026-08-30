import os
import sys
import pytest

_real_unlink = os.unlink

def _safe_unlink(path, *args, **kwargs):
    try:
        return _real_unlink(path, *args, **kwargs)
    except PermissionError:
        return None

os.unlink = _safe_unlink

COMMIT_HASH = "a" * 40
SOURCE_URL = f"https://raw.githubusercontent.com/ODbeke/trustward/{COMMIT_HASH}/contracts/WardedTargetV1.py"
CANDIDATE_URL = f"https://raw.githubusercontent.com/ODbeke/trustward/{COMMIT_HASH}/contracts/WardedTargetV2.py"
CHARTER = (
    "Only approve upgrades that preserve the declared storage layout, keep TrustWard as the sole upgrade "
    "authority, retain public reads, avoid value movement, and expose the stated version truthfully."
)
SUMMARY = (
    "Add a public addition method while retaining the existing storage layout, TrustWard controller authority, "
    "public read methods, and exposing a truthful version response."
)

def warp_time_to(direct_vm, iso_timestamp: str) -> None:
    direct_vm.warp(iso_timestamp)
    gl = sys.modules.get("genlayer.gl")
    if gl is None:
        return
    raw = getattr(gl, "message_raw", None)
    if isinstance(raw, dict):
        raw["datetime"] = iso_timestamp

@pytest.fixture
def trustward(direct_deploy):
    return direct_deploy("contracts/TrustWard.py", 300)

@pytest.fixture
def target_v1(direct_deploy, direct_bob):
    return direct_deploy("contracts/WardedTargetV1.py", direct_bob)

@pytest.fixture
def target_v2(direct_deploy, direct_bob):
    return direct_deploy("contracts/WardedTargetV2.py", direct_bob)
